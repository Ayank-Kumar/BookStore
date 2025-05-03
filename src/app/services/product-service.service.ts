import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../classes/product';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Services are for integration - [b/w frontend and backend]
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.baseUrl + "products" ;

  // bhai parameter mai declare krne se boilerplate code hatega na !!
  constructor(
    private http: HttpClient
  ) {}

  getPageForCategory(category: number , page : number , size : number){
    return this.http.get<GetResponse>(`${this.baseUrl}/search/findByCategoryId?id=${category}&page=${page}&size=${size}`
).pipe(
      map(
        response => 
          {
            //console.log('API Page Response for Category:', response);
            return response ;
          }
      )
    )
  }

  getPageForSearching(pattern: string , page : number , size : number){
    return this.http.get<GetResponse>(this.baseUrl + `/search/findByNameContaining?name=${pattern}&page=${page}&size=${size}`
    ).pipe(
      map(
        response => 
          {
            //console.log('API Page Response for Category:', response);
            return response ;
          }
      )
    )
  }

  getAllProducts( page : number , size : number ) {
    return this.http.get<GetResponse>( `${this.baseUrl}?page=${page}&size=${size}` ).pipe(
      map(
        response => 
          {
            //console.log('API Response for Name:', response);
            return response ; 
          }
      )
    );
  }

  // used in product-details component
  getProductWithId(id : number){
    return this.http.get<Product>(this.baseUrl+"/"+id).pipe(
      map(response => 
      {
        //console.log('API Response for Product Id:', response);
        return response ;
      }
      )
    );
  }

}

// small case hota hai interface
export interface GetResponse {
  _embedded : {
    products : Product[] ;
  }  
  page : {
    size: number ,
    totalElements: number,
    totalPages: number ,
    number : number
  }
}
// This all was for maintainability.