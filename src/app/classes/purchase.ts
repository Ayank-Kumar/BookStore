import { Customer } from "./purchase/customer";
import { OrderData } from "./purchase/orderData";
import { OrderItem } from "./purchase/order-item";

export class Purchase {

    public order! : OrderData  ;
    public orderItems! : OrderItem[] ;
    public customer! : Customer ;

    constructor( 
    order: OrderData, 
    orderItems: OrderItem[], 
    customer: Customer ) { 
        this.order = order; 
        this.orderItems = orderItems; 
        this.customer = customer; 
    }

}
