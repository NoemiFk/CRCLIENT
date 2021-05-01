import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { AuthenticationService } from '../../../../Services/AuthenticationService';
import {Services} from '../../../../Services/services'
@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

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
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  send() {
    const admin = this.form.value;
    this.AuthenticationService.login(admin.email, admin.password)
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
          this.router.navigate(['/login']);
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
            console.log("Dashboards")
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
