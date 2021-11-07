import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PricingRoutingModule } from './pricing-routing.module';
import { CustomerUpdateModel } from './customer-update/customer-update.module';
import { PricingComponent } from './pricing.component';
import { IconModule } from '@visurel/iconify-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [PricingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    PricingRoutingModule,
    IconModule,
    FlexLayoutModule,
    MatButtonModule,
    CustomerUpdateModel
  ]
})
export class PricingModule {
}
