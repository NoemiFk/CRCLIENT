import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralSettingsComponent } from './general-settings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GeneralSettingsRoutingModule } from './general-settings-routing.module';
import { MatCardModule } from '@angular/material/card';
import { PageLayoutModule } from '../../../../@vex/components/page-layout/page-layout.module';


@NgModule({
  declarations: [GeneralSettingsComponent],
  imports: [
    MatDatepickerModule,
    MatSnackBarModule,
    FormsModule,
    MatNativeDateModule,
    CommonModule,
    MatTabsModule,
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
    MatDividerModule,
    GeneralSettingsRoutingModule,
    MatCardModule,
    PageLayoutModule
  ],
  entryComponents: [GeneralSettingsComponent],
  exports: [GeneralSettingsComponent]
})
export class GeneralSettingsModule { }
