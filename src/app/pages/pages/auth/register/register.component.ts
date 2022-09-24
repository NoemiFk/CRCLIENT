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

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private AuthenticationService: AuthenticationService,
              private Services: Services
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAgency: ['', Validators.required],
      email: ['', Validators.required],
      type: ['', Validators.required],
      phone: ['', Validators.required],
      rfc: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }

  send() {
    const user = this.form.value;
    if(user.password!=user.passwordConfirm){
          this.snackbar.open("Error: contraseñas diferentes", 'OK', {
            duration: 10000
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
      name: user.name,
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

          }
        },
        error => {
          //console.log(error.error)
          let message="Error";
          if(!error.error.success)
            message = error.error.type;
          this.router.navigate(['/register']);
          this.snackbar.open(message, 'OK', {
            duration: 10000
          });
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
