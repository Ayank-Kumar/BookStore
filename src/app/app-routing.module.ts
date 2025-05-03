import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ShoppingCartFormComponent } from './components/shopping-cart-form/shopping-cart-form.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrdersHistoryComponent } from './components/orders-history/orders-history.component';

const routes: Routes = [
  { path: 'login/callback', component: OktaCallbackComponent},
  { path: 'login', component: LoginComponent},
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'members', component: MembersPageComponent , canActivate: [OktaAuthGuard] , data: {onAuthRequired: '/login'}},  
  { path: 'orders', component: OrdersHistoryComponent , canActivate: [OktaAuthGuard] , data: {onAuthRequired: '/login'}}, 
  { path: 'search/:name', component: ProductListComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'shopping-cart-form', component: ShoppingCartFormComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const appRoutes = routes;