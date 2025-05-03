import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductCategory } from '../classes/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private baseUrl = environment.baseUrl +  "product-category" ;

  constructor(
    private http: HttpClient
  ) { }

  getCategoriesList() : Observable<ProductCategory[]> {
    return this.http.get<GetResponse>(this.baseUrl).pipe(
      map(response => 
      {
        //console.log('API Response:', response);
        return response._embedded.productCategory
      }
      )
    ) ;
  }
}

interface GetResponse {
  _embedded : {
    productCategory : ProductCategory[] ;
  }  
}
