export class Portafolio {
    _id:String;
    name_portafolio:String;
    client_id:String;
    type:String;

  constructor(portafolio) {
    this._id=portafolio._id;
    this.client_id=portafolio.client_id;
    this.name_portafolio=portafolio.name_portafolio;
    this.type=  portafolio.type;
  }
}
