import { Component, OnInit } from '@angular/core';
import icBeenhere from '@iconify/icons-ic/twotone-beenhere';
import icStars from '@iconify/icons-ic/twotone-stars';
import icBusinessCenter from '@iconify/icons-ic/twotone-business-center';
import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';
import { stagger60ms } from '../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import {Services} from '../../../Services/services'
import { MatDialog } from '@angular/material/dialog';
import {CustomerUpdateComponent} from './customer-update/customer-update.component'
import { from } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'vex-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class PricingComponent implements OnInit {

  icBeenhere = icBeenhere;
  icStars = icStars;
  icBusinessCenter = icBusinessCenter;
  icPhoneInTalk = icPhoneInTalk;
  icMail = icMail;

  info_admin=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_admin);
  info_agency=localStorage.getItem('Agency')
  agency=JSON.parse(this.info_agency);
  plan1=false
  plan2=false
  
  PlansList=[]
  
  constructor( private Services: Services, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
   
    setTimeout(() => {
     //console.log("Client",this.client)
     //console.log("Agency",this.agency)
      if(this.agency.contract.type=="test")
      this.plan1=true
      if(this.agency.contract.type=="pay")
      this.plan2=true
      //this.getPlansList(this.agency);
    }, 1000);
    
  }
  
  getAgency() {
   //console.log("Clientt",this.client.agency_id)
    this.Services.getAgency(this.client.agency_id)
    .subscribe(
        data => {
          if(data.success){
            let agency=data.data
           //console.log("----",agency)
            this.getPlansList(agency);
            localStorage.setItem('Agency', JSON.stringify(agency));
            this.plan1=false
            this.plan2=true
            window.location.reload();
          }
        },
        error => {
          //this.error=true
        });
  }
  
  getPlansList(agency) {
    this.Services.getPlansList()
    .subscribe(
        data => {
          //console.log("Hola ", data)
          if(data.success){
            this.PlansList=data.data;
            this.PlansList[0].active=false;
            this.PlansList[1].active=false;
            const index = this.PlansList.findIndex((existingPlan) => existingPlan._id === agency.contract.plan_id);
            if(index==0)
            this.plan1=true;
            else
            this.plan2=true
          }
        },
        error => {
          //this.error=true
        });
  }
    open(){

      this.dialog.open(CustomerUpdateComponent, {
        data: this.agency
      }).afterClosed().subscribe(updatedCustomer => {
        if (updatedCustomer) {
          this.getAgency();
        }
      });
    }
  
  Active(){
   //console.log("Abrir modal")
  }

}
