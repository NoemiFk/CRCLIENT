import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MapUpdateComponent } from './mapeo-update.component';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { PopoverModule } from 'ngx-bootstrap/popover'
import { WavesModule } from 'angular-bootstrap-md'
@NgModule({
  imports: [
    FormsModule,
    PopoverModule,
    WavesModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatListModule,
    MatSnackBarModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatMenuModule,
    IconModule,
    MatDividerModule
  ],
  declarations: [MapUpdateComponent],
  entryComponents: [MapUpdateComponent],
  exports: [MapUpdateComponent]
})
export class MapUpdateModule {
}
