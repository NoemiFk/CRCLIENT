import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AioTableRoutingModule } from './portafolios-routing.module';
import { AioTableComponent } from './portafolios.component';
import { PageLayoutModule } from '../../../../@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from '../../../../@vex/components/breadcrumbs/breadcrumbs.module';
import { PortafolioCreateUpdateModule } from './portafolio-create-update/portafolio-create-update.module';
import { PortafolioDeleteModule } from './portafolio-delete/portafolio-delete.module';
import { MapUpdateModule } from './mapeo-update/mapeo-update.module';
import { PayUpdateModule } from './pay-update/pay-update.module';
import { PaymentPromiseUpdateModule } from './payment_promise-update/payment_promise-update.module';
import { ManagementResultsUpdateModule } from './management_results-update/management_results-update.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContainerModule } from '../../../../@vex/directives/container/container.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  declarations: [AioTableComponent],
  imports: [
    CommonModule,
    AioTableRoutingModule,
    PageLayoutModule,
    ManagementResultsUpdateModule,
    PaymentPromiseUpdateModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    PortafolioCreateUpdateModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MapUpdateModule,
    IconModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSelectModule,
    MatButtonToggleModule,
    PortafolioDeleteModule,
    PayUpdateModule,
    //ManagementResultsUpdateModule
  ]
})
export class AioTableModule {
}
