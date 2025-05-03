import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order-service';
import { Order } from '../../classes/order';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.css'
})
export class OrdersHistoryComponent implements OnInit{

  ordersList : Order[] = [] ;
  session : Storage = sessionStorage ;

  constructor(
    public orderService: OrderService,
    public ngxSpinnerService: NgxSpinnerService,
    public cd : ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.ngxSpinnerService.show();
    await this.retrieveOrdersHistory() ;
    this.ngxSpinnerService.hide();
  }

  async retrieveOrdersHistory() {
    
    let email = JSON.parse(this.session.getItem('userEmail') as string);
    
    try {
      // Await the Promise returned by getOrders directly.
      const response = await this.orderService.getOrders(email);
      console.log('Orders:', response);
      this.ordersList = response._embedded.orders;
      // For Backup
      this.cd.markForCheck();
    } catch (error) {
      console.error('Error retrieving orders:', error);
    }

  }

  
}
