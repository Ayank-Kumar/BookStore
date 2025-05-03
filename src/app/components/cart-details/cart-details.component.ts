import { Component } from '@angular/core';
import { CartItem } from '../../classes/cart-item';
import { CartRecordsService } from '../../services/cart-records.service';
import { Router } from '@angular/router';

// declare var Razorpay: any;

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent {
  public cartItems : CartItem[] = [] ;
  public totalPrice : number = 0 ;
  public totalQuantity : number = 0 ;

  constructor(
    private cartService : CartRecordsService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.fetchFromService() ;
  }

  fetchFromService(){
    this.cartItems = this.cartService.cartItems ;
    // Todo: I think the other two variables could also 
    // have a straight field wise dependency rather 
    // than subscribing to changes which the earlier 
    // one too is doing
    this.cartService.subscribingEvent.subscribe(
      (data) => {
        this.totalPrice = data.totalPrice ;
        this.totalQuantity = data.totalQuantities ;
        if(this.totalQuantity === 0){
          //alert('Please enter the address properly') ;
          this.router.navigate(['/products']) ;
          return ;
        }
      }
    )

  }

  addToCart(item : CartItem){
    this.cartService.addToCart(item) ;
  }

  removeCart(item : CartItem){
    this.cartService.removeFromCart(item) ;
  }

}
