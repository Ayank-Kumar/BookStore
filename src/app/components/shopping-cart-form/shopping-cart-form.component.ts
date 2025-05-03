import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Purchase } from '../../classes/purchase';
import { Customer } from '../../classes/purchase/customer';
import { OrderData } from '../../classes/purchase/orderData';
import { OrderItem } from '../../classes/purchase/order-item';
import { CartRecordsService } from '../../services/cart-records.service';
import { PurchaseService } from '../../services/purchase.service';
import { MapsResponse, MapsService } from '../../services/maps.service';
import { Router } from '@angular/router';
import { OktaAuthStateService , OKTA_AUTH } from '@okta/okta-angular';
import * as OktaAuth from '@okta/okta-auth-js'
type OktaAuth = typeof OktaAuth

declare var Razorpay: any;

@Component({
  selector: 'app-shopping-cart-form',
  templateUrl: './shopping-cart-form.component.html',
  styleUrl: './shopping-cart-form.component.css'
})
export class ShoppingCartFormComponent implements OnInit{

  formGroup! : FormGroup ;
  currentStep = 1;
  
  session : Storage = sessionStorage ;

  totalQuantity :number = 0 ;
  totalPrice : number = 0 ;
  // adding ! means that it can be null. We will initialize it later.
  mapsData! : MapsResponse ;

  constructor(
    private formBuilder : FormBuilder,
    private cartService : CartRecordsService,
    private purchaseService : PurchaseService,
    private mapsService : MapsService,
    private router: Router,
    private oktaAuthService: OktaAuthStateService,
        @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ){}
  
  // public findInvalidControls() {
  //   const controls = this.formGroup.controls;
  //   for (const name in controls) {
  //       if (controls[name].invalid) {
  //           //console.log(name);
  //       }
  //   }
  // }

  ngOnInit(): void {
    let email = JSON.parse(this.session.getItem('userEmail') as string) ;
    let firstName = JSON.parse(this.session.getItem('userGivenName') as string) ;
    let lastName = JSON.parse(this.session.getItem('userFamilyName') as string) ;

    this.formGroup = this.formBuilder.group(
      {
        customer : this.formBuilder.group({
          firstName : new FormControl(
            firstName , // This represents the intitial value
            [Validators.required] // can pass a list
          ),
          lastName : new FormControl(
            lastName ,
          ),
          email : new FormControl(
            email , [Validators.required , 
              Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
             ]
          ),
        }),
      }
    )

    this.cartService.subscribingEvent.subscribe(
      (data) => {
        this.totalPrice = data.totalPrice,
        this.totalQuantity = data.totalQuantities
      }
    )

    this.mapsService.subscribingEvent.subscribe(
      (data) => {
        this.mapsData = data ;
        if(this.mapsData.amount === 0){
          //alert('Please enter the address properly') ;
          this.router.navigate(['/cart-details']) ;
          return ;
        }
      }
    )
  }

  get firstName() { // getter name is used as it is in html view
    //return this.formGroup.controls['customer'].get('firstName')?.value;
    return this.formGroup.get('customer.firstName');
  } // good for clean code na , else you would have had to write thes big lines in html
  get lastName() {
    return this.formGroup.get('customer.lastName');
  }
  get email() {
    return this.formGroup.get('customer.email');
  }
  clearForm(){
    this.formGroup.reset() ;
  }

  onSubmit(){
    
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched() ;
      //this.findInvalidControls() ;
      return ;
    }

    // default constructor is not provided by angular.
    let purchaseData : Purchase ;

    let order : OrderData = new OrderData() ;
    order.totalQuantity = this.totalQuantity ;
    order.totalPrice = this.totalPrice + this.mapsData.amount ;

    let customer : Customer = new Customer() ;
    customer = this.formGroup.controls['customer'].value ;

    let orderItems : OrderItem[] ;
    orderItems = this.cartService.cartItems.map(cartItem => new OrderItem(cartItem) ) ;

    purchaseData = new Purchase(order,orderItems,customer) ;

    this.purchaseService.finalPurchase(purchaseData).subscribe(
      next => {
        this.pushPaymentToRazorPay(next)
          .then((paymentResponse) => {
            // Payment successful flow
            console.log('Payment successful:', paymentResponse);
            this.mapsData.amount = parseFloat((0.000000001).toFixed(2));
            this.formGroup.reset();
            this.cartService.reset();
            this.router.navigate(['/orders']) ;
            // Additional success actions
            // this.showSuccessMessage();
          })
          .catch((error) => {
            // Payment failed or cancelled flow
            console.error('Payment failed or cancelled:', error);
            // Handle payment failure
            //this.showFailureMessage(error.message);
          });
      },
      error => {
        alert(`Your order could not be placed due to low Value of Amount. Please try again`) ;
      }
    ) ;
    //console.log(this.formGroup) ;
  }

  //handler function unitilised for now 
  pushPaymentToRazorPay(razorPayOrderResponse: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        key: razorPayOrderResponse.key,
        amount: razorPayOrderResponse.amount,
        currency: razorPayOrderResponse.currency,
        name: this.firstName?.value + ' ' + this.lastName?.value,
        description: 'Thank You For Testing!!',
        image: 'https://cdn.razorpay.com/logos/BUVwvgaqVByGp2_large.jpg',
        order_id: razorPayOrderResponse.orderTrackingId,
        handler: (response: any) => {
          // Payment successful
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            // Payment modal was closed without completing payment
            reject({ error: true, message: 'Payment cancelled by user' });
          }
        },
        prefill: {
          name: this.firstName?.value + ' ' + this.lastName?.value,
          email: this.email?.value,
          contact: '',
        },
        notes: {
          'shipping address': "",
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      const rzp = new Razorpay(options);
      rzp.open();
    });
  }
  

}
