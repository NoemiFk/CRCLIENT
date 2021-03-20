export class Customer {
    _id:String;
    nameAgency:String;
    name:String;
    email:String;
    phone:Number;
    RFC:String;
    address:any;
    contract:any;

  constructor(customer) {
    this._id=customer._id;
    this.nameAgency=customer.nameAgency;
    this.name=customer.name;
    this.email=  customer.email;
    this.phone=customer.phone;
    this.RFC=customer.RFC;
    this.address=customer.address;
    this.contract=customer.contract;
  }



  get getaddress() {
    return `${this.address.address1}, ${this.address.zipcode} ${this.address.city}`;
  }

  set getaddress(value) {
  }
}
