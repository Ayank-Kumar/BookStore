import { Injectable, OnInit } from '@angular/core';
import { CartItem } from '../classes/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartRecordsService {

  cartItems :CartItem[] = [] ;
  totalPriceofCart : number = 0 ;
  totalQuantitiesofCart : number = 0 ;

  storage : Storage = localStorage ;
  // By declaring type declaration. Typescript does safety check on every emitted values 
  emittingEvent = new BehaviorSubject<{totalPrice : number , totalQuantities : number}>( {totalPrice : this.totalPriceofCart , totalQuantities : this.totalQuantitiesofCart} ) ;
  subscribingEvent = this.emittingEvent.asObservable() ;

  constructor() {
    this.fetchItems() ;
  }

  fetchItems(){
    this.cartItems = this.storage.getItem('cartItems') ? JSON.parse(this.storage.getItem('cartItems') as string) : [] ;
    this.totalPriceofCart = this.storage.getItem('totalPriceofCart') ? JSON.parse(this.storage.getItem('totalPriceofCart') as string) : 0 ;
    this.totalQuantitiesofCart = this.storage.getItem('totalQuantitiesofCart') ? JSON.parse(this.storage.getItem('totalQuantitiesofCart') as string) : 0 ;
    this.emitValues() ;
  }

  addToCart(item : CartItem){

    this.totalPriceofCart = parseFloat((this.totalPriceofCart + item.unitPrice).toFixed(2));
    this.totalQuantitiesofCart += 1 ;

    let matchingItem = this.cartItems.find( tempItem => (tempItem.id === item.id) ) ;

    if(matchingItem != null ){
      matchingItem.quantity += 1;
    }else{
      this.cartItems.push(item) ;
    }

    this.emitValues() ;

    this.persistItems() ;
  }

  removeFromCart(item : CartItem){

    this.totalPriceofCart -= item.unitPrice ;
    this.totalQuantitiesofCart -= 1 ;

    let matchingIndex : number = this.cartItems.findIndex( tempItem => (tempItem.id === item.id) ) ; 
    let matchingItem = this.cartItems[matchingIndex] ;
    
    if(matchingItem != null){
      matchingItem.quantity = matchingItem?.quantity-1 ;
    }
    
    if(matchingItem?.quantity==0){
      this.cartItems.splice(matchingIndex,1) ;
    }

    this.emitValues() ;

    this.persistItems() ;
  }

  emitValues(){
    this.emittingEvent.next({
      totalPrice: this.totalPriceofCart,
      totalQuantities: this.totalQuantitiesofCart
    }) ;
  }

  persistItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)) ;
    this.storage.setItem('totalPriceofCart', JSON.stringify(this.totalPriceofCart)) ;
    this.storage.setItem('totalQuantitiesofCart', JSON.stringify(this.totalQuantitiesofCart)) ; 
  }

  clearItems() {
    this.storage.removeItem('cartItems');
    this.storage.removeItem('totalPriceofCart');
    this.storage.removeItem('totalQuantitiesofCart');
  }

  reset() {
    this.cartItems = [] ;
    this.totalPriceofCart = 0 ;
    this.totalQuantitiesofCart = 0 ;

    // Don't know if it necessary to reflect the changes on Cart-Status component
    this.emittingEvent.next({
      totalPrice: this.totalPriceofCart,
      totalQuantities: this.totalQuantitiesofCart
    }) ;

    this.clearItems() ;
  }

}
