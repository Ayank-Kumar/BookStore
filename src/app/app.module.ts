import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes, AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchMenuComponent } from './components/search-menu/search-menu.component';
import { ShoppingCartFormComponent } from './components/shopping-cart-form/shopping-cart-form.component';
import { OktaAuthModule,OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { ProductService } from './services/product-service.service';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrdersHistoryComponent } from './components/orders-history/orders-history.component';
import { OktaAuthInterceptorService } from './services/okta-auth-interceptor.service';
import { MapComponent } from './components/map/map.component';
import { CustomToastrComponent } from './components/custom-toastr/custom-toastr.component';

const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

@NgModule({
  declarations: [
    AppComponent,
    CartDetailsComponent,
    CartStatusComponent,
    CategoryMenuComponent,
    LoginComponent,
    LoginStatusComponent,
    ProductDetailsComponent,
    ProductListComponent,
    SearchMenuComponent,
    ShoppingCartFormComponent,
    MembersPageComponent,
    OrdersHistoryComponent,
    MapComponent,
    CustomToastrComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule,
    NgbModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgbPaginationModule,
    NgbPaginationModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      toastComponent: CustomToastrComponent,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    })
  ],
  providers: [
    ProductService,
    { provide: OKTA_CONFIG, useValue: { oktaAuth} }, 
    {provide: HTTP_INTERCEPTORS, useClass: OktaAuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

    // "@okta/okta-angular": "^5.2.0",
    // "@okta/okta-auth-js": "^6.4.0",
    // "@okta/okta-signin-widget": "^6.2.0",
