import { Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { UploadService } from '../../../../Services/upload.service';
import { findIndex } from 'rxjs/operators';

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
  seg="Segmento A"
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
              private Services: Services,
              private uploadService: UploadService) {
  }
  displayedColumnsIG: string[] = ['Cliente', 'Portafolio'];
  dataInfo=[]
  name="Comunicacion 1"
  headHTML='<div class="ql-editor">'
  endHTML='</div>'
  htmlContent = 'Hola, ';
  info_agency=localStorage.getItem('currentAgency')
  agency=JSON.parse(this.info_agency);
  typeCommunication=""
  typeClient="Cliente"
  subject=""
  value=""
  segmentation_id=""
  comunicationData=[]
  pdf=null
  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
      console.log("Hola 3",this.defaults)
      this.getMap(this.defaults.portafolio_id._id)
      //this.getPortafoliosList(this.defaults.client)
      this.value=this.defaults.value
      this.segmentation_id=this.defaults.segmentation_id
      this.form1.setValue(this.defaults.content)
      this.typeCommunication =this.defaults.type
    } else {
      this.defaults = {} as Communication;
    }

    this.dataInfo=[{
      client_id:"Liverpool1",
      portafolio: "Clientes Morosos"
    }]
    console.log("!!!!!!!!!!!!!!!!!",this.latterType)
    
    if(this.latterType="A4")
     this.pdf = new jsPDF('p', 'mm', "A4"); // A4 size page of PDF
    else
     this.pdf = new jsPDF('p', 'mm', [220, 340]); // A4 size page of PDF
  /////

    this.cuanti()
    this.getPortafolioSegmentation()
    this.getCommunication()

  }
  Communication=null
  index=null
  getCommunication() {
    this.Services.getCommunication(this.segmentation_id)
    .subscribe(
        data => {
          if(data.success){
            this.Communication=data.data
            console.log("Hola ", this.typeCommunication)

            if(this.typeCommunication=="Carta"){
              this.Communication.Letter.forEach(element => {
                this.comunicationData.push(element)
              });
            }
            if(this.typeCommunication=="Blaste"){
              this.Communication.Blaster.forEach(element => {
                
                this.comunicationData.push(element)
              });
            }
            if(this.typeCommunication=="Mail"){
              this.Communication.Mail.forEach(element => {
                
                this.comunicationData.push(element)
              });
            }
            if(this.typeCommunication=="SMS"){
              this.Communication.SMS.forEach(element => {
                
                this.comunicationData.push(element)
              });
            }
            if(this.typeCommunication=="Notification"){
              this.Communication.Notification.forEach(element => {
                
                this.comunicationData.push(element)
              });
            }
            if(this.typeCommunication=="Demand"){
              this.Communication.Demand.forEach(element => {
                
                this.comunicationData.push(element)
              });
            }
            console.log("--",this.comunicationData)
            //findIndex
            this.index = this.comunicationData.findIndex((c) => c._id === this.defaults._id);
              console.log("INDEX",this.index)
            }
            
        },
        error => {
          //this.error=true
        });
  }
  visible=true
  word=""
  rango=null
  latterType="A4"
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
  onCheckboxChange(e){
    console.log(e)
    this.visible=e.checked
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
              if(element.status){

                this.communicationData3.push(element.data)
                this.communicationData.push(element.data)
              }
                
            });
            data.data.endorsement.forEach(element => {
              if(element.status)
                this.communicationData2.push(element.data)
            });
            console.log("----",this.communicationData)
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
  SegmentationList=[]
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
   currentSegmentationList=null
   getPortafolioSegmentation() {
    //console.log("GET PORTAFOLOS",this.client.agency_id, client_id)
     this.Services.getPortafolioSegmentation(this.defaults.portafolio_id._id)
     .subscribe(
         data => {
        console.log("Segmentations ", data)
           if(data.success){
             this.SegmentationList=data.data.segmentation
             this.segment=data.data  
           }
         },
         error => {
           //this.error=true
         });
   }
   @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
   GeneratePDF(){
    //var data = document.getElementById('contentToConvert');

    html2canvas(document.querySelector('.ql-editor')).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'marble-diagram.png';
      this.downloadLink.nativeElement.click();
    });
    
    
   /* html2canvas(data).then(canvas => {
    // Few necessary setting options
    var imgWidth = 208;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;
    
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save('new-file.pdf'); // Generated PDF
    });*/
  }
  urlImage=""
  downloadImage(){
    html2canvas(document.querySelector('.ql-editor')).then(canvas => {
      var imgWidth = 166;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'marble-diagram.png';
      this.downloadLink.nativeElement.click();
      let pdf = new jsPDF('p', 'mm', 'A4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(this.downloadLink.nativeElement.href , 'PNG', 20, 10, imgWidth, imgHeight)
      let doc = pdf.save('new-file.pdf');
      var blob = pdf.output('blob'); 
      var blobPDF =  new Blob([blob], { type : 'application/pdf'});
      var blobUrl = URL.createObjectURL(blobPDF);
      window.open(blobUrl);
      //var myFile = blobToFile(myBlob, "my-image.png");
      //var file = new File([blob], 'untitled.pdf')
      const myFile = new File([blobPDF], "untitled234.pdf", {
        type: blobPDF.type,
      });
      this.uploadService.uploadFile(myFile)
      .then(
        data => {
          console.log(data)
          this.urlImage=data.toString()
        })
    });
  }
   
   GeneratePDF1(){
    const doc = new jsPDF();
   
   // const pdfTable = this.pdfTable.nativeElement;
   //console.log(this.form1)
    let htmlFinal = this.headHTML +this.form1.value+ this.endHTML
    console.log(htmlFinal)
    var dom = document.createElement('div');
    console.log(dom)
	  dom.innerHTML = htmlFinal
    console.log(dom)
    var html = htmlToPdfmake(dom);
     
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open(); 
    let pdf = pdfMake.createPdf(documentDefinition)
    pdf.getBlob((blob) => {
      var file = new File([blob], 'untitled.pdf')
      this.uploadService.uploadFile(file)
      .then(
        data => {
          console.log(data)
          //this.urlImage=data.toString()
        })
    });
    //var file = new File(pdfMake.createPdf(documentDefinition), "pdf.pdf");
   }
   


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
    //this.downloadImage()
    console.log("Update", this.defaults)
    switch (this.defaults.type) {
      case "Carta":
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
        this.value="Notification"
        break;
      case "Demanda":
        this.value="Demand"
        break;
      default:
        break;
    }
    this.comunicationData[this.index]={
      subject: this.defaults.subject|| "",
      name: this.defaults.name,
      latterType: this.defaults.latterType,
      addressee: this.typeClient,
      description:this.defaults.description||"",
      portafolio_id: this.defaults.portafolio_id._id,
      content: this.form1.value||"",
    }
    console.log(this.defaults.portafolio_id,this.value,this.comunicationData)
    this.Services.updateDataCommunication(this.defaults.portafolio_id._id,this.value,this.comunicationData)
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

  ////////////
  indexSegmentation=1
  querys={}
  segment={
    _id:"",
    portafolio_id:"",
    segmentation:[{
      name:"",
      description:"",
      type:"rank",
      criteria:[],
      register:0,
      porcent:0,
      query:"",
    }]
  }
  segmentation={
    name:"",
    description:"",
    type:"rank",
    criteria:[],
    register:0,
    porcent:0,
    query:"",
  }
  
  onSegChange(ev){
    this.segmentation=ev.value
    console.log("criteria",this.segmentation.criteria )
    let x=this.segmentation.criteria.length -1
    this.indexSegmentation  = this.SegmentationList.findIndex((seg) => seg._id === ev.value._id);

    console.log(x, this.indexSegmentation )
    let body={
      "query": {},
      "criterio1": "Riesgo"
     }
     let q1={}
     let q2={}
     let q3={}
     let query1={}
     let query2={}
     let query3={}
    switch (x) {
      case 0:
        let q1= this.getQuery(x);
        //console.log(q1)
        /** 
         * {[this.segmentation.criteria[x].name]: {
            "$gte": parseInt(this.segmentation.criteria[x].rankA),
            "$lte": parseInt(this.segmentation.criteria[x].rankB)
            }
          }
        */
        body={
          "query": q1,
          "criterio1": this.segmentation.criteria[x].name
        }
        if(this.indexSegmentation == 1){

          console.log("version save 2",this.segment.segmentation[0])
          query1= JSON.parse(this.segment.segmentation[0].query)
          //console.log("version  save 2.1",query1)
          body={
            "query": {
              "$and": [ q1,query1
              ]
          },
            "criterio1": this.segmentation.criteria[x].name
          }
        }
        if(this.indexSegmentation == 2){

          //console.log("version 3",this.segment.segmentation[1].query)
          query1= JSON.parse(this.segment.segmentation[0].query)
          query2= JSON.parse(this.segment.segmentation[1].query)
          //console.log("version 3.1",query1)
          body={
            "query": {
              "$and": [ q1,query1,query2
              ]
          },
            "criterio1": this.segmentation.criteria[x].name
          }
        }
        //console.log(body.query)
        break;
        case 1:
          let q01 = this.getQuery(0);
          let q02= this.getQuery(x);
          //console.log(q01)
          //console.log(q02)
          
          body={
            "query": {
                "$and": [ q01,q02
                ]
            },
            "criterio1": this.segmentation.criteria[x].name
          }
          if(this.indexSegmentation == 1){

            //console.log("version save 2",this.segment.segmentation[0].query)
            let query1= JSON.parse(this.segment.segmentation[0].query)
            //console.log("version  save 2.1",query1)
            body={
              "query": {
                "$and": [ q01,q02,query1
                ]
            },
              "criterio1": this.segmentation.criteria[x].name
            }
          }
          if(this.indexSegmentation == 2){

            //console.log("version save 2",this.segment.segmentation[0].query)
            let query1= JSON.parse(this.segment.segmentation[0].query)
            let query2= JSON.parse(this.segment.segmentation[1].query)
            //console.log("version  save 2.1",query1)
            body={
              "query": {
                "$and": [ q01,q02,query1,query2
                ]
            },
              "criterio1": this.segmentation.criteria[x].name
            }
          }
          break;
        case 2:
          let q11 = this.getQuery(0);
          let q12= this.getQuery(1);
          let q13= this.getQuery(x);
          //console.log(q11)
          //console.log(q12)
          //console.log(q13)
          
          body={
            "query": {
                "$and": [ q11,q12,q13
                ]
              
            },
            "criterio1": this.segmentation.criteria[x].name
          }
          if(this.indexSegmentation == 1){

            //console.log("version save 2",this.segment.segmentation[0].query)
            let query1= JSON.parse(this.segment.segmentation[0].query)
            //console.log("version  save 2.1",query1)
            body={
              "query": {
                "$and": [ q11,q12,q13,query1
                ]
            },
              "criterio1": this.segmentation.criteria[x].name
            }
          }
          if(this.indexSegmentation == 2){

            //console.log("version save 2",this.segment.segmentation[0].query)
            let query1= JSON.parse(this.segment.segmentation[0].query)
            let query2= JSON.parse(this.segment.segmentation[1].query)
            //console.log("version  save 2.1",query1)
            body={
              "query": {
                "$and": [ q11,q12,q13,query1,query2
                ]
            },
              "criterio1": this.segmentation.criteria[x].name
            }
          }
          break;    
      default:
        break;
    }
    this.querys=body.query;
    console.log("QUERY",body.query)
  }
  
  getQuery(x){
    console.log("X",x)
    let q={}
    switch (this.segmentation.criteria[x].type) {
      case 'rank':
        q={[this.segmentation.criteria[x].name]: {
          "$gte": parseInt(this.segmentation.criteria[x].rankA),
          "$lte": parseInt(this.segmentation.criteria[x].rankB)
          }
        }
        break;
        case 'higher':
          q={[this.segmentation.criteria[x].name]: {
            "$gte": parseInt(this.segmentation.criteria[x].rankA)
            }
          }
          break;
        case 'less':
          q={[this.segmentation.criteria[x].name]: {
            "$lte": parseInt(this.segmentation.criteria[x].rankA)
            }
          }
          break;
        case 'equal':
          q={[this.segmentation.criteria[x].name]: parseInt(this.segmentation.criteria[x].rankA)
          }
          break;
    
      default:
        break;
      }
      //console.log("QUERY",q)
      return q
  }
  currentData=""
  idReturn=""
  generar() {
    let body={
      isSegmentation: this.currentSegmentationList?true:false,
      isPortafolio:  this.currentSegmentationList?false:true,
      communication_id: this.defaults._id,
      portafolio_id:this.defaults.portafolio_id._id,
      segmentation_id: this.currentSegmentationList?this.currentSegmentationList._id:null,
      communication:{
          content:this.defaults.content,
          latterType:this.defaults.latterType,
          addressee:this.defaults.addressee
      },
      addressee:this.defaults.addressee,
      query:JSON.stringify(this.querys),
      data:[],
      value:this.currentData
      }
    console.log("QUERY-----",body.query)
    this.Services.printValidate(body)
     .subscribe(
         data => {
        console.log("Segmentations ", data)
           if(data.success){
             console.log(data)
             //this.dialogRef.close(data.data);
             this.idReturn=data.data
             this.getPrnt(data.data) 
           }
         },
         error => {
           //this.error=true
         });
    
  }
  Cartera=[]
  
  getPrnt(id) {
    this.Services.getPrnt(id)
    .subscribe(
        data => {
        console.log("Hola ", data.data)
          if(data.success){
            this.print=data.data
            this.value = data.data.value
            this.Cartera=data.data.cart

            console.log("++++++++",this.Cartera)
            this.downloadImageMasive()

            }
            
        },
        error => {
          //this.error=true
        });
  }

  textOriginal=""
  downloadImageMasive(){
    this.textOriginal= this.form1.value;
    let promises=[]
    for (let index = 0; index < 10; index++) {
        
        this.setData(this.Cartera[index])
        console.log("-->", this.Cartera[index].Nombre)
        promises.push(this.construir(this.Cartera[index].Nombre))

      
    }
    Promise.all(promises)
    .then(result => {
        console.log("Correos enviados", result)
        console.log("Termino for")
        this.pdf.save(this.idReturn+'.pdf');
    })
    .catch(err =>{
      console.log(err)
    })
    
    
  }
  setData(data){
    this.form1.setValue(this.textOriginal)
    this.communicationData.forEach(element => {
      let text= this.form1.value;
      var strippedHtml = text.replaceAll("["+element+"]", data[element]);
      console.log(strippedHtml)
      this.form1.setValue(strippedHtml)
    });
     console.log("termino de ")
    
  }
  construir(x){
    return new Promise((resolve, reject) => {
      html2canvas(document.querySelector('.ql-editor')).then(canvas => {
        var imgWidth = 170;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
  
        //////
        console.log("  222 -->", x)
       
          this.canvas.nativeElement.src = canvas.toDataURL();
          this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
          //this.downloadLink.nativeElement.download = 'marble-diagram.png';
          //this.downloadLink.nativeElement.click();
          
           
          var position = 0;
          console.log("this.",this.downloadLink.nativeElement.href )
          this.pdf.addImage(this.downloadLink.nativeElement.href , 'PNG', 20, 10, imgWidth, imgHeight)
          this.pdf.addPage();
  
      
       // let doc = pdf.save(this.idReturn+'.pdf');
        var blob = this.pdf.output('blob'); 
        var blobPDF =  new Blob([blob], { type : 'application/pdf'});
        var blobUrl = URL.createObjectURL(blobPDF);
        //window.open(blobUrl);
        //var myFile = blobToFile(myBlob, "my-image.png");
        //var file = new File([blob], 'untitled.pdf')
        const myFile = new File([blobPDF], this.idReturn+".pdf", {
          type: blobPDF.type,
        });
        resolve(true)
        /*this.uploadService.uploadFile(myFile)
        .then(
          data => {
            console.log(data)
          })*/
      });
    })
  }
}
