import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as rxjs from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const getUser_Q = gql`query userQueries($token: String!) {
  getUser_Q (token: $token) {
    id
    firstName
    lastName
    workerID
  }
}`;
const authenticateUser_Q = gql`query userQueries {
  authenticateUser_Q {
    id
    firstName
    lastName
    workerID
  }
}`;
const checkUserExists_Q = gql`query userQueries($firstName:String!, $lastName:String!) {
  checkUserExists_Q (firstName: $firstName, lastName: $lastName) {
    workerID
    password
  }
}`;
const loginUser_Q = gql`query userQueries($workerID:String!,$password:String!) {
  loginUser_Q(workerID:$workerID,password:$password){
    token
  }
}`;
const deleteUser_Q = gql`query updateQueries {
  deleteUser_Q {
    result
  }
}`;
const createUser_M = gql`mutation updateQueries($firstName: String!, $lastName: String!, $workerID: String!, $password: String!) {
  addUser_M(firstName:$firstName, lastName:$lastName, workerID: $workerID, password:$password){
    workerID
    firstName
    lastName
  }
}`;
const updateUser_M = gql`mutation updateQueries($firstName: String!, $lastName: String!, $workerID: String!) {
  updateUser_M(firstName:$firstName, lastName:$lastName, workerID: $workerID){
    firstName
    lastName
    workerID
  }
}`;

@Injectable()
export class AuthenticationService {
  authToken: any;
  user: any;
  token_type: '';

  public domain = environment.apiURL;

  constructor(
    private http: Http,
    private _http: HttpClient,
    private _apollo: Apollo,
    private router: Router
  ) { }

  registerUser(user) {
    return this._apollo.mutate({
      mutation: createUser_M,
      variables: {
        firstName: user.first_name,
        lastName: user.last_name,
        workerID: user.worker_id,
        password: user.password
      }
    });
  }

  updateUser(user) {
    return this._apollo.mutate({
      mutation: updateUser_M,
      variables: {
        firstName: user.firstName,
        lastName: user.lastName,
        workerID: user.workerID
      }
    });
  }

  closeAccount() {
    return this._apollo.watchQuery({
      query: deleteUser_Q
    });
  }

  checkUserExists(user) {
    return this._apollo.watchQuery({
      query: checkUserExists_Q,
      variables: {
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  }

  loginUser(data){
    return this._apollo.watchQuery({query: loginUser_Q,
      variables: {
        workerID : data.workerID,
        password: data.password
      }
    });
  }

  getCurrentUser() {
    var token = `Bearer ${sessionStorage.getItem('token')}`;
    return this._apollo.watchQuery({ query: authenticateUser_Q });
  }

  getAllUsers() {
    var token = `Bearer ${sessionStorage.getItem('token')}`;
    return this._apollo.watchQuery({ query: getUser_Q,
      variables: {
        token: token
      }
    });
  }

  getUser() {
    return sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
