export class Portafolio {
    _id:String;
    name:String;
    client_id:String;
    type:String;

  constructor(portafolio) {
    this._id=portafolio._id;
    this.client_id=portafolio.client_id;
    this.name=portafolio.name;
    this.type=  portafolio.type;
  }
}
