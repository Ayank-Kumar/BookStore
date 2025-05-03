import { Product } from "./product"

export class CartItem {

    public id : number ;
    public unitPrice : number ;
    public imageUrl : string ;
    public name : string ;
    public quantity: number ;

    constructor(
        product : Product    
    ){
        this.id = product.id ,
        this.unitPrice = product.unitPrice,
        this.imageUrl = product.imageUrl,
        this.name = product.name,
        this.quantity = 1 
    }
}
