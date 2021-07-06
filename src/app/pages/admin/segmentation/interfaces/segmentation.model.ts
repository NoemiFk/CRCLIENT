export class Segmentation {
  id: number;
  client_id: string;
  name_seg: string;
  portafolio_id: string;
  description: string;
  segmentation: any;
  segment:any

  constructor(segmentation) {
    this.id = segmentation.id;
    this.client_id = segmentation.client_id;
    this.portafolio_id = segmentation.portafolio_id;
    this.name_seg = segmentation.name;
    this.description = segmentation.description;
    this.segmentation = segmentation.segmentation;
    this.segment={}
  }
}
