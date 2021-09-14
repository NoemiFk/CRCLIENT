import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Portafolio } from '../interfaces/Portafolio.model';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import icInfo from '@iconify/icons-ic/info';
@Component({
  selector: 'vex-mapeo-update',
  templateUrl: './mapeo-update.component.html',
  styleUrls: ['./mapeo-update.component.scss']
})
export class MapUpdateComponent implements OnInit {

  static id = 100;

  mode: 'create' | 'update' = 'create';
  agency={};

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  icInfo=icInfo;
  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  CustomersList={}
  map=[];
  columns1=[]
  analysis=[]
  segmentation=[]
  strategies=[]
  customerPortal=[]
  endorsement=[]
  validations=[]
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<MapUpdateComponent>,
              private Services: Services,
              private snackbar: MatSnackBar) {
  }
  displayedColumnsA2: string[] = ['Dato','Segmentación','Comunicación','Portal','Aval','Validación'];
  portafolio_id="";
  ngOnInit() {
    
    if (this.defaults) {
      this.mode = 'update';
      this.portafolio_id = this.defaults._id;
      let portafolio=this.defaults
      //console.log(this.defaults)
      this.getMap(this.portafolio_id)
      this.defaults= {
        "_id":portafolio._id,
      "name_portafolio": portafolio.name_portafolio,
      "description": portafolio.description,
      "agency_id": portafolio.agency_id,
      "type": portafolio.type,
      "client_id": portafolio.client_id,
      }
      console.log(this.defaults)
    } else {
      this.defaults = {} as Portafolio;
    }
  }
  table=[]
  getMap(id){
    this.Services.getMap(id)
    .subscribe(
        data => {
          console.log("Hola ", data)
          if(data.success){
            console.log(data.data)
            this.map=data.data.datos;
            this.analysis=data.data.analysis
            this.segmentation=data.data.segmentation
            this.strategies=data.data.strategies
            this.customerPortal=data.data.customerPortal;
            this.endorsement=data.data.endorsement||[];
            this.validations=data.data.validations
            console.log(this.analysis)
            this.map.forEach((element , i)=> {
              
              this.table.push(
                {
                  map:element,
                  segmentation:this.segmentation[i],
                  strategies:this.strategies[i],
                  customerPortal:this.customerPortal[i],
                  endorsement:this.endorsement[i],
                  validations:this.validations[i]
                })
            });
            console.log(this.table)
           /* this.map.forEach(element => {
               this.endorsement.push({
                 data:element.toString(),
                 status:false
               });
              });*/
            //this.segmentacion=data.data.segmentation
           // this.CustomersList=data.data
            
          }
        },
        error => {
          //this.error=true
        });
  }
  save() {
    console.log(this.analysis)
      this.updateMap();
  }

  saveChange(val,index){
    console.log("val,index",val,index)
    switch (val) {
      case "analysis":
        console.log(this.analysis[index].status)
        if(this.analysis[index].status) this.analysis[index].status=false
        else this.analysis[index].status=true
        console.log(this.analysis[index])
        break;
        case "segmentation":
          console.log(this.segmentation[index].status)
          if(this.segmentation[index].status) this.segmentation[index].status=false
          else this.segmentation[index].status=true
          console.log(this.segmentation[index])
        break;
        case "strategies":
          console.log(this.strategies[index].status)
          if(this.strategies[index].status) this.strategies[index].status=false
          else this.strategies[index].status=true
          console.log(this.strategies[index])
        break;
        case "customerPortal":
          console.log(this.customerPortal[index].status)
          if(this.customerPortal[index].status) this.customerPortal[index].status=false
          else this.customerPortal[index].status=true
          console.log(this.customerPortal[index])
        break;
        case "endorsement":
          console.log(this.endorsement[index].status)
          if(this.endorsement[index].status) this.endorsement[index].status=false
          else this.endorsement[index].status=true
          console.log(this.endorsement[index])
        break;
        case "validations":
          console.log(this.validations[index].status)
          if(this.validations[index].status) this.validations[index].status=false
          else this.validations[index].status=true
          console.log(this.validations[index])
        break;
    
      default:
        break;
    }
  }




  
  updateMap(){
    let body={
      portafolio_id:this.portafolio_id,
      datos:this.map,
      analysis: this.analysis,
      segmentation: this.segmentation,
      strategies: this.strategies,
      customerPortal: this.customerPortal,
      endorsement:this.endorsement,
      validations: this.validations
    }
    this.Services.updateMap(body, this.portafolio_id)
    .subscribe(
        data => {
          if(data.success){
            this.snackbar.open(data.data, 'OK', {
              duration: 10000
            });
            this.dialogRef.close(data.data);
          }
        },
        error => {
          console.log(error.error.type)
          this.snackbar.open(error.error.type, 'OK', {
            duration: 10000
          });
          //this.error=true
        });
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
