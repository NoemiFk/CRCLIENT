import { Component, Inject, OnInit,ViewChild,ElementRef } from '@angular/core';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import icInfo from '@iconify/icons-ic/info';
import icError from '@iconify/icons-ic/error';
import icWarning from '@iconify/icons-ic/warning';
import icQuestion from '@iconify/icons-ic/question-answer';
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
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

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
  icInfo =icInfo
  icError = icError
  icWarning = icWarning
  icQuestion=icQuestion
  segmentObjet={
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

  this.onLabelChange({value:"Client"})
  this.getPortafolioSegmentation();
  }
  currentSegmentationList=null
  SegmentationList=[]
  getPortafolioSegmentation() {
   console.log("GET PORTAFOLOS",this.defaults.portafolio_id)
    this.Services.getPortafolioSegmentation(this.defaults.portafolio_id)
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
  visible=false
  onCheckboxChange(e){
    console.log(e)
    this.visible=e.checked
  }
  querys=null
  segmentation={
    name:"",
    description:"",
    type:"rank",
    criteria:[],
    register:0,
    porcent:0,
    query:"",
  }
  indexSegmentation=null
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

          //console.log("version save 2",this.segmentObjet.segmentation[0].query)
          query1= JSON.parse(this.segmentObjet.segmentation[0].query)
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

          //console.log("version 3",this.segmentObjet.segmentation[1].query)
          query1= JSON.parse(this.segmentObjet.segmentation[0].query)
          query2= JSON.parse(this.segmentObjet.segmentation[1].query)
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

            //console.log("version save 2",this.segmentObjet.segmentation[0].query)
            let query1= JSON.parse(this.segmentObjet.segmentation[0].query)
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

            //console.log("version save 2",this.segmentObjet.segmentation[0].query)
            let query1= JSON.parse(this.segmentObjet.segmentation[0].query)
            let query2= JSON.parse(this.segmentObjet.segmentation[1].query)
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

            //console.log("version save 2",this.segmentObjet.segmentation[0].query)
            let query1= JSON.parse(this.segmentObjet.segmentation[0].query)
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

            //console.log("version save 2",this.segmentObjet.segmentation[0].query)
            let query1= JSON.parse(this.segmentObjet.segmentation[0].query)
            let query2= JSON.parse(this.segmentObjet.segmentation[1].query)
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
 getMap(id){
    this.Services.getMap(id)
    .subscribe(
        data => {
          console.log("getMap ", data)
          if(data.success){
            data.data.strategies.forEach(element => {
              if(element.status){
                console.log("---", element)
                this.communicationData3.push(element.data)
               //this.communicationData.push(element.data)
              }
                
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
      if (!this.name) {
        return
      }
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }
  printPDF = true

  createCustomer() {

    this.datos.push({
      subject: this.subject|| "",
      name: this.name,
      latterType: this.latterType,
      addressee: this.typeClient,
      description:this.description||"",
      portafolio_id: this.defaults.portafolio_id,
      content: this.form1.value||"",
    })
    this.Services.updateDataCommunication(this.defaults.portafolio_id,this.value,this.datos)
    .subscribe(
        data => {
          console.log("UPDATE ", data, this.title)
          if(data.success){
            if(this.title != "Cartas" && this.title != "Notificaciones"){

              this.dialogRef.close();
            }
            this.printPDF = false
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
  currentData=""
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
    
    this.Services.printValidate(body)
     .subscribe(
         data => {
        console.log("Segmentations ", data)
           if(data.success){
            this.downloadImage()
             //this.dialogRef.close(data.data);
           }
         },
         error => {
           //this.error=true
         });
    
  }

  ///////////
  headHTML='<div class="ql-editor">'
  endHTML='</div>'
 
  GeneratePDF(){
    html2canvas(document.querySelector('.ql-editor')).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'marble-diagram.png';
      this.downloadLink.nativeElement.click();
    });
    
  }

  downloadImage(){

    
    html2canvas(document.querySelector('.ql-editor')).then(canvas => {
      var imgWidth = 170;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      //////
      console.log("!!!!!!!!!!!!!!!!!",this.latterType)
        let pdf=null
        if(this.latterType="A4")
         pdf = new jsPDF('p', 'mm', "A4"); // A4 size page of PDF
        else
         pdf = new jsPDF('p', 'mm', [220, 340]); // A4 size page of PDF
      /////
      for (let index = 0; index < 3; index++) {
      
      
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        //this.downloadLink.nativeElement.download = 'marble-diagram.png';
        //this.downloadLink.nativeElement.click();
        
         
        var position = 0;
        pdf.addImage(this.downloadLink.nativeElement.href , 'PNG', 20, 10, imgWidth, imgHeight)
        pdf.addPage();

    }
      let doc = pdf.save('test.pdf');
      var blob = pdf.output('blob'); 
      var blobPDF =  new Blob([blob], { type : 'application/pdf'});
      var blobUrl = URL.createObjectURL(blobPDF);
      window.open(blobUrl);
      //var myFile = blobToFile(myBlob, "my-image.png");
      //var file = new File([blob], 'untitled.pdf')
      const myFile = new File([blobPDF], "test.pdf", {
        type: blobPDF.type,
      });
      /*this.uploadService.uploadFile(myFile)
      .then(
        data => {
          console.log(data)
        })*/
    });
  }
}
