import { filter } from 'rxjs';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { GoogleApiService } from './google-api.service';

export interface UserInfo {
  info: {
    email: string,
    name: string,
    picture: string
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-google-oauth-example';

  $userInfo?: Promise<any>

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly googleApi: GoogleApiService) {
      oAuthService.events
      .pipe(filter(e => ['discovery_document_loaded'].includes(e.type)))
      .subscribe(e => {
        // getting user profile
        console.log('getting user profile')
        this.$userInfo = oAuthService.loadUserProfile()
      });
  }

  isLoggedIn(): boolean {
    return this.oAuthService.getAccessToken() != undefined
  }

  logout() {
    this.oAuthService.logOut()
  }

}
