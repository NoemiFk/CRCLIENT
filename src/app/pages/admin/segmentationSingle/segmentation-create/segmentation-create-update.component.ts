import { Component, Inject, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Segmentation } from '../interfaces/segmentation.model';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';
import {Services} from '../../../../Services/services'
import { MatSelectChange } from '@angular/material/select';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import { ApexOptions } from '../../../../../@vex/components/chart/chart.component';
import { defaultChartOptions } from '../../../../../@vex/utils/default-chart-options';
import { createDateArray } from '../../../../../@vex/utils/create-date-array';

@Component({
  selector: 'vex-segmentation-create-update',
  templateUrl: './segmentation-create-update.component.html',
  styleUrls: ['./segmentation-create-update.component.scss']
})
export class SegmentationCreateComponent implements OnInit {

  static id = 100;


  

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  openCriterio2=false

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;

  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<SegmentationCreateComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }
client_name=""
portafolio_name=""
  ngOnInit() {
     console.log(createDateArray(12))
    this.getCustomersList();
    if (this.defaults) {
      this.mode = 'update';
      this.client_name= this.defaults.client_id.name
      this.portafolio_name= this.defaults.portafolio_id.portafolio_name
    } else {
      this.defaults = {} as Segmentation;
    }
    console.log(this.defaults.client_id)

    this.form = this.fb.group({
      name: [this.defaults.name_segmentation || ''],
      description: [this.defaults.description || ''],
      client_id: [this.defaults.client_id || ''],
      portafolio_id: [this.defaults.portafolio_id || ''],
      client_name: [ this.client_name || ''],
      portafolio_name: [this.portafolio_name || '']
    });
    this.form.get('portafolio_name').disable();
    this.form.get('client_name').disable();
  }

  info=0
  guardar1(){
    const segmentacion = this.form.value;
    console.log(segmentacion.criterio1)
    this.Services.getASR(segmentacion.criterio1,segmentacion.portafolio_id._id, segmentacion.rango1A, segmentacion.rango1B)
      .subscribe(
          data => {
            console.log("Hola ", data)
            if(data.success){
               console.log(data.data)
               this.info=data.data;
               
            }
          },
          error => {
            //this.error=true
          });
  }
  segmentacion=[];
  getMap(id){
      this.Services.getMap(id)
      .subscribe(
          data => {
            console.log("Hola ", data)
            if(data.success){
              this.segmentacion=data.data.segmentation
             // this.CustomersList=data.data
              
            }
          },
          error => {
            //this.error=true
          });
    }
    CustomersList=[];
    getCustomersList() {
      this.Services.getCustomersList(this.client.agency_id)
      .subscribe(
          data => {
            //console.log("Hola ", data)
            if(data.success){
              this.CustomersList=data.data
              
              
            }
          },
          error => {
            //this.error=true
          });
    }
    PortafoliosList=[];
    getPortafoliosList(client_id) {
      //console.log("GET PORTAFOLOS",this.client.agency_id, client_id)
       this.Services.getPortafoliosList(client_id)
       .subscribe(
           data => {
             //console.log("Portafolios ", data)
             if(data.success){
               this.PortafoliosList=data.data
             }
           },
           error => {
             //this.error=true
           });
     }
     cliente={
       _id:""
     }
    changeCliente(change: MatSelectChange,){
       console.log(change)
      this.cliente=change.value
      this.portafolio.client=change.value.name
      this.getPortafoliosList(change.value._id)
    }
    total=0
    portafolio={
      _id:"",
      client:'',
      name_portafolio:'',
      register:0
    }
    changePortafolio(change: MatSelectChange,){
      console.log(change.value._id)
      this.portafolio=change.value;
      this.total=change.value.register;
     this.getMap(change.value._id)
   }
  save() {
    if (this.mode === 'create') {
      this.createSegmentation();
    } else if (this.mode === 'update') {
      this.updateSegmentation();
    }
  }

  createSegmentation() {
    const segmentation = this.form.value;
    let body={
      "name_segmentation": segmentation.name,
      "description":segmentation.description,
      "client_id":this.cliente._id,
      "portafolio_id": this.portafolio._id,
      "agency_id": this.client.agency_id,
      "segmentation":[]
    }
    console.log(body)

    this.Services.createSegmentation(body)
       .subscribe(
           data => {
             //console.log("Portafolios ", data)
             if(data.success){
               
               this.dialogRef.close(segmentation);
             }
           },
           error => {
             //this.error=true
           });
  }

  updateSegmentation() {
    const customer = this.form.value;
    customer.id = this.defaults.id;

    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
