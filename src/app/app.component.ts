import { filter, lastValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { GoogleApiService } from './google-api.service';

export interface UserInfo {
  info: {
    sub: string
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

  $userInfo?: Promise<UserInfo>
  mailSnippets: string[] = []

  constructor(private readonly oAuthService: OAuthService, private readonly googleApi: GoogleApiService) {
    oAuthService.events.pipe(filter(e => ['discovery_document_loaded'].includes(e.type)))
      .subscribe(e => {
        // getting user profile
        this.$userInfo = oAuthService.loadUserProfile() as Promise<UserInfo>
      });
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }

  logout() {
    this.oAuthService.logOut()
  }

  async getEmails() {
    const userId = (await this.$userInfo)?.info.sub as string
    const messages = await lastValueFrom(this.googleApi.emails(userId))
    messages.messages.forEach( (element: any) => {
      const mail = lastValueFrom(this.googleApi.getMail(userId, element.id))
      mail.then( mail => {
        this.mailSnippets.push(mail.snippet)
      })
    });
  }
}
