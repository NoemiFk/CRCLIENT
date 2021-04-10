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

@Component({
  selector: 'vex-map-update',
  templateUrl: './map-update.component.html',
  styleUrls: ['./map-update.component.scss']
})
export class MapUpdateComponent implements OnInit {

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
              private dialogRef: MatDialogRef<MapUpdateComponent>,
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
    console.log("-------!!!!",this.defaults)
    if (this.defaults.type!='load') {
      this.mode = 'create';
    } else {
      this.mode = 'update';
    }
    this.save()

  }

  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }
info={  "validate": [
  {
    "name": "CPEmpleo",
    "count": 0
  },
  {
    "name": "TelCliente",
    "count": 0
  }
],
"insertedCount": 0,
"update": {
  "new": 0,
  "updated": 0,
  "eliminated": 0
}}
  createCustomer() {

    console.log("CREAR")

    this.Services.createRegister(this.defaults.cart,"60558e719a5a98d506ce1fa7")
    .subscribe(
        data => {
          if(data.success){
            console.log(data.data)
            this.info=data.data
          }
        },
        error => {
          //this.error=true
        });

  }

  updateCustomer() {
    console.log("UPDATE")
    this.Services.updateRegister(this.defaults.cart,"60558e719a5a98d506ce1fa7")
    .subscribe(
        data => {
          if(data.success){
            console.log(data.data)
            this.info=data.data
          }
        },
        error => {
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
