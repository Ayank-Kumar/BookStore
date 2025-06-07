import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../classes/cart-item';
import { Product } from '../../classes/product';
import { CartRecordsService } from '../../services/cart-records.service';
import { ProductService, GetResponse } from '../../services/product-service.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'; // Ensure this import

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  products : Product[] = [] ;
  
  categoryNumber : number = 1 ;
  previousCategoryNumber : number = this.categoryNumber ;
  like : string = "" ;

  currentPage : number = 1 ;
  pageSize : number = 10 ;
  totalItems : number = 0 ;
  pageSizes: number[] = [2, 5, 10, 20];
  
  constructor(
    private productService : ProductService,
    private cartService : CartRecordsService,
    private routes: ActivatedRoute // when someone reaches us via a route
  ){}

  ngOnInit(): void {
    //console.log('ngOnInit called'); // not getting called
    this.routes.paramMap.subscribe(
      () => {
        this.heavyLifter() ;
      },
    );
  }

  heavyLifter(){
    const passedCategoryId : boolean = this.routes.snapshot.paramMap.has('id') ;
    const passedName : boolean = this.routes.snapshot.paramMap.has('name') ;

    if(passedCategoryId){
      this.categoryNumber = +this.routes.snapshot.paramMap.get('id')! ;
      
      if(this.categoryNumber!=this.previousCategoryNumber){
        this.currentPage = 1 ;
      }
      this.previousCategoryNumber = this.categoryNumber ;

      this.fetchCategoryViaPaginatingComponent(this.categoryNumber,this.currentPage,this.pageSize) ;
    }else if(passedName){
      this.like = this.routes.snapshot.paramMap.get('name')! ;
      
      //console.log("for similarity"+this.categoryNumber) ;

      this.fetchSimilarViaPaginatingComponent(this.like,this.currentPage,this.pageSize) ;
    }else{

      //console.log("for no filter category"+this.categoryNumber) ;

      this.productService.getAllProducts(this.currentPage-1,this.pageSize).subscribe(
        (response: GetResponse ) => {
          this.products = response._embedded.products;
        
          this.currentPage = response.page.number+1 ;
          //this.pageSize = response.page.size ;
          this.totalItems = response.page.totalElements ;

          //console.log(this.products); 
          //console.log(this.products); Log after the products have been assigned
        },
        (error) => {
          //console.error('Error fetching products:', error);  // Handle potential errors
        } 
      );
    }

  }

  addProductToCart(product : Product ){
    const item = new CartItem(product) ;
    this.cartService.addToCart(item) ;
  }

  fetchCategoryViaPaginatingComponent(categoryNumber: number,page: number,size: number){
    this.productService.getPageForCategory(categoryNumber,page-1,size).subscribe(
      (response: GetResponse ) => {
        this.products = response._embedded.products;

        this.currentPage = response.page.number+1 ;
        //this.pageSize = response.page.size ;
        this.totalItems = response.page.totalElements ;

        //(this.products);  // Log after the products have been assigned
      },
      (error) => {
        //console.error('Error fetching products:', error);  // Handle potential errors
      }
    )  
  }

  fetchSimilarViaPaginatingComponent(query: string,page: number,size: number){
    this.productService.getPageForSearching(query,page-1,size).subscribe(
      (response: GetResponse ) => {
        this.products = response._embedded.products;
        
        this.currentPage = response.page.number+1 ;
        //this.pageSize = response.page.size ;
        this.totalItems = response.page.totalElements ;

        //console.log(this.products);  // Log after the products have been assigned
      },
      (error) => {
        //console.error('Error fetching products:', error);  // Handle potential errors
      }
    );
  }
  
}
