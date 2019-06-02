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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.scss',
    '../../../assets/css/bootstrap.css',
    '../../../assets/css/main.css'
  ]
})
export class RegisterComponent implements OnInit {
  first_name: String;
  last_name: String;
  worker_id: String;
  password: String;
  RegisterErrorMessage: string;

  user: SocialUser;

  constructor(
    private validateService: ValidateService,
    private authService: AuthenticationService,
    private oauthService: AuthService,
    private router: Router
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
        this.first_name = this.user.firstName;
        this.last_name = this.user.lastName;
      }
    });
  }

  signUpWithGoogle(): void {
    this.oauthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signUpWithFB(): void {
    this.oauthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  onRegisterSubmit() {
    this.RegisterErrorMessage = null;

    if (!this.first_name || !this.last_name || !this.worker_id || !this.password) {
      return this.RegisterErrorMessage = 'Please fill all the options.'
    }

    let user = {
      first_name: this.first_name,
      last_name: this.last_name,
      worker_id: this.worker_id,
      password: this.password
    };
    this.authService.registerUser(user)
      .subscribe(
        data => {
          // console.log(data.addUser_M);
          if (data.data.addUser_M.workerID) {
            this.router.navigate(['/login']);
          } else {
            this.RegisterErrorMessage = "WorkerID already exists";
          }
          // this.ngFlashMessageService.showFlashMessage({
          //   messages: ['You are now registered and can now login'],
          //   dismissible: true,
          //   timeout: 3000,
          //   type: 'alert-success'
          // });

        },
        error => {
          // this.ngFlashMessageService.showFlashMessage({
          //   messages: ['Something went wrong'],
          //   dismissible: true,
          //   timeout: 3000,
          //   type: 'alert-danger'
          // });
          this.router.navigate(['/register']);
        });
  }
}
