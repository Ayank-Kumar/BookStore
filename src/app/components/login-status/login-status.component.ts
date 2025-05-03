import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import * as OktaAuth from '@okta/okta-auth-js'
import { CartRecordsService } from '../../services/cart-records.service';
type OktaAuth = typeof OktaAuth

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  session : Storage = sessionStorage ;

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private cartService: CartRecordsService
  ) { }

  ngOnInit(): void {

    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }
  
  getUserDetails() {
    if (this.isAuthenticated) {

      // Fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res: any ) => {
          this.session.setItem('userEmail', JSON.stringify(res.email as string) );
          this.session.setItem('userGivenName', JSON.stringify(res.given_name as string) );
          this.session.setItem('userFamilyName', JSON.stringify(res.family_name as string) );
          this.userFullName = res.name as string;
        }
      );
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.cartService.reset() ;
    this.oktaAuth.signOut() ;
  }

}
