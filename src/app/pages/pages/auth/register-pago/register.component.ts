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
  form2: FormGroup;

  inputType = 'password';
  visible = false;
  icCard=icCard;
  icTrans=icTrans;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  icBusiness = icBusiness;
  icPhone = icPhone;
  icMail = icMail;
  icChat = icChat;
  icStar = icStar;
  icStarBorder = icStarBorder;

  proveedores=[
    {
      id:1,
      image:"assets/blaster.png",
      name:"LLAMADAS",
      active:false,
      price:300,
      range:"5000-10000"
    },
    {
      id:2,
      image:"assets/email.png",
      name:"EMAIL",
      active:false,
      price:200,
      range:"5000-10000"
    },
    {
      id:2,
      image:"assets/SMS.png",
      name:"SMS",
      active:false,
      price:200,
      range:"5000-10000"
    },
    {
      id:2,
      image:"assets/WhatsApp.png",
      name:"WHATSAPP",
      active:false,
      price:500,
      range:"5000-10000"
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
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAgency: ['', Validators.required],
      type: [ '',Validators.required],
      bussinesName: [ '',Validators.required],
      cfdiUse: [ 'P01',Validators.required],
      paymentForm:['03',Validators.required],
      email: ['', Validators.required],
      email1: ['', Validators.required],
      email2: ['', Validators.required],
      phone: ['', Validators.required],
      rfc: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
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
    let body={
      name: user.name,
      email: user.email,
      phone: user.phone,
      RFC: user.rfc,
      password: user.password,
      contract:{
        type:"pay",
        date:new Date(),
        plan_id:"6070a4c7e4a7f92970c0cd75",
    },
    }
   //console.log(body)
    this.AuthenticationService.singup(body)
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
      this.snackbar.open("Error: Completa la informacion", 'OK', {
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
    if(user.email.includes('hotmail')||user.email.includes('gmail')||user.email.includes('outlook')){
      this.snackbar.open("Error: Ingresa un email corporativo", 'OK', {
        duration: 10000
      });
      return;
    }
    stepper.selectedIndex=1;
  }
}
