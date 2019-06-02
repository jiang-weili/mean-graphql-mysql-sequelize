/// modules
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "angularx-social-login";
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

/// services
import { ValidateService } from '../../services/validate.service';
import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../../assets/css/bootstrap.css',
    '../../../assets/css/main.css'
  ]
})
export class LoginComponent implements OnInit {
  worker_id: String;
  password: String;
  LoginErrorMessage: string;
  returnUrl: string;

  user: SocialUser;

  constructor(
    private authService: AuthenticationService,
    private oauthService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.oauthService.authState.subscribe((user) => {
      if (user) {
        this.oauthService.signOut();
      }
    });
  }

  ngOnInit() {
    this.oauthService.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.authService.checkUserExists({firstName: user.firstName, lastName: user.lastName}).valueChanges.subscribe(
          res => {
            if (res.data['checkUserExists_Q']) {
              this.worker_id = res.data['checkUserExists_Q'].workerID;
              this.password = res.data['checkUserExists_Q'].password;
            }
          },
          error => {
            this.LoginErrorMessage = "No Such User";
          }
        );
      }
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
  }

  signInWithGoogle(): void {
    this.oauthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.oauthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.oauthService.signOut();
  }

  onLoginSubmit() {
    this.LoginErrorMessage = null;

    if (!this.worker_id || !this.password) {
      return this.LoginErrorMessage = 'Please enter the worker ID and password.'
    }

    let data = {
      workerID: this.worker_id,
      password: this.password
    };

    this.authService.loginUser(data).valueChanges.subscribe(
      res => {
        if(res.data["loginUser_Q"].token != "") {
          sessionStorage.setItem("token", res.data["loginUser_Q"].token);
          this.router.navigate([this.returnUrl]);
        }
      },
      error => {
        this.LoginErrorMessage = 'Invalid Worker ID or password';
      }
    );
  }
}
