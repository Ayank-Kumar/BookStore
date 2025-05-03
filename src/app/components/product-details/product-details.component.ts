import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../classes/cart-item';
import { Product } from '../../classes/product';
import { CartRecordsService } from '../../services/cart-records.service';
import { ProductService } from '../../services/product-service.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  product: Product = {} as Product;
  
  constructor(
    private productService : ProductService,
    private routes : ActivatedRoute,
    private cartService : CartRecordsService,
  ){}
  
  ngOnInit(): void{
    this.routes.paramMap.subscribe(
      () => this.getProduct() 
    )
  }

  getProduct(){
    const id = +this.routes.snapshot.paramMap.get('id')! ;

    this.productService.getProductWithId(id).subscribe(
      (data) => {this.product = data} 
    )
  }

  addProductToCart(product : Product ){

    const item = new CartItem(product) ;

    this.cartService.addToCart(item) ;
  }
}
