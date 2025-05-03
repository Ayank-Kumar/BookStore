import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../classes/purchase';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  public purchaseUrl : string = environment.baseUrl + "place-order" ;
  public guestCredentialsUrl : string = environment.baseUrl + "get-guest-credentials" ;
  constructor(
    private httpClient : HttpClient
  ) {}

  finalPurchase(payload : Purchase) : Observable<any> {
    return this.httpClient.post(this.purchaseUrl,payload) ;
  }

  getCredentials() : Observable<UserDataResponse> {
    return this.httpClient.get<UserDataResponse>(this.guestCredentialsUrl) ;
  }
  
}
export interface UserDataResponse {
  username: string;
  password: string;
}
