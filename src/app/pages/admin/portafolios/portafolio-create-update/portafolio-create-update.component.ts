import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'vex-portafolio-create-update',
  templateUrl: './portafolio-create-update.component.html',
  styleUrls: ['./portafolio-create-update.component.scss']
})
export class PortafolioCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  agency={};

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  CustomersList={}
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<PortafolioCreateUpdateComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }
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

  ngOnInit() {
    this.getCustomersList();
    if (this.defaults) {
      this.mode = 'update';
      let portafolio= this.defaults;
      //console.log(this.defaults)
      this.defaults= {
        "_id":portafolio._id,
      "name_portafolio": portafolio.name,
      "description": portafolio.nameClient,
      "agency_id": portafolio.agency_id,
      "type": portafolio.type,
      "client_id": portafolio.client_id,
      }
      //console.log(this.defaults)
    } else {
      this.defaults = {} as Portafolio;
    }
    this.form = this.fb.group({
      type: [this.defaults.type || ''],
      name_portafolio: [this.defaults.name_portafolio || ''],
      description: [this.defaults.description || ''],
      agency_id: [this.defaults.agency_id || ''],
      client_id: this.defaults.client_id || ''
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createPortafolio();
    } else if (this.mode === 'update') {
      this.updatePortafolio();
    }
  }

  createPortafolio() {
    const portafolio = this.form.value;

    if (!portafolio.imageSrc) {
      portafolio.imageSrc = 'assets/img/avatars/1.jpg';
    }

    let body= {
      "agency_id": this.client.agency_id,
      "name_portafolio": portafolio.name_portafolio,
      "description": portafolio.description,
      "type": portafolio.type,
      "client_id": portafolio.client_id,
    }
     //console.log(body)
      this.createPortafolioA(body);
     

    
  }

  createPortafolioA(body) {
    this.Services.createPortafolio(body)
    .subscribe(
        data => {
          //console.log("Hola ", data)
          if(data.success){
            this.agency=data.data
            this.dialogRef.close(data.data);
          }
        },
        error => {
          //this.error=true
        });
  }

  updatePortafolio() {
    const portafolio = this.form.value;
    portafolio.id = this.defaults.id;

    this.dialogRef.close(portafolio);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
