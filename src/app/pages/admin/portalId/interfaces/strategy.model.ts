export class Strategy {
  id: number;
  Comunicacion: string;
  name_seg: string;
  portafolio_id: string;
  description: string;
  strategy: any;
  segment:any

  constructor(strategy) {
    this.id = strategy.id;
    this.Comunicacion = strategy.Comunicacion;
    this.portafolio_id = strategy.portafolio_id;
    this.name_seg = strategy.name;
    this.description = strategy.description;
    this.strategy = strategy.strategy;
    this.segment={}
  }
}
