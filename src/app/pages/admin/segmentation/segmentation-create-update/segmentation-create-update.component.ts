import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../interfaces/segmentation.model';
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

@Component({
  selector: 'vex-segmentation-create-update',
  templateUrl: './segmentation-create-update.component.html',
  styleUrls: ['./segmentation-create-update.component.scss']
})
export class SegmentationCreateUpdateComponent implements OnInit {

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
  icPhone = icPhone;

  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<SegmentationCreateUpdateComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }

  ngOnInit() {
    this.getCustomersList();
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Customer;
    }

    this.form = this.fb.group({
      name: [this.defaults.name || ''],
      description: [this.defaults.description || ''],
      client_id: [this.defaults.client_id || ''],
      portafolio_id: [this.defaults.portafolio_id || ''],
      criterio: [this.defaults.firstName || ''],
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
    changeCliente(change: MatSelectChange,){
       console.log(change)
      this.getPortafoliosList(change.value)
    }
    changePortafolio(change: MatSelectChange,){
      console.log(change)
     this.getMap(change.value)
   }
  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const customer = this.form.value;

    if (!customer.imageSrc) {
      customer.imageSrc = 'assets/img/avatars/1.jpg';
    }

    this.dialogRef.close(customer);
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
}
