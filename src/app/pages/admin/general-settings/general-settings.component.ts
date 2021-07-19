import { Component, Inject, OnInit, ElementRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import icAtttachMoney from '@iconify/icons-ic/baseline-attach-money';
import icBaselineCast from '@iconify/icons-ic/baseline-cast';
import icBaselineApartment from '@iconify/icons-ic/baseline-apartment';
import icBaselineApi from '@iconify/icons-ic/baseline-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Services } from '../../../Services/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vex-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
]
})


export class GeneralSettingsComponent implements OnInit {

  form: FormGroup;
  mode = 'update';
  agency={};

  //Iconos------------------------

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
  icBaselineCast = icBaselineCast;
  icAtttachMoney = icAtttachMoney;
  icBaselineApartment = icBaselineApartment;
  icBaselineApi = icBaselineApi;

  //--------------------------------

  info_agency=localStorage.getItem('Agency')
  agenciaActual=JSON.parse(this.info_agency);
  

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<GeneralSettingsComponent>,
              private fb: FormBuilder,
              private Services: Services,
              private snackbar: MatSnackBar,
              private rutas: Router) {

          
  }

  ngOnInit() {
    console.log('Agencia Actual',this.agenciaActual)

    this.getAgency();

    this.form = this.fb.group({
      nombreEmpresa: [''],
      nombreUsuario: [''],
      tipoEmpresa: [''],
      telefono: [''],
      email: [''],
      email1: [''],
      email2: [''],
      RFC: [''],
      razonSocial: [''],
      usoFactura: [''],
      metodoPago: [''],
      direccion1: [''],
      direccion2: [''],
      ciudad: [''],
      estado: [''],
      municipio:[''],
      CP:[''],
      interior:[''],
      exterior:[''],
      referencia: [''],
    });

    console.log('Formulario Creado')

    this.setValues();
    
  }

  setValues() {
      this.form.get('nombreEmpresa').setValue(this.agenciaActual.bussinesName)
      this.form.get('nombreUsuario').setValue(this.agenciaActual.name)
      this.form.get('tipoEmpresa').setValue(this.agenciaActual.type)
      this.form.get('telefono').setValue(this.agenciaActual.phone)
      this.form.get('email').setValue(this.agenciaActual.email)
      this.form.get('email1').setValue(this.agenciaActual.email1)
      this.form.get('email2').setValue(this.agenciaActual.email2)
      this.form.get('RFC').setValue(this.agenciaActual.RFC)
      this.form.get('razonSocial').setValue(this.agenciaActual.bussinesName)

      if(this.agenciaActual.cfdiUse == "P01"){
        this.form.get('usoFactura').setValue("Por Definir") 
      }
      else if(this.agenciaActual.cfdiUse == "G01"){
        this.form.get('usoFactura').setValue('Adquisición de mercancias') 
      }
      else if(this.agenciaActual.cfdiUse == "G02"){
        this.form.get('usoFactura').setValue('Devoluciones, descuentos o bonificaciones') 
      }
      else if(this.agenciaActual.cfdiUse == "G03"){
        this.form.get('usoFactura').setValue('Gastos en general') 
      }
      

      if(this.agenciaActual.paymentForm == '03'){
        this.form.get('metodoPago').setValue('Transferencia electrónica de fondos') 
      }
      this.form.get('direccion1').setValue(this.agenciaActual.address.address1)  
      this.form.get('direccion2').setValue(this.agenciaActual.address.address2)  
      this.form.get('ciudad').setValue(this.agenciaActual.address.city)  
      this.form.get('estado').setValue(this.agenciaActual.address.state)  
      this.form.get('municipio').setValue(this.agenciaActual.address.municipality)  
      this.form.get('CP').setValue(this.agenciaActual.address.zipcode)  
      this.form.get('interior').setValue(this.agenciaActual.address.int)  
      this.form.get('exterior').setValue(this.agenciaActual.address.ext)  
      this.form.get('referencia').setValue(this.agenciaActual.address.references)  
  }

  getAgency() {
    this.Services.getAgency(this.agenciaActual._id)
    .subscribe(
        data => {
          if(data.success){
            this.agency=data.data
            console.log('Agencia',this.agency)
          }
        },
        error => {
         // console.log(error)
        });
  }

  updateAgency() {
    const agency = this.form.value;

    let body= {
        "nombreEmpresa": agency.bussinesName,
        "nombreUsuario": agency.name,
        "tipoEmpresa": agency.type,
        "telefono": agency.phone,
        "email": agency.email,
        "email1": agency.email1,
        "email2": agency.email2,
        "RFC": agency.RFC,
        // "razonSocial": agency.bussinesName,
        "usoFactura": agency.cfdiUse,
        "metodoPago": agency.paymentForm,
        // "direccion1": agency.address.address1,
        // "direccion2": agency.address.address2,
        // "ciudad": agency.address.city,
        // "estado": agency.address.state,
        // "municipio": agency.address.municipality,
        // "CP": agency.address.zipcode,
        // "interior": agency.address.int,
        // "exterior": agency.address.ext,
        // "referencia": agency.address.references,
      }

    this.Services.updateCustomer(this.agenciaActual._id,body)
    .subscribe(
        data => {
          //console.log("DATA  ", data)
          if(data.success){
            this.agency=data.data
            this.dialogRef.close(data.data);
            this.rutas.navigate(['/admin/generalSettings']);
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

  navigateToDashboard(){
    this.rutas.navigate(['admin/generalSettings']);
  }

}
