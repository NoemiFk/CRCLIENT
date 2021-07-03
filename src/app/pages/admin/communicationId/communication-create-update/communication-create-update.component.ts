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
import icImage from '@iconify/icons-ic/outline-image';
import icLink from '@iconify/icons-ic/round-link';
import { AngularEditorConfig } from '@kolkov/angular-editor'; 
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
  icImage=icImage
  icLink=icLink
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
  info_agency=localStorage.getItem('currentAgency')
  agency=JSON.parse(this.info_agency);
  typeCommunication=""
  typeClient="Cliente"
  subject=""
  value=""
  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
      console.log("Hola 3",this.defaults)
      this.getMap(this.defaults.portafolio_id._id)
      //this.getPortafoliosList(this.defaults.client)
      this.value=this.defaults.value
      this.form1.setValue(this.defaults.content)
      this.typeCommunication =this.defaults.type
    } else {
      this.defaults = {} as Communication;
    }

    this.dataInfo=[{
      client_id:"Liverpool1",
      portafolio: "Clientes Morosos"
    }]
    this.cuanti()

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
  communicationData=[]
  communicationData2=[]
  communicationData3=[]
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
  addText(label){
    this.word=label
    
    console.log(this.text , this.form1.value)
  }
  print1(){
    var printContents = document.getElementById("page").innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
   // document.write (this.form1.value)

    window.print();

    document.body.innerHTML = originalContents;
    
   }

   print() {
    let printContents, popupWin;
    printContents = document.getElementById("print").innerHTML.toString();
    printContents = (<string>printContents + "").replace("col-sm", "col-xs");
    // console.log(printContents);
    popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Reporte</title>
          <meta name="viewport" content="width=10000, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <link rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.css" integrity="sha512-XMxqcAfuPHOh2Kz0Z3oDynUcLgyKP6B1NCKUTxyVbM02u1ZrygDcLddKw7KpN/SGmdw8raHbKgaIHP7+bEfGYw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.js" integrity="sha512-fKCmF3NjF4jFIMa8v37g880lz9dm9mS15c6q6kcYgEEqtya3mHwiXKKGvAUAvPgFatZ4uAV9Z21/ARJkoePZmA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
          <style>
            .salto_pagina_despues{
              page-break-after:always;
            }
            
            .salto_pagina_anterior{
              page-break-before:always;
            }

            .content {
              height: 100vh;
              width: 100%;
              display: flex;
              flex-direction: column;
            }

            .img-content {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .observation {
              height: 150px;
              overflow: hidden;
              overflow-y: auto;
            }
          </style>
        </head>
        <body onload="window.print();">
          ${this.form1.value}
          <div id="toolbar">
  <select class="ql-align">
    <option value=""></option>
    <option value="center"></option>
    <option value="right"></option>
    <option value="justify"></option>
  </select>
</div>
<div id="editor">
  <p>Hello World!</p>
  <p>Some initial <strong>bold</strong> text</p>
  <p><br></p>
</div>
        </body>
      </html>`);
    /* window.close(); */
    popupWin.document.close();
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
  character=0
  cuanti(){
    let text= this.form1.value;
    var strippedHtml = text.replace(/<[^>]+>/g, '');
    this.character=strippedHtml.length
    setTimeout(() => {
      //console.log(this.character)
    }, 0);
    //return true
  }

datos=[]

  updateCustomer() {
    console.log("Update")
    switch (this.defaults.type) {
      case "Cartas":
        this.value="Letter"
        break;
      case "Blaster":
        this.value="Blaster"
        break;
      case "Mail":
        this.value="Mail"
        break;
      case "Mensaje":
        this.value="SMS"
        break;
      case "Notificacion":
        break;
      case "Demanda":
        this.value="Demand"
        break;
      default:
        break;
    }
    this.datos.push({
      subject: this.defaults.subject|| "",
      name: this.defaults.name,
      latterType: this.defaults.type,
      addressee: this.typeClient,
      description:this.defaults.description||"",
      portafolio_id: this.defaults.portafolio_id._id,
      content: this.form1.value||"",
    })
    console.log(this.defaults.portafolio_id,this.value,this.datos)
    this.Services.updateDataCommunication(this.defaults.portafolio_id._id,this.value,this.datos)
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

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
