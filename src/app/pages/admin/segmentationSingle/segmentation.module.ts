import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegmentationRoutingModule } from './segmentation-routing.module';
import { SegmentationComponent } from './segmentation.component';
import { PageLayoutModule } from '../../../../@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from '../../../../@vex/components/breadcrumbs/breadcrumbs.module';
import { SegmentationCreateUpdateModule } from './segmentation-create-update/segmentation-create-update.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SegmentationCreateModule } from './segmentation-create/segmentation-create-update.module';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from '../../../../@vex/components/chart/chart.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
  declarations: [SegmentationComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    MatDialogModule,
    ChartModule,
    MatInputModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    SegmentationRoutingModule,
    MatFormFieldModule,
    PageLayoutModule,
    MatProgressBarModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    SegmentationCreateUpdateModule,
    SegmentationCreateModule,
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
    MatButtonToggleModule
  ]
})
export class SegmentationModule {
}
