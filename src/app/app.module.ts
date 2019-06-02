/// modules
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

/// custom modules
import { AppRoutingModule } from './app-routing.module';

/// setup apollo
import { HttpHeaders } from '@angular/common/http';
import { Apollo, ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { environment } from '../environments/environment';

/// pages
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';

/// components
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { DeleteAlertModalComponent } from './components/delete-alert-modal/delete-alert-modal.component';

/// services
import { ValidateService } from './services/validate.service';
import { AuthenticationService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { MainHeaderComponent } from './components/main-header/main-header.component';


/// OAuth Login Option
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com")
    // provider: new GoogleLoginProvider("707984240246-03rvfev95j4ukvp5lksad7pv8l1mfoqs.apps.googleusercontent.com")
  },
  // {
  //   id: FacebookLoginProvider.PROVIDER_ID,
  //   provider: new FacebookLoginProvider("Facebook-App-Id")
  // }
]);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
};

export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({uri: environment.graphql});

  const auth = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = sessionStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    // in this example we assume headers property exists
    // and it is an instance of HttpHeaders
    if (!token) {
      return {};
    } else {
      return {
        // headers: headers.append('Authorization', `Bearer ${token}`)
        // headers: new HttpHeaders().set('Authorization', `${token}`)
        // headers: new HttpHeaders().set('token', `Bearer ${token}`)
        headers: new HttpHeaders().set('token', `Bearer ${token}`)
      };
    }
  });
  return {
    //link: httpLink.create({uri: environment.graphql}),
    link: auth.concat(http),
    cache: new InMemoryCache(),
  };
}

export function provideConfig() {
  return config;
}

@NgModule({
  entryComponents: [
    EditUserComponent,
    DeleteAlertModalComponent
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    MainHeaderComponent,
    EditUserComponent,
    DeleteAlertModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    SocialLoginModule,
    ApolloModule,
    HttpLinkModule,
    NgbModule,
    PerfectScrollbarModule,
  ],
  providers: [
    Title,
    ValidateService,
    AuthenticationService,
    AuthGuard,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
