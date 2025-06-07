import { Component, Inject, OnInit } from '@angular/core';
import * as OktaAuth from '@okta/okta-auth-js'
type OktaAuth = typeof OktaAuth
import { OKTA_AUTH } from '@okta/okta-angular';
import myAppConfig from '../../config/my-app-config';
import OktaSignIn from '@okta/okta-signin-widget';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { PurchaseService } from '../../services/purchase.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  oktaSignin: any;

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public ngxSpinnerService: NgxSpinnerService,
    private purchaseService: PurchaseService,
    private router: Router
  ) {
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      useInteractionCodeFlow: true,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      },
      customButtons: [{
        title: 'Continue as Guest',
        className: 'btn-guest',
        click: () => this.handleGuestLogin()
      }]
    });
  }

  private async handleGuestLogin() {
    try {
      // Secure credential retrieval via encrypted environment variables
      this.ngxSpinnerService.show();

      const guestCreds = await lastValueFrom( this.purchaseService.getCredentials() ) ;
      //console.log(guestCreds);
      //console.log(guestCreds.username + ' ' + guestCreds.password);
      
      const transaction = await this.oktaSignin.authClient.signInWithCredentials({
        username: guestCreds.username,
        password: guestCreds.password
      });
  
      if (transaction.status === 'SUCCESS') {
        //console.log('Guest login successful:', transaction);

        // 1. Exchange sessionToken for tokens
        const tokens = await this.oktaSignin.authClient.token.getWithoutPrompt({
          sessionToken: transaction.sessionToken,
          scopes: ['openid', 'profile', 'email']
        });

        // 2. Store tokens in authClient's token manager
        this.oktaSignin.authClient.tokenManager.setTokens(tokens);

        this.oktaAuth.signInWithRedirect();

        this.oktaSignin.remove();
      }else{
        //console.log('Guest login failed:', transaction);
      }
      //   const tokens = await this.oktaSignin.authClient.token.getWithoutPrompt({
      //     sessionToken: transaction.sessionToken,
      //     scopes: ['openid', 'profile', 'email']
      //   });
        
      //   this.handleGuestSession(tokens);
      // }
    } catch (error) {
      //console.error('Guest login failed:', error);
    } finally {
      this.ngxSpinnerService.hide();
    }
  }

  ngOnInit(): void {
    
    this.ngxSpinnerService.show();
    
    // Set a fallback timeout to hide the spinner after a fixed duration
    setTimeout(() => {
      this.ngxSpinnerService.hide(); // Hide spinner if rendering takes too long
    }, 3000);
    
    //this.oktaSignin.remove();
    
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, // this name should be same as div tag id in login.component.html
      (response: any) => {
        //console.log(response) ;
        if (response.status === 'SUCCESS') {
          //console.log('Successfully signed-in');
          this.oktaAuth.signInWithRedirect();
        }
        //this.spinner.hide();
      },
      (error: any) => {
        //console.error('Error during authentication:', error);
        //this.spinner.hide();
        throw error;
      }
    );

  }

  ngOnDestroy(): void {
    this.oktaSignin.remove(); // Destroy widget instance
  }

}
