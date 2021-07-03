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
import icImage from '@iconify/icons-ic/outline-image';
import icLink from '@iconify/icons-ic/round-link';
import {Services} from '../../../../Services/services'
import { ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';

@Component({
  selector: 'vex-strategy-create-update',
  templateUrl: './communication-create-update.component.html',
  styleUrls: ['./communication-create-update.component.scss',
  '../../../../../../node_modules/quill/dist/quill.snow.css',
  '../../../../../@vex/styles/partials/plugins/_quill.scss'],
  
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInUp400ms]
})
export class CommunicationCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  text = ``;
  form1 = new FormControl(this.text);
  mode: 'create' | 'update' = 'create';
  icImage=icImage
  icLink=icLink
  typeClient="Cliente"
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
  name=""
  description=""
  subject=""
  htmlContent = 'Hola, ';
  info_agency=localStorage.getItem('currentAgency')
  agency=JSON.parse(this.info_agency);
  title=""
  datos=[]
  value=""
  typeCommunication=""
  communicationData=[]
  communicationData2=[]
  communicationData3=[]
  ngOnInit() {
    if (this.defaults) {
      this.mode = 'create';
      console.log("Hola 2",this.defaults)

      this.getMap(this.defaults.portafolio_id)
      this.title=this.defaults.title
      this.typeCommunication = this.title
      this.datos=this.defaults.data
      this.value=this.defaults.value
      this.form1.setValue(this.defaults.content)
      console.log(this.datos)
    } else {
      this.defaults = {} as Communication;
    }

    this.dataInfo=[{
      client_id:"Liverpool",
      portafolio: "Clientes Morosos"
    }]


  }
  character=0
  cuanti(){
    let text= this.form1.value;
    console.log(text)
    if(text){

      var strippedHtml = text.replace(/<[^>]+>/g, '');
    this.character=strippedHtml.length
    }
    else{
      this.character=0
    }
    setTimeout(() => {
      //console.log(this.character)
    }, 0);
    //return true
  }
  word=""
  rango=null
  type="A4"
  getCursorPosition(){
    console.log("click", this.word)
    if(this.word){

      var sel, range;
          sel = window.getSelection();
          if (sel.getRangeAt && sel.rangeCount) {
            console.log(sel.getRangeAt(0))
            this.rango = sel.getRangeAt(0);
            this.rango.insertNode(document.createTextNode('['+this.word+']'));
            this.word = '';
            
             return sel.getRangeAt(0);
          }
    }
  }
 getMap(id){
    this.Services.getMap(id)
    .subscribe(
        data => {
          console.log("getMap ", data)
          if(data.success){
            data.data.strategies.forEach(element => {
              if(element.status)
                this.communicationData3.push(element.data)
                this.communicationData.push(element.data)
                
            });
            data.data.endorsement.forEach(element => {
              if(element.status)
                this.communicationData2.push(element.data)
            });
            console.log(this.communicationData2)
           // this.CustomersList=data.data
            
          }
        },
        error => {
          //this.error=true
        });
  }
  addText(label){
    this.word=label
    
    console.log(this.text , this.form1.value)
  }
  PortafoliosList=[]
  getPortafoliosList(client_id) {
    //console.log("GET PORTAFOLOS",this.client.agency_id, client_id)
     this.Services.getPortafoliosList(client_id)
     .subscribe(
         data => {
           //console.log("Portafolios ", data)
           if(data.success){
             this.PortafoliosList=data.data
           }
         },
         error => {
           //this.error=true
         });
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
  onLabelChange(ev) {
    console.log(ev.value)
    if(ev.value=='Aval'){
      this.typeClient='Aval'
      this.communicationData=this.communicationData2
    }
    else{
      this.typeClient='Cliente'
      this.communicationData=this.communicationData3
    }
  }

  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {

    this.datos.push({
      subject: this.subject|| "",
      name: this.name,
      latterType: this.type,
      addressee: this.typeClient,
      description:this.description||"",
      portafolio_id: this.defaults.portafolio_id,
      content: this.form1.value||"",
    })
    this.Services.updateDataCommunication(this.defaults.portafolio_id,this.value,this.datos)
    .subscribe(
        data => {
          console.log("UPDATE ", data)
          if(data.success){
            this.dialogRef.close();
          }
        },
        error => {
          //this.error=true
        });
    
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
