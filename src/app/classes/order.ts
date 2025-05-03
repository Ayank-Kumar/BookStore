import { Customer } from "./purchase/customer";
import { OrderItem } from "./purchase/order-item";

export class Order {
    constructor(
        public id : number ,
        public orderTrackingNumber : string ,
        public totalPrice : number ,
        public totalQuantity : number ,
        public dateCreated : Date ,
        public lastUpdated : Date ,
        public orderItems : OrderItem[],
        public customer : Customer,
        public status : string
    ){}
}
