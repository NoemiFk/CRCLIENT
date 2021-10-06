import { Component, Inject, OnInit, ElementRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import icBaselineApps from '@iconify/icons-ic/baseline-apps';
import icPinDrop from '@iconify/icons-ic/pin-drop';
import icInfo from '@iconify/icons-ic/info';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Services } from '../../../Services/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vex-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  providers: [
    
]
})


export class GeneralSettingsComponent implements OnInit {

  form: FormGroup;
  mode = 'update';
  agency={};

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

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
  icBaselineApps = icBaselineApps;
  icPinDrop = icPinDrop;
  icInfo = icInfo;

  //--------------------------------
  private emailValidators = Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
              

  info_agency=localStorage.getItem('Agency')
  agenciaActual=JSON.parse(this.info_agency);
  

  constructor(private fb: FormBuilder,
              private Services: Services,
              private snackbar: MatSnackBar,
              private rutas: Router
              
            ) {      
  }

  ngOnInit() {
    console.log('Agencia Actual',this.agenciaActual)

    this.getAgency();

    this.form = this.fb.group({
      nombreEmpresa: [''],
      nombreUsuario: [''],
      tipoEmpresa: [''],
      telefono: ['',[Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10)]],
      email: ['',[Validators.required, Validators.pattern( this.emailPattern)]],
      email1: ['',this.emailValidators],
      email2: ['',this.emailValidators],
      RFC: ['',[Validators.required,Validators.minLength(13),Validators.maxLength(13)]],
      razonSocial: [''],
      usoFactura: [''],
      métodoPago: [''],
      direccion1: [''],
      direccion2: [''],
      ciudad: [''],
      estado: [''],
      municipio:[''],
      CP:['',[Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(5),Validators.maxLength(5)]],
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
        this.form.get('usoFactura').setValue("P01") 
      }
      else if(this.agenciaActual.cfdiUse == "G01"){
        this.form.get('usoFactura').setValue('G01') 
      }
      else if(this.agenciaActual.cfdiUse == "G02"){
        this.form.get('usoFactura').setValue('G02') 
      }
      else if(this.agenciaActual.cfdiUse == "G03"){
        this.form.get('usoFactura').setValue('G03') 
      }
      

      if(this.agenciaActual.paymentForm == '03'){
        this.form.get('métodoPago').setValue('03') 
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
      
      
  };

  getAgency() {
    this.Services.getAgency(this.agenciaActual._id)
    .subscribe(
        data => {
          if(data.success){
            this.agency=data.data
            localStorage.setItem('Agency', JSON.stringify(this.agency));
          }
        },
        error => {
         // console.log(error)
        });
        return this.agency;
  }

  updateAgency() {
    const agency = this.form.value;
    console.log('update',agency)
    let body= {
        "_id":this.agenciaActual._id,
        "bussinesName": agency.nombreEmpresa,
        "name": agency.nombreUsuario,
        "type": agency.tipoEmpresa,
        "phone": agency.telefono,
        "email": agency.email,
        "email1": agency.email1,
        "email2": agency.email2,
        "RFC": agency.RFC,
        "razonSocial": agency.nombreEmpresa,
        "cfdiUse": agency.usoFactura,
        "paymentForm": agency.métodoPago,
        "address": {
          "address1": agency.direccion1,
          "address2": agency.direccion2,
          "city": agency.ciudad,
          "state": agency.estado,
          "municipality": agency.municipio,
          "zipcode": agency.CP,
          "int": agency.interior,
          "ext": agency.exterior,
          "references": agency.referencia,
        }
        
      }

      console.log(body)
      console.log(this.agenciaActual._id)

    this.Services.updateAgency(this.agenciaActual._id,body)
    .subscribe(
        data => {
          //console.log("DATA  ", data)
          if(data.success){
            this.getAgency()
            this.snackbar.open('Datos Actualizados Correctamente', 'OK', {
              duration: 10000
            });
            this.navigateToDashboard();
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
    this.rutas.navigate(['/']);
  }

}
