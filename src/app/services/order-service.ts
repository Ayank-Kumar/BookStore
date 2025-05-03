import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { Order } from '../classes/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient
  ) {}

  basepath = environment.baseUrl + 'orders' ;

  getOrders(email: String) : Promise<GetOrdersHistoryResponse> {  

    // let ya fir const , 
    let url =  `${this.basepath}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}` ;
    
    return lastValueFrom( this.httpClient.get<GetOrdersHistoryResponse>(url) );
  }

}

interface GetOrdersHistoryResponse {
  _embedded : {
      orders : Order[] ;
  }  
}
