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
  latterType="A4"
  addressee=""
  row={
    _id:""
  }
  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
      console.log("Hola 3",this.defaults)
      this.getMap(this.defaults.portafolio_id)
      //this.getPortafoliosList(this.defaults.client)
      this.value=this.defaults.value
      this.form1.setValue(this.defaults.communication.content)
      this.latterType =this.defaults.communication.latterType
      this.addressee=this.defaults.communication.addressee
      this.row=this.defaults.row

    } else {
      this.defaults = {} as Communication;
    }
    
    this.cuanti()

  }
  setData(){
    this.communicationData.forEach(element => {
      let text= this.form1.value;
      var strippedHtml = text.replaceAll("["+element+"]", this.row[element]);
      this.form1.setValue(strippedHtml)
    });
    
  }
  visible=true
  word=""
  rango=null
  
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
              if(element.status)
                this.communicationData3.push(element.data)
                this.communicationData.push(element.data)
                
            });
            data.data.endorsement.forEach(element => {
              if(element.status)
                this.communicationData2.push(element.data)
            });
            
           console.log("*******",this.addressee)
           if(this.addressee=='Aval'){
              this.communicationData=this.communicationData2
            }
            else{
              this.communicationData=this.communicationData3
            }
            console.log(this.communicationData)
            this.setData()
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
      let doc = pdf.save(this.row._id+'.pdf');
      var blob = pdf.output('blob'); 
      var blobPDF =  new Blob([blob], { type : 'application/pdf'});
      var blobUrl = URL.createObjectURL(blobPDF);
      window.open(blobUrl);
      //var myFile = blobToFile(myBlob, "my-image.png");
      //var file = new File([blob], 'untitled.pdf')
      const myFile = new File([blobPDF], this.row._id+".pdf", {
        type: blobPDF.type,
      });
      /*this.uploadService.uploadFile(myFile)
      .then(
        data => {
          console.log(data)
        })*/
    });
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

  updateCustomer() {

  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
