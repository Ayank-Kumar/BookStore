import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MapsService } from '../../services/maps.service';
import { MapsPayload } from '../../classes/mapsPayload';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomToastrComponent } from '../custom-toastr/custom-toastr.component';
import { CartItem } from '../../classes/cart-item';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product-service.service';
import { CartRecordsService } from '../../services/cart-records.service';
import { lastValueFrom } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'], // Corrected property
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('locationInput', { static: false }) locationInput!: ElementRef;
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  formattedAddress: any;
  
  lat: number;
  lng: number;
  confirmed: boolean;
  fast: boolean ;
  aqi: number ;
  category: string ;
  product: Product = {} as Product;

  constructor(
    private spinner: NgxSpinnerService ,
    private mapsService : MapsService , 
    private router: Router , 
    private toastr: ToastrService,
    private cartService : CartRecordsService,
    private productService : ProductService
  ) {
    this.lat = 37.4221;
    this.lng = -122.0841;
    this.confirmed = false;
    this.fast = false ;
    this.aqi = 0 ;
    this.category = '' ;
  }

  map: any;
  marker: any;
  autocomplete: any;
  place: any;

  ngOnInit() {
    // Initialization if needed

    this.mapsService.subscribingEvent.subscribe(
      (data) => {
        this.aqi = data.aqi ;
        this.category = data.category ;
        //console.log(this.aqi) ;
      }
    )
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.initializeAutocomplete();
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: 37.4221, lng: -122.0841 },
      zoom: 15,
      fullscreenControl: true,
      mapTypeControl: true,
      streetViewControl: false,
      zoomControl: true,
      maxZoom: 22,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
    });
  }

  initializeAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.locationInput.nativeElement,
      {
        fields: ['address_components', 'geometry', 'name', 'formatted_address'],
        // 'types' option is omitted to include all place types
      }
    );

    this.autocomplete.addListener('place_changed', () => {
      this.spinner.show();
      this.place = this.autocomplete.getPlace();
      if (!this.place.geometry) {
        window.alert(`No details available for input: '${this.place.name}'`);
        return;
      }
      this.renderAddress(this.place);
      this.fillInAddress(this.place);
      this.spinner.hide();
    });
  }

  renderAddress(place: any) {
    if (place.geometry && place.geometry.location) {
      this.map.panTo(place.geometry.location);
      this.map.setZoom(17); // Adjust as needed
      this.marker.setPosition(place.geometry.location);

      this.lat = this.place.geometry.location.lat();
      this.lng = this.place.geometry.location.lng();
    } else {
      this.marker.setPosition(null);
    }
  }

  // Get the user's current location
  getCurrentLocation() {
    this.spinner.show();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.getAddressFromGeometry(coords);
          this.spinner.hide();
          // Optionally, reverse geocode to get the address and fill inputs
        },
        (error) => {
          console.error('Error getting location', error);
          this.spinner.hide();
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      this.spinner.hide();
    }
  }
  
  fillInAddress(place: any) {
    const addressComponents = place.address_components || [];
    const componentForm: { [key: string]: string } = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name',
    };

    const getElement = (id: string) => document.getElementById(`${id}-input`) as HTMLInputElement;

    // Populate 'Place Name' and 'Formatted Address' fields
    const nameInput = getElement('name');
    const formattedAddressInput = getElement('formatted_address');
    if (nameInput && place.name) {
      nameInput.value = place.name;
    }
    if (formattedAddressInput && place.formatted_address) {
      formattedAddressInput.value = place.formatted_address;
    }
    
    let streetNumber = '';
    let route = '';

    addressComponents.forEach((component: any) => {
      const addressType = component.types[0];
      if (componentForm[addressType]) {
        const val = component[componentForm[addressType]];
        switch (addressType) {
          case 'street_number':
            streetNumber = val;
            break;
          case 'route':
            route = val;
            break;
          default:
            const input = getElement(addressType);
            if (input) {
              input.value = val;
            }
            break;
        }
      }
    });

    // Combine street number and route for the 'Address' field
    const locationInput = this.locationInput.nativeElement as HTMLInputElement;
    if (locationInput) {
      locationInput.value = `${streetNumber} ${route}`.trim();
    }

    this.formattedAddress = this.place.formatted_address;
    this.confirmed = false ;
  }

  toggle(){
    this.fast = !this.fast ;
  }

  getAddressFromGeometry(coords: { lat: number; lng: number }) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.place = {
            address_components: results[0].address_components,
            geometry: {
              location: results[0].geometry.location,
            },
            name: results[0].formatted_address,
            formatted_address: results[0].formatted_address,
          };
          this.renderAddress(this.place);
          this.fillInAddress(this.place);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  showToast() {
    const toastRef = this.toastr.show(
      'Would you like to add this book about Air purifying indoor plants to your cart?',
      'The Place has an AQI of - ' + this.aqi + ' | Category - ' + this.category,
      {
        disableTimeOut: true,
        tapToDismiss: false
      }
    );

    toastRef.onAction.subscribe(action => {
      if (action === 'action-executed') {
         //Handle the action here
         this.getProduct() ;
         //console.log('Main action triggered');
      }
    });
  }

  async getProduct(){
    //const id = +this.routes.snapshot.paramMap.get('id')! ;
    const response = await lastValueFrom( this.productService.getProductWithId(9) );
    this.product = response ; 
    
    //console.log(this.product) ;

    this.addProductToCart(this.product) ;
  }

  addProductToCart(product : Product ){
    const item = new CartItem(product) ;
    this.cartService.addToCart(item) ;
  }

  async confirmAddress() {
    // Handle the confirm action, perhaps emit an event or process the data
    this.confirmed = true;
    
    let mapsRequest : MapsPayload = new MapsPayload(this.lat, this.lng);
    
    this.spinner.show();
    await this.mapsService.findCurrentAirQualityIndex(mapsRequest);
    this.spinner.hide();

    //console.log(this.aqi+" - ") ;
    if(this.aqi >= 30){
      //console.log("high AQI") ;
      this.showToast() ;
      //alert('Please enter the address properly') ;
      //this.router.navigate(['/cart-details']) ;
      //return ;
    }
  }

  async proceedToPayment() {
    let mapsRequest : MapsPayload = new MapsPayload(this.lat, this.lng,this.fast);
    
    this.spinner.show();
    await this.mapsService.findLeastCostWareHouse(mapsRequest);
    this.spinner.hide();

    // If validations pass, navigate to the desired route
    this.router.navigate(['/shopping-cart-form']);
  }

}
