import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';


function initializeApp(oauthService: OAuthService): Promise<void> {
  return new Promise((resolve, reject) => {

    // needed for token validation
    oauthService.issuer = "https://accounts.google.com"

    // Login-Url
    oauthService.loginUrl = "https://accounts.google.com/o/oauth2/v2/auth"; //Id-Provider?

    // URL of the SPA to redirect the user to after login
    oauthService.redirectUri = window.location.origin;

    // The SPA's id. Register SPA with this id at the auth-server
    oauthService.clientId = "<your client id>";

    // set the scope for the permissions the client should request
    oauthService.scope = "profile";

    // To also enable single-sign-out set the url for your auth-server's logout-endpoint here
    oauthService.logoutUrl = window.location.origin;

    // This method just tries to parse the token(s) within the url when
    // the auth-server redirects the user back to the web-app
    // It doesn't send the user the the login page
    oauthService.tryLogin();

    if (!oauthService.getAccessToken()) {
      oauthService.initLoginFlow()
    }

    resolve();
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [OAuthService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
