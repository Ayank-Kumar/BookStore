import { Component, Inject, OnInit } from '@angular/core';
import { ProductCategory } from '../../classes/product-category';
import { ProductCategoryService } from '../../services/product-category.service';
import * as OktaAuth from '@okta/okta-auth-js'
import { OktaAuthStateService ,  OKTA_AUTH} from '@okta/okta-angular';
type OktaAuth = typeof OktaAuth 

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrl: './category-menu.component.css'
})
export class CategoryMenuComponent implements OnInit {

  categories : ProductCategory[] = [] ;
  isCollapsed: any = false ;

  isAuthenticated: boolean = false;
  userFullName: string = '';

  session : Storage = sessionStorage ;

  constructor(
    private categoryService : ProductCategoryService ,
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ){}

  ngOnInit(): void {
    this.fetchCategories() ;

    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {

      // Fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res: any ) => {
          this.session.setItem('userEmail', JSON.stringify(res.email as string) );
          this.session.setItem('userGivenName', JSON.stringify(res.given_name as string) );
          this.session.setItem('userFamilyName', JSON.stringify(res.family_name as string) );
          this.userFullName = res.name as string;
        }
      );
    }
  }

  fetchCategories() : void {

    this.categoryService.getCategoriesList().subscribe(
      (response: ProductCategory[]) => {
        this.categories= response;
        //console.log(this.categories);  // Log after the products have been assigned
      },
      (error: any) => {
        //console.error('Error fetching products:', error);  // Handle potential errors
      }
    );

  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

}
