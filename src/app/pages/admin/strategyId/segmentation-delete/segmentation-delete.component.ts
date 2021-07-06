import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Strategy } from '../interfaces/strategy.model';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';
import {Services} from '../../../../Services/services'

@Component({
  selector: 'vex-segmentation-delete',
  templateUrl: './segmentation-delete.component.html',
  styleUrls: ['./segmentation-delete.component.scss']
})
export class StrategyDeleteComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'delete';
  agency={};

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<StrategyDeleteComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }

  ngOnInit() {
    if (this.defaults) {
      let segmentation= this.defaults;
      //console.log(this.defaults)
    } 
    
  }

  save() {
      this.deleteStrategy();
  }

  deleteStrategy() {
    //segmentation._id = this.defaults._id;
      this.deleteStrategyA(this.defaults._id);
  }

  deleteStrategyA(id) {
  /*  this.Services.deleteStrategy(id)
    .subscribe(
        data => {
          if(data.success){
            this.agency=data.data
            this.dialogRef.close(data.data);
          }
        },
        error => {
          //this.error=true
        });*/
  }

}
