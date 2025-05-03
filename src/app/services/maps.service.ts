import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MapsPayload } from '../classes/mapsPayload';
import { BehaviorSubject, firstValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  mapsResponse : MapsResponse = {
    closestWareHouse : '' ,
    duration : '' ,
    amount : 0 ,
    aqi : 0 ,
    category : ''
  } ;

  emittingEvent = new BehaviorSubject<MapsResponse>( this.mapsResponse ) ;  
  subscribingEvent = this.emittingEvent.asObservable() ;

  baseurl : string = environment.baseUrlMaps ;
  
  wareHouseUrl : string = this.baseurl + 'find-least-cost-wareHouse' ;
  aqiUrl : string = this.baseurl + 'currentConditions' ;

  constructor(
    private httpClient : HttpClient
  ) {}

  // findLeastCostWareHouse(mapsRequest : MapsPayload){
  //   this.httpClient.post<MapsResponse>(this.url, mapsRequest).subscribe(
  //     (response: MapsResponse) => {
  //       this.mapsResponse = response ;
  //       this.emittingEvent.next(this.mapsResponse);  
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }
  
  async findLeastCostWareHouse(mapsRequest: MapsPayload): Promise<MapsResponse> {
    const observable$ = this.httpClient.post<MapsResponse>(this.wareHouseUrl, mapsRequest).pipe(
      tap((response: MapsResponse) => {
        this.mapsResponse.amount = response.amount;
        this.mapsResponse.closestWareHouse = response.closestWareHouse;
        this.mapsResponse.duration = response.duration;
        this.emittingEvent.next(this.mapsResponse);
      })
    );
  
    return firstValueFrom(observable$);
  }

  async findCurrentAirQualityIndex(mapsRequest: MapsPayload): Promise<MapsResponse> {
    const observable$ = this.httpClient.post<MapsResponse>(this.aqiUrl, mapsRequest).pipe(
      tap((response: MapsResponse) => {
        this.mapsResponse.aqi = response.aqi;
        this.mapsResponse.category = response.category;
        this.emittingEvent.next(this.mapsResponse);
      })
    );
  
    return firstValueFrom(observable$);
  }
  
  reset(){
    this.mapsResponse = {
      closestWareHouse : '' ,
      duration : '' ,
      amount : 0 ,
      aqi : 0 ,
      category : ''
    } ;
    this.emittingEvent.next(this.mapsResponse);
  }
}
export interface MapsResponse {
  closestWareHouse : string ;
  duration : string ;
  amount : number ;
  category : string ;
  aqi : number ;
}