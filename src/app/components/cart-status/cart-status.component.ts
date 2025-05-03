import { Component, Inject } from '@angular/core';
import { CartRecordsService } from '../../services/cart-records.service';
import { OktaAuthStateService , OKTA_AUTH } from '@okta/okta-angular';
import * as OktaAuth from '@okta/okta-auth-js'
import { Router } from '@angular/router';
type OktaAuth = typeof OktaAuth

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent {
  public totalPrice : number = 0 ;
  public totalQuantity : number = 0 ;
  isAuthenticated: any;

  constructor(
    private cartService : CartRecordsService,
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private router: Router
  ){}

  ngOnInit(): void {
    
    this.cartService.subscribingEvent.subscribe(
      (data) => {
        this.totalPrice = data.totalPrice ;
        this.totalQuantity = data.totalQuantities ;
      }
    )

    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
      }
    );

  }

  redirect(){
    if(this.isAuthenticated){
      this.router.navigate(['/cart-details']);
    }else{
      alert("Please login to view cart details");
    }
    
  }

}
