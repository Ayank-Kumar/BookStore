import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';
import { CartItem } from '../../classes/cart-item';
import { Product } from '../../classes/product';
import { CartRecordsService } from '../../services/cart-records.service';

@Component({
  selector: 'app-custom-toastr',
  templateUrl: './custom-toastr.component.html',
  styleUrl: './custom-toastr.component.css'
})
export class CustomToastrComponent extends Toast{

  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage,
    public router: Router,
    private cartService : CartRecordsService
  ) {
    super(toastrService, toastPackage);
  }

  executeAction() {
    //console.log('Action executed!');
    this.toastPackage.triggerAction('action-executed');
    this.remove();
  }
  
  navigateToPreview(): void {
    this.router.navigate(['/products', '9']);
    this.remove();
  }
  
  addProductToCart(product : Product ){
    const item = new CartItem(product) ;
    this.cartService.addToCart(item) ;
  }
}
