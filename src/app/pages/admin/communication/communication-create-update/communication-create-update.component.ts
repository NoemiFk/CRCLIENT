import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Communication } from '../interfaces/communication.model';
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
import { AngularEditorConfig } from '@kolkov/angular-editor'; 
import {Services} from '../../../../Services/services'
@Component({
  selector: 'vex-strategy-create-update',
  templateUrl: './communication-create-update.component.html',
  styleUrls: ['./communication-create-update.component.scss']
})
export class CommunicationCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;
  segment="Segmento A"
  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<CommunicationCreateUpdateComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }
  displayedColumnsIG: string[] = ['Cliente', 'Portafolio'];
  dataInfo=[]
  name="Comunicacion 1"
  htmlContent = 'Hola, ';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Communication;
    }

    this.dataInfo=[{
      client_id:"Liverpool",
      portafolio: "Clientes Morosos"
    }]


    this.getMap("60a9125ae2311425be658579")
  }
  communication=""
  communicationData=[]
  getMap(id){
    this.Services.getMap(id)
    .subscribe(
        data => {
          console.log("getMap ", data)
          if(data.success){
            this.communication=data.data.segmentation;
            let commun=[]
            data.data.strategies.forEach(element => {
              if(element.status)
                this.communicationData.push(element.data)
            });
            console.log(this.communicationData)
           // this.CustomersList=data.data
            
          }
        },
        error => {
          //this.error=true
        });
  }
  addText(label){
    this.htmlContent = this.htmlContent + " ["+label+"] "
  }
 /* getCursorPosition(){
    if(this.variable){
      var sel, range;
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        console.log(sel.getRangeAt(0))
        this.rango = sel.getRangeAt(0);
        this.rango.insertNode(document.createTextNode('{'+this.variable+'}'));
        this.variable = '';
        
         return sel.getRangeAt(0);
      }
    }
  }*/

  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const customer = this.form.value;

    if (!customer.imageSrc) {
      customer.imageSrc = 'assets/img/avatars/1.jpg';
    }

    this.dialogRef.close(customer);
  }

  updateCustomer() {
    const customer = this.form.value;
    customer.id = this.defaults.id;

    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
