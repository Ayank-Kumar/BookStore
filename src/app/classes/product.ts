
export class Product {

    // private banaya tha, to class ke bahar access nahi kr paa rahe the
    constructor(
        public active : boolean,
        
        public categoryId : number,
        public id : number,
        public unitPrice : number,
        public unitsInStock : number,

        public dateCreated : Date,
        public lastUpdated : Date,

        public description : string,
        public imageUrl : string,
        public name : string,
        public sku : string,
    ){

    }
}
