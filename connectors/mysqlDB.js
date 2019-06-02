// ****** Set up default MYSQL connection START ****** //
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  operatorsAliases: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});
const Schema = sequelize.Schema;

sequelize.authenticate().then(() => { console.log('conneted to MYSQL- database'); })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// ****** Set up default MYSQL connection END ****** //

const User = sequelize.define('user', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
  workerID: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
});

const jwt = require('jsonwebtoken');
require('dotenv').config();
// const User = require('../models/user');
const _ = require('lodash');
const { noRoleError } = require('./../errors/error');

const authenticateUser_C = input => {
  return User.findOne({
    where: { id: input.id }
  }).then((res) => {
    return {
      id: res.dataValues.id,
      firstName: res.dataValues.firstName,
      lastName: res.dataValues.lastName,
      workerID: res.dataValues.workerID,
    };
  });
};
const checkUserExists_C = input => {
  //return User.find({ email: input.email }, { name:1, email: 1, roles: 1 });
  return User.findOne({
    where: { firstName: input.firstName, lastName: input.lastName }
  }).then((res) => {
    return {
      workerID: res.dataValues.workerID,
      password: res.dataValues.password
    };
  });
};

const getUser_C = input => {
  return User.findAll().then(result => {
    let ret_data = [];
    result.forEach(res => {
      ret_data.push({
        id: res.dataValues.id,
        firstName: res.dataValues.firstName,
        lastName: res.dataValues.lastName,
        workerID: res.dataValues.workerID
      });
    });
    return ret_data;
  });
}

const deleteUser_C = input => {
  return User.destroy({
    where: { id: input.id }
  }).then(() => {
    let res = 'deleted successfully an account with id = ' + input.id;
    return {
      result: res
    };
  });
}

const loginUser_C = input => {
  return User.findOne({
    where: { workerID: input.workerID, password: input.password }
  }).then((res) => {
    if(res) {
    return {
      token: jwt.sign(
        { id: res.dataValues.id, workerID: res.dataValues.workerID, firstName: res.dataValues.firstName, lastName: res.dataValues.lastName },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
      )
    };
  }});
  // do not feed password back to query, password stays in database
}
const addUser_C = input => {
  // input.roles = ["dummy"]; // assign a dummy roles at first time user is created
  let user = new User(input);
  return User.findOne({
    where: { workerID: input.workerID }
  }).then((res) => {
    if(res) {
      return {firstName:"", lastName:"", workerID:"", password: ""};
    } else {
      return User.create({ firstName: input.firstName, lastName: input.lastName, workerID: input.workerID, password: input.password }).then((res) => {
        return input;
      });
    }
  });
}

const updateUser_C = input => {
  User.update({ firstName: input.firstName, lastName: input.lastName, workerID: input.workerID }, { where: { id: input.id } }).then((res) => {
    return input;
  });
};

module.exports = {
  authenticateUser_C,
  checkUserExists_C,
  loginUser_C,
  getUser_C,
  addUser_C,
  updateUser_C,
  deleteUser_C
};
