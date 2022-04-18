import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthConfig, OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';

const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',

  // strict discovery document disallows urls which not start with issuers url
  strictDiscoveryDocumentValidation: false,

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '194103401533-vv917ah9dt5l01u8o6da8f3sp3qir5ao.apps.googleusercontent.com',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid profile email',

  showDebugInformation: true,
};

function initializeApp(oAuthService: OAuthService): Promise<void> {
  return new Promise((resolve, reject) => {

    // confiure oauth2 service
    oAuthService.configure(authCodeFlowConfig);
    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    oAuthService.loadDiscoveryDocument();
    // // This method just tries to parse the token(s) within the url when
    // // the auth-server redirects the user back to the web-app
    // // It doesn't send the user the the login page
    oAuthService.tryLoginImplicitFlow();

    if (!oAuthService.getAccessToken()) {
      oAuthService.initLoginFlow()
    }

    oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";

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
  },
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: TokenInterceptor,
  //   multi: true
  // }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
