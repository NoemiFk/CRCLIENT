import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ManagementResultsUpdateComponent } from './management_results-update.component';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  imports: [
    MatDatepickerModule,
    MatTableModule,
    MatStepperModule,
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
  declarations: [ManagementResultsUpdateComponent],
  entryComponents: [ManagementResultsUpdateComponent],
  exports: [ManagementResultsUpdateComponent]
})
export class ManagementResultsUpdateModule {
}
