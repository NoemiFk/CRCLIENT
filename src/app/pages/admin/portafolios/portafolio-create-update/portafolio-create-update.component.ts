import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
import icPortafolio from '@iconify/icons-ic/twotone-folder';

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
  icPortafolio = icPortafolio;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  CustomersList: any[];
  estado = true;

  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<PortafolioCreateUpdateComponent>,
              private fb: FormBuilder,
              private Services: Services) {
                
  }

  getCustomersList() {
    this.CustomersList = [];
    this.Services.getCustomersList(this.client.agency_id)
    .subscribe(
        data => {
          //console.log("Hola ", data.data)
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
    this.form = this.fb.group({
      type: [''],
      name_portafolio: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(30)]],
      description: ['',[Validators.minLength(2),Validators.maxLength(100)]],
      agency_id: [''],
      client_id: ['', [Validators.required]],
    });

    if (this.defaults) {
      this.mode = 'update';
      let portafolio = this.defaults;
      console.log("-------------",this.defaults)
      this.defaults= {
        "_id":portafolio._id,
        "name_portafolio": portafolio.name_portafolio,
        "description": portafolio.description,
        "agency_id": portafolio.agency_id,
        "type": portafolio.type,
        "client_id": portafolio.client_id._id,
      }
      this.form.get('name_portafolio').setValue(this.defaults.name_portafolio)
      this.form.get('type').setValue(this.defaults.type)
      this.form.get('agency_id').setValue(this.defaults.agency_id)
      this.form.get('description').setValue(this.defaults.description)
      this.form.get('client_id').setValue(this.defaults.client_id)
    } else {
      this.defaults = {} as Portafolio;
    }
    //console.log("DEFAULTS",this.defaults)    
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
    this.estado = true;

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
    portafolio.id = this.defaults._id;
    console.log(this.defaults)
    console.log("Modificando")

    let body= {
      "agency_id": this.client.agency_id,
      "name_portafolio": portafolio.name_portafolio,
      "description": portafolio.description,
      "type": portafolio.type,
      "client_id": portafolio.client_id,
    }
    this.Services.updatePortafolio(portafolio.id,body)
      .subscribe(
        data => {
          //console.log("Hola ", data)
          if(data.success){
            this.agency=data.data
            this.dialogRef.close(data.data);
          }
        },
        error => {
          this.dialogRef.close("--");
          //this.error=true
        });

        //console.log("LISTO MODIFICADO")

  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  onChange() {
    this.estado = false;
   // console.log(this.estado)
    return this.estado;
  }
}
