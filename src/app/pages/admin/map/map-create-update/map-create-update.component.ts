import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../interfaces/map.model';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icAdd from '@iconify/icons-ic/twotone-add';
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
import data from '@iconify/icons-ic/twotone-more-vert';

@Component({
  selector: 'vex-map-create-update',
  templateUrl: './map-create-update.component.html',
  styleUrls: ['./map-create-update.component.scss']
})
export class MapCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icAdd = icAdd;
  icPhone = icPhone;
  CustomersList=[];
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  datos=[]
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<MapCreateUpdateComponent>,
              private fb: FormBuilder,private Services: Services) {
  }
  getCustomersList() {
    this.Services.getCustomersList(this.client.agency_id)
    .subscribe(
        data => {
          console.log("Hola ", data)
          if(data.success){
            this.CustomersList=data.data
            
          }
        },
        error => {
          //this.error=true
        });
  }
  
  ngOnInit() {
    this.getCustomersList()
    console.log("-------!!!!",this.defaults)
    this.datos=this.defaults.datos;
    this.createDS(this.datos)
    if (this.defaults) {
      this.mode = 'create';
    } else {
      this.defaults = {} as Customer;
    }

    this.form = this.fb.group({
      dateInit: [this.defaults.dateInit || ''],
      dateUpdate: [this.defaults.dateUpdate || '']
    });
  }
 dataS=[]
 dataA=[]
 dataC=[]
 dataR=[]
 dataE=[]
  createDS(datos){
    datos.forEach(element => {
      let obj={
        status:false,
        data:element
      }
      this.dataS.push(obj)
      this.dataA.push(obj)
      this.dataC.push(obj)
      this.dataR.push(obj)
      this.dataE.push(obj)
    });
    console.log(this.dataS)
  }
  addSeg(index){
    this.dataS[index].status=this.dataS[index].status?false:true
  }
  addAna(index){
    this.dataA[index].status=this.dataA[index].status?false:true
  }
  addEst(index){
    this.dataE[index].status=this.dataE[index].status?false:true
  }
  addPC(index){
    this.dataC[index].status=this.dataC[index].status?false:true
  }
  addRep(index){
    this.dataR[index].status=this.dataR[index].status?false:true
  }
  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const map = this.form.value;

    let body={
        "name": map.name,
        "agency_id": map.agency_id,
        "client_id": map.client_id,
        "portafolio_id": "60558e719a5a98d506ce1fa7",
        "identifier":map.identifier,
        "validations": this.validate,
        "datos":this.datos
  
    }

    this.create(body)
  }
  create(body){
      this.Services.createMap(body)
      .subscribe(
          data => {
            if(data.success){
              console.log(data.data)
              this.dialogRef.close(true);
            }
          },
          error => {
            //this.error=true
          });

  }

  updateCustomer() {
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
 validate=[]
  cart(){
    const map = this.form.value;
    this.validate.push({
      "type": map.type,
      "column": map.column
    })
  }
}
