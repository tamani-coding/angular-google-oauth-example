import { OAuthService } from 'angular-oauth2-oidc';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-google-oauth-example';

  constructor(private readonly oAuthService: OAuthService) {

  }

  isLoggedIn(): boolean {
    return this.oAuthService.getAccessToken() != undefined
  }

  logout() {
    this.oAuthService.logOut()
  }
}
