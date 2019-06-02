const { makeExecutableSchema } = require('graphql-tools');
const { // define resolvers
  authenticateUser_R,
  checkUserExists_R,
  loginUser_R,
  getUser_R,
  addUser_R,
  updateUser_R,
  deleteUser_R
} = require('.././resolvers/mysqlDBResolver');
const { // define mongodb connectors
  authenticateUser_C,
  checkUserExists_C,
  loginUser_C,
  addUser_C,
  updateUser_C,
  getUser_C,
  deleteUser_C
} = require('../connectors/mysqlDB');

// passwrd field on type User shouldn't expose passwords
// instead is used to store json token after successfull login query - loginUser_Q
// it's ok to leave password at UserInput at Mutation
const typeDefs = `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    workerID: String!
    password: String!
  }
  type UserExists {
    workerID: String!
    password: String!
  }
  type LoginUser {
    password: String!
  }
  type Token {
    token: String!
  }
  type Result {
    result: String!
  }
  type Query {
    authenticateUser_Q: User
    checkUserExists_Q(firstName:String!, lastName:String!): UserExists
    loginUser_Q(workerID:String!,password:String!): Token
    getUser_Q(token:String!): [User]
    deleteUser_Q: Result
  }
  type Mutation {
    addUser_M(firstName:String!,lastName:String!,workerID:String!): User
    updateUser_M(firstName:String!,lastName:String!,workerID:String!): User
  }
`;

const resolvers = {
  Query: {
    authenticateUser_Q: (_, args, context) => authenticateUser_R(context, authenticateUser_C),
    checkUserExists_Q: (_, args, context) => checkUserExists_R(args, checkUserExists_C), //check if user email already exists, for new user id creation
    loginUser_Q: (_, args, context) => loginUser_R(args, loginUser_C),
    getUser_Q: (_, args, context) => getUser_R(context, getUser_C),
    deleteUser_Q: (_, args, context) => deleteUser_R(context, args, deleteUser_C)
  },
  Mutation: {
    addUser_M: (_, args, context) => addUser_R(args,addUser_C), // first time user is created see - connector where a dummy role is inserted
    updateUser_M: (_, args, context) => updateUser_R(context,args,updateUser_C), //check jwt token, validate if user is self then update own email & password but NOT the roles
  }
};

module.exports = new makeExecutableSchema({ typeDefs, resolvers });
