import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icMail from '@iconify/icons-ic/twotone-mail';
import icChat from '@iconify/icons-ic/twotone-chat';
import icStar from '@iconify/icons-ic/twotone-check';
import icStarBorder from '@iconify/icons-ic/twotone-check-box-outline-blank';
import icCard from '@iconify/icons-ic/card-membership';
import icTrans from '@iconify/icons-ic/transfer-within-a-station';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../../Services/AuthenticationService';
import {Services} from '../../../../Services/services'


@Component({
  selector: 'vex-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  // form2: FormGroup;

  inputType = 'password';
  visible = false;
  icCard=icCard;
  icTrans=icTrans;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  isLinear = false;
  
  // firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;

  icBusiness = icBusiness;
  icPhone = icPhone;
  icMail = icMail;
  icChat = icChat;
  icStar = icStar;
  icStarBorder = icStarBorder;

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  proveedores=[
    
    {
      id:2,
      image:"assets/SMS.png",
      name:"SMS",
      active:false,
      price:0.2,
      range:"Entrega exitosa"
    },
    {
      id:2,
      image:"assets/email.png",
      name:"EMAIL",
      active:false,
      price:0.2,
      range:null
    },
    {
      id:1,
      image:"assets/blaster.png",
      name:"MENSAJE DE VOZ",
      active:false,
      price:0.2,
      range:"Entrega exitosa"
    },
    
    {
      id:2,
      image:"assets/WhatsApp.png",
      name:"CARTA",
      active:false,
      price:5,
      range:null
    }
  ]
  payment=[
    {
      id:1,
      icon:icCard,
      name:"TARJETA",
      active:false,
      price:5300,
    },
    {
      id:1,
      icon:icTrans,
      name:"TRANSFERENCIA",
      active:false,
      price:5300,
    }
  ]

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private _formBuilder: FormBuilder,
              private snackbar: MatSnackBar,
              private AuthenticationService: AuthenticationService,
              private Services: Services
  ) { }

  ngOnInit() {
    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['']
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['']
    // });
    this.form = this.fb.group({
      name: [''],
      nameAgency: ['', Validators.required],
      type: [ '',Validators.required],
      bussinesName: [ '',Validators.required],
      cfdiUse: [ 'P01'],
      paymentForm:['03'],
      email: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      emailConfirm: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      email1: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      email2: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      phone: [''],
      rfc: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      terms:['',Validators.requiredTrue],
      add:['']
    });
  }

  
  send() {
    const user = this.form.value;
    if(user.password!=user.passwordConfirm){
          //this.router.navigate(['/login']);
          this.snackbar.open("Error: contraseñas diferentes", 'OK', {
            duration: 10000
          });
          return;
    }
    if(user.email!=user.emailConfirm){
      //this.router.navigate(['/login']);
      this.snackbar.open("Error: email diferentes", 'OK', {
        duration: 10000
      });
      return;
}
    let body={
      name: user.nameAgency,
      email: user.email,
      email1: user.email1,
      email2: user.email2,
      phone: user.phone,
      RFC: user.rfc,
      cfdiUse:user.cfdiUse,
      paymentForm:user.paymentForm,
      bussinesName:user.bussinesName,
      password: user.password,
      contract:{
        type:"pay",
        date:new Date(),
        plan_id:"6070a4c7e4a7f92970c0cd75",
    },
    }
   //console.log(body)
    this.AuthenticationService.singup(body) ///agregar providers
    .subscribe(
        data => {
          if(data.success){
            let user=data.data;
            this.getAgency(user.agency_id)

          }
        },
        error => {
          //console.log(error.error)
          let message="Error";
          if(!error.error.success)
            message = error.error.type;
          this.snackbar.open(message, 'OK', {
            duration: 10000
          });
        });

  }

  getAgency(agency) {
   //console.log("Clientt",agency)
    this.Services.getAgency(agency)
    .subscribe(
        data => {
          if(data.success){
            let agencyA=data.data
           //console.log("----",agencyA)
            localStorage.setItem('Agency', JSON.stringify(agencyA));
            this.getPlan(agencyA.contract.plan_id);
          }
        },
        error => {
          //this.error=true
        });
  }
  getPlan(id) {
    this.Services.getPlan(id)
    .subscribe(
        data => {
          //console.log("Hola ", data)
          if(data.success){
            let plan=data.data
            localStorage.setItem('Plan', JSON.stringify(plan));
            this.router.navigate(['/']);
          }
        },
        error => {
          //this.error=true
        });
  }
  emitToggleStar(event: MouseEvent,index) {
    event.stopPropagation();
    if(this.proveedores[index].active)
      this.proveedores[index].active=false;
    else
      this.proveedores[index].active=true;
  }
  payToggleStar(event: MouseEvent,index) {
    event.stopPropagation();
    if(this.payment[index].active)
      this.payment[index].active=false;
    else
      this.payment[index].active=true;
  }
  

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
  send1() {
    const user = this.form.value;
    if(user.password!=user.passwordConfirm){
          //this.router.navigate(['/login']);
          this.snackbar.open("Error: contraseñas diferentes", 'OK', {
            duration: 10000
          });
          return;
    }
   

  }
  valid(stepper){
    const user = this.form.value;
   //console.log(stepper, user)
    if(!user.email||!user.name|| !user.nameAgency||!user.password){
      this.snackbar.open("Error: Completa la información", 'OK', {
        duration: 10000
      });
      return;
    }
    if(user.password!=user.passwordConfirm){
          this.snackbar.open("Error: contraseñas diferentes", 'OK', {
            duration: 10000
          });
          return;
    }
    /*if(user.email.includes('hotmail')||user.email.includes('gmail')||user.email.includes('outlook')){
      this.snackbar.open("Error: Ingresa un email corporativo", 'OK', {
        duration: 10000
      });
      return;
    }*/
    stepper.selectedIndex=1;
  }
}
