import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { AuthenticationService } from '../../../../Services/AuthenticationService';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private AuthenticationService: AuthenticationService,
              private Services: Services
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      //name: ['', Validators.required],
      nameAgency: ['', Validators.required],
      email: ['',[Validators.required, Validators.pattern( this.emailPattern)]],
      emailConfirm: ['',[Validators.required, Validators.pattern( this.emailPattern)]],
      type: ['', Validators.required],
      phone: [''],
      rfc: [''],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      terms:['',Validators.requiredTrue]
    });
  }

  send() {
    const user = this.form.value;
    if(user.password!=user.passwordConfirm){
          this.snackbar.open("Contraseñas no coinciden", 'OK', {
            duration: 1000,
            panelClass: ['snackbarWarning']
          });
          return;
    }
    if(user.email!=user.emailConfirm){
      this.snackbar.open("E-mails no coinciden", 'OK', {
        duration: 10000,
        panelClass: ['snackbarWarning']
      });
      return;
}
   /* if(user.email.includes('hotmail')||user.email.includes('gmail')||user.email.includes('outlook')){
      this.snackbar.open("Error: Ingresa un email corporativo", 'OK', {
        duration: 10000
      });
      return;
    }*/
    let body={
      //name: user.name,
      nameAgency: user.nameAgency,
      type: user.type,
      email: user.email,
      phone: user.phone,
      rfc: user.rfc,
      password: user.password,
      contract:{
        type:"test",
        date:new Date(),
        plan_id:"60707516f5ae3e2093310198",
      }
    }
   //console.log(body)
    this.AuthenticationService.singup(body)
    .subscribe(
        data => {
          if(data.success){
            //console.log(data)
            let user=data.data;
            this.getAgency(user.agency_id)

          }
        },
        error => {
          //console.log(error.error)
          let message="Error";
          if(!error.error.success)
            message = error.error.type;
          this.router.navigate(['/register']);
          this.snackbar.open(message, 'OK', {
            duration: 10000,
            panelClass: ['snackbarError']
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
}
