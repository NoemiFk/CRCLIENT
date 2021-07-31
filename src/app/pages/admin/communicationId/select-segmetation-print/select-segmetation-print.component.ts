import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'vex-select-segmetation-print',
  templateUrl: './select-segmetation-print.component.html',
  styleUrls: ['./select-segmetation-print.component.scss']
})
export class SelectSegmetationPrintComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
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
  CustomersList={}
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
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<SelectSegmetationPrintComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }

  _id_cliente=""
  ngOnInit() {
    this.getPortafolioSegmentation();
    console.log(this.defaults)
    this.getMap(this.defaults.portafolio_id._id)
   
  }
  communicationData=[]
  getMap(id){
    this.Services.getMap(id)
    .subscribe(
        data => {
          console.log("getMap ", data)
          if(data.success){
            data.data.strategies.forEach(element => {
              if(element.status)
                this.communicationData.push(element.data)
                
            });
            data.data.endorsement.forEach(element => {
              let index = this.communicationData.findIndex((data) => data === element.data);
              console.log("*-*-+",index)
              if(element.status && index-1)
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
  currentData=""
  indexSegmentation=1
  querys={}
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

          //console.log("version save 2",this.segment.segmentation[0].query)
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

  visible=true
  SegmentationList=null
  segmentation={
    name:"",
    description:"",
    type:"rank",
    criteria:[],
    register:0,
    porcent:0,
    query:"",
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
   onCheckboxChange(e){
    console.log(e)
    this.visible=e.checked
  }
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
             
             this.dialogRef.close(data.data);
           }
         },
         error => {
           //this.error=true
         });
    
  }



  updatePortafolio() {
    const portafolio = this.form.value;
    let portafolio_id = this.defaults._id;
    
    let body= {
      "agency_id": this.client.agency_id,
      "name_portafolio": portafolio.name_portafolio,
      "description": portafolio.description,
      "client_id": portafolio.client_id,
    }
    this.Services.updatePortafolio(portafolio_id,body)
    .subscribe(
        data => {
         //console.log("Hola ", data)
          if(data.success){
            this.agency=data.data
            this.dialogRef.close(data.data);
          }
        },
        error => {
          //this.error=true
        });
    this.dialogRef.close(portafolio);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
