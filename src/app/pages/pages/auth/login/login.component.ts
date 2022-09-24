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
    this.router.navigate(['/user']);
    // const admin = this.form.value;
    // this.AuthenticationService.login(admin.email, admin.password)
    // .subscribe(
    //     data => {
    //       if(data.success){
    //         //console.log(data)
    //         let user=data.data;
           

    //       }
    //     },
    //     error => {
    //      //console.log(error.error)
    //       let message="Error";
    //       if(!error.error.success)
    //         message = error.error.type;
    //       this.router.navigate(['/login']);
    //       this.snackbar.open(message, 'OK', {
    //         duration: 10000
    //       });
    //     });


    
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
