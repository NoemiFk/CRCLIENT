import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AioTableRoutingModule } from './aio-table-routing.module';
import { AioTableComponent } from './aio-table.component';
import { PageLayoutModule } from '../../../../@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from '../../../../@vex/components/breadcrumbs/breadcrumbs.module';
import { CustomerCreateUpdateModule } from './customer-create-update/customer-create-update.module';
import { CustomerDeleteModule } from './customer-delete/customer-delete.module';
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
// For MDB Angular Pro
import { PopoverModule } from 'ngx-bootstrap/popover'
import { WavesModule } from 'angular-bootstrap-md'
@NgModule({
  declarations: [AioTableComponent],
  imports: [
    CommonModule,
    WavesModule,
    AioTableRoutingModule,
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    CustomerCreateUpdateModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    IconModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSelectModule,
    PopoverModule,
    MatButtonToggleModule,
    CustomerDeleteModule
  ]
})
export class AioTableModule {
}
