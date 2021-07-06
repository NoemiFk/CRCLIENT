import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpCenterRoutingModule } from './home-routing.module';
import { HelpCenterComponent } from './home.component';
import { PageLayoutModule } from '../../../@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@visurel/iconify-angular';
import { MatRippleModule } from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [HelpCenterComponent],
  imports: [
    CommonModule,
    MatCardModule,
    HelpCenterRoutingModule,
    PageLayoutModule,
    FlexLayoutModule,
    MatButtonModule,
    IconModule,
    MatRippleModule
  ]
})
export class HelpCenterModule {
}
