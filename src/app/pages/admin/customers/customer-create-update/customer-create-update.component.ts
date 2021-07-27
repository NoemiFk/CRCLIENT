import { Component, Inject, OnInit, ElementRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { MatSnackBar } from '@angular/material/snack-bar';

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

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);


  constructor(@Inject(MAT_DIALOG_DATA) 
              public defaults: any,
              private dialogRef: MatDialogRef<CustomerCreateUpdateComponent>,
              private fb: FormBuilder,
              private Services: Services,
              private snackbar: MatSnackBar) {
  }

  @ViewChild('uploadControl') uploadControl: ElementRef;
  uploadFileName = 'Choose File';

  onFileChange(e: any) {

    if (e.target.files && e.target.files[0]) {

      this.uploadFileName = '';
      Array.from(e.target.files).forEach((file: File) => {
        this.uploadFileName += file.name + ',';
      });

      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = res => {

          const imgBase64Path = e.target.result;

        };
      };
      fileReader.readAsDataURL(e.target.files[0]);

      this.uploadControl.nativeElement.value = "";
    } else {
      this.uploadFileName = 'Choose File';
    }
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
      let customer= this.defaults;
      console.log('DEFAULTS',this.defaults)

      this.defaults= {
        "_id":          customer._id,
      "name":           customer.name,
      "nameClient":     customer.nameClient,
      "email":          customer.email,
      "phone":          customer.phone,
      "emailOptional":  customer.emailOptional,
      "phoneOptional":  customer.phoneOptional,
      "RFC":            customer.RFC,
      "city":           customer.address.city,
      "state":          customer.address.state,
      "municipality":   customer.address.municipality,
      "address1":       customer.address.address1,
      "address2":       customer.address.address2,
      "int":            customer.address.int,
      "ext":            customer.address.ext,
      "zipcode":        customer.address.zipcode,
      }
      this.pay=customer.pay;
      this.pays=customer.pays;

      console.log('CUSTOMER',customer)
      console.log('PAY',customer.pay)
      console.log('PAYS',customer.pays)
      console.log('PAYS',customer.pay.name)
      console.log('PAYS',customer.pay.cta)

    } else {
      this.defaults = {} as Customer;
    }
    this.form = this.fb.group({
      imageSrc:     '',
      type:         [this.defaults.type || ''],
      name:         [this.defaults.name || '',[Validators.required]],
      nameClient:   [this.defaults.nameClient || '',[Validators.required]],
      RFC:          [this.defaults.RFC || ''],
      address1:     [this.defaults.address1 || '',],
      address2:     [this.defaults.address2 || ''],
      city:         [this.defaults.city || ''],
      zipcode:      [this.defaults.zipcode || ''],
      country:      [this.defaults.country || ''], 
      municipality: [this.defaults.municipality || ''],
      state:        [this.defaults.state || ''],
      pays:         [this.defaults.pays || ''],
      int:          [this.defaults.int || ''],
      ext:          [this.defaults.ext || ''],
      phone:        [this.defaults.phone || '', [Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10)]],
      phoneOptional:[this.defaults.phoneOptional || ''],
      email:        [this.defaults.email || '',[Validators.required, Validators.pattern( this.emailPattern)]],
      emailOptional:[this.defaults.emailOptional || '']
    });
  }

  nuevoPago: FormControl = this.fb.control('');
  nuevaCta: FormControl = this.fb.control('');

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
      "agency_id":      this.client.agency_id,
      "nameClient":     customer.nameClient,
      "name":           customer.name,
      "type":           customer.type,
      "email":          customer.email,
      "phone":          customer.phone,
      "emailOptional":  customer.emailOptional,
      "phoneOptional":  customer.phoneOptional,
      "RFC":            customer.RFC,
      "address": {
        "city":         customer.city,
        "state":        customer.state,
        "municipality": customer.municipality,
        "address1":     customer.address1,
        "address2":     customer.address2,
        "int":          customer.int,
        "ext":          customer.ext,
        "zipcode":      customer.zipcode
      },
      "pay":this.pay,
      "pays":this.pays
    }
    console.log('BODY',body)
    this.createCustomerA(body);
  }
  
  pay=[]
  pays=[]

  addPay(){
      console.log('Pago',this.nuevoPago.value)
      console.log('Cuenta',this.nuevaCta.value)
      this.pay.push({
        name:this.nuevoPago.value,
        cta: this.nuevaCta.value
      });
      this.ngOnInit();
  }


  deletePay(index){
    for(let item in this.pay){
        this.pay.splice(index,1);
    }
    this.ngOnInit();
  }

  createCustomerA(body) {
    this.Services.createCustomer(body)
    .subscribe(
        data => {
        console.log("DATA ", data)
          if(data.success){
            this.agency=data.data
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

  updateCustomer() {
    const customer = this.form.value;

    if (!customer.imageSrc) {
      customer.imageSrc = 'assets/img/avatars/1.jpg';
    }

    let body= {
      "agency_id":        this.client.agency_id,
      "nameClient":       customer.nameClient,
      "name":             customer.name,
      "type":             customer.type,
      "email":            customer.email,
      "phone":            customer.phone,
      "emailOptional":    customer.emailOptional,
      "phoneOptional":    customer.phoneOptional,
      "RFC":              customer.RFC,
      "address": {
        "city":           customer.city,
        "state":          customer.state,
        "municipality":   customer.municipality,
        "address1":       customer.address1,
        "address2":       customer.address2,
        "int":            customer.int,
        "ext":            customer.ext,
        "zipcode":        customer.zipcode
      },
      "pay":this.pay,
      "pays":this.pays
    }
    this.Services.updateCustomer(this.defaults._id,body)
    .subscribe(
        data => {
          console.log("DATA update ", data)
          if(data.success){
            this.agency=data.data
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
