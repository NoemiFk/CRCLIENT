import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../interfaces/customer.model';
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
import icEmail from '@iconify/icons-ic/email';
import {Services} from '../../../../Services/services'

@Component({
  selector: 'vex-customer-create-update',
  templateUrl: './customer-create-update.component.html',
  styleUrls: ['./customer-create-update.component.scss']
})
export class CustomerCreateUpdateComponent implements OnInit {

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
  icEmail = icEmail;
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<CustomerCreateUpdateComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
      let customer= this.defaults;
      console.log(this.defaults)
      this.defaults= {
        "_id":customer._id,
      "name": customer.name,
      "nameClient": customer.nameClient,
      "email": customer.email,
      "phone": customer.phone,
      "emailOptional": customer.emailOptional,
      "phoneOptional": customer.phoneOptional,
      "RFC": customer.RFC,
      "city": customer.address.city,
      "state": customer.address.state,
      "municipality": customer.address.municipality,
      "address1": customer.address.address1,
      "address2": customer.address.address2,
      "int": customer.address.int,
      "ext": customer.address.ext,
      "zipcode": customer.address.zipcode,
      }
      console.log(this.defaults)
    } else {
      this.defaults = {} as Customer;
    }
    this.form = this.fb.group({
      imageSrc: this.defaults.imageSrc,
      type: [this.defaults.type || ''],
      name: [this.defaults.name || ''],
      nameClient: [this.defaults.nameClient || ''],
      RFC: [this.defaults.RFC || ''],
      address1: this.defaults.address1 || '',
      address2: this.defaults.address2 || '',
      city: this.defaults.city || '',
      zipcode: this.defaults.zipcode || '',
      country: this.defaults.country || '', 
      municipality: this.defaults.municipality || '',
      state: this.defaults.state || '',
      int: this.defaults.int || '',
      ext: this.defaults.ext || '',
      phone: this.defaults.phone || '',
      phoneOptional: this.defaults.phoneOptional || '',
      email: this.defaults.email || '',
      emailOptional: this.defaults.emailOptional || ''
    });
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

    let body= {
      "agency_id": this.client.agency_id,
      "nameClient": customer.nameClient,
      "name": customer.name,
      "type": customer.type,
      "email": customer.email,
      "phone": customer.phone,
      "emailOptional": customer.emailOptional,
      "phoneOptional": customer.phoneOptional,
      "RFC": customer.RFC,
      "address": {
        "city": customer.city,
        "state": customer.state,
        "municipality": customer.municipality,
        "address1": customer.address1,
        "address2": customer.address2,
        "int": customer.int,
        "ext": customer.ext,
        "zipcode": customer.zipcode
      },
    }
     console.log(body)
      this.createCustomerA(body);
     

    
  }

  createCustomerA(body) {
    this.Services.createCustomer(body)
    .subscribe(
        data => {
          console.log("Hola ", data)
          if(data.success){
            this.agency=data.data
            this.dialogRef.close(data.data);
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
}
