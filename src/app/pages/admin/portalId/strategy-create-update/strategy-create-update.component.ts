import { Component, Inject, OnInit,Input } from '@angular/core';
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
import { MatSelectChange } from '@angular/material/select';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import { ApexOptions } from '../../../../../@vex/components/chart/chart.component';
import { defaultChartOptions } from '../../../../../@vex/utils/default-chart-options';
import { createDateArray } from '../../../../../@vex/utils/create-date-array';
import { timeout, findIndex } from 'rxjs/operators';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface segmentA {
  name: string;
  percentage: number;
  rankB: number;
  rankA: string;
  dataIG: any;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'vex-strategy-create-update',
  templateUrl: './strategy-create-update.component.html',
  styleUrls: ['./strategy-create-update.component.scss']
})
export class StrategyCreateUpdateComponent implements OnInit {

  static id = 100;
  name1="Noemi"
  operaciones = [
    {valor:'suma', muestraValor:'Sumar'},
    {valor:'resta', muestraValor:'Restar'},
    {valor:'multiplicacion', muestraValor:'Multiplicar'},
    {valor:'division', muestraValor:'Dividir'}
  ];

  seleccionada: string = this.operaciones[0].valor;
  init=""
  communication={
    name:""
  }
  Communication={
    agency_id:{},
    client_id:{
      name:""
    },
    Letter:[],
    SMS: [],
    Blaster: [],
    Mail: [],
    Notification: [],
    Demand: []
  };
  comunicationData=[]
  changeSelect(ev){
    console.log(ev)
  }
  client_id = "60c3d84785f7f11ddd6b285c";
  getCommunications=[]
  getCommunication() {
    this.Services.getCommunication(this.client_id)
    .subscribe(
        data => {
        console.log("Hola ", data.data)
          if(data.success){
            this.Communication=data.data
            if(this.defaults.Comunicacion=="CARTA"){
              console.log("---",this.Communication.Letter)
              this.getCommunications=this.Communication.Letter
            }
            if(this.defaults.Comunicacion=="SMS"){
              
              this.getCommunications=this.Communication.SMS
            }
            if(this.defaults.Comunicacion=="BLASTER"){
              
              this.getCommunications=this.Communication.Blaster
            }
            if(this.defaults.Comunicacion=="NOTIFICACIÓN"){
              
              this.getCommunications=this.Communication.Notification
            }
            if(this.defaults.Comunicacion=="DEMANDA"){
              
              this.getCommunications=this.Communication.Demand
            }
            if(this.defaults.Comunicacion=="MAIL"){
              
              this.getCommunications=this.Communication.Mail
            }
            console.log("GET",this.getCommunications)

            
              
            }
            
        },
        error => {
          //this.error=true
        });
  }

  convert(){
    var s = this.currentComunication.content;
    var htmlObject = document.getElementById("html");
    htmlObject.innerHTML = s;
  }
  currentComunication={
    content:""
  }
  onLabelChange(ev){
    this.currentComunication = ev.value
    console.log("currentComunication",this.currentComunication)
    this.convert()
  }

  salesSeries: ApexAxisChartSeries = [{
    name: 'Clientes',
    data: [10, 20, 10, 60]
  }];
  salesSeries2: ApexAxisChartSeries = [{
    name: 'Clientes',
    data: [10, 20, 10, 60]
  }];
  //TABEL
 
  displayedColumns: string[] = ['date1', 'date2', 'date3', 'date4'];
 
  dataSource=[]
  dataSource2=[]

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  openCriterio2=false
  openCriterio3=false
  openCriterio4=false

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;

  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any, 
              private dialogRef: MatDialogRef<StrategyCreateUpdateComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }
  cliente_id=""
  portafolio_id=""
  time="AM"
  strategy={
    name:"",
    criteria: []
  }
  seg=[]
  indexACT=0
  dataSourceIG=[]
  displayedColumnsIG: string[] = ['Cliente', 'Portafolio', 'Registros'];
  displayedColumnsSEG: string[] = ['Datos_Segmentados', 'Porcentaje', 'No_Segmentados'];
  times="12:00 pm"
  ngOnInit() {
    this.getCommunication()
     console.log("Comun")
     if (this.defaults ) {
      console.log("Default",this.defaults.name_seg, this.defaults[this.defaults.name_seg])
      console.log("--",this.defaults[this.defaults.name_seg] ? this.defaults[this.defaults.name_seg].label:"")
      this.init=this.defaults[this.defaults.name_seg] ? this.defaults[this.defaults.name_seg].hour:""
      this.time=this.defaults[this.defaults.name_seg] ? this.defaults[this.defaults.name_seg].time:"AM"
      this.communication= this.defaults[this.defaults.name_seg] ? this.defaults[this.defaults.name_seg].label:""
       
     } else {
       this.defaults = {} as Strategy;
       console.log("NEWWWWWWW")
     }
   

  }
  chart=false
  chart2=false
  datas={
    data:[],
    lables:[]
  }
  datas2={
    data:[],
    lables:[]
  }
  spinner=false
 
 
  
  segmentacion=[];
  segmentacionData=[]
  getMap(id){
      this.Services.getMap(id)
      .subscribe(
          data => {
            console.log("getMap ", data)
            if(data.success){
              this.segmentacion=data.data.strategy;
              let segmentacion=[]
              data.data.strategy.forEach(element => {
                if(element.status)
                  this.segmentacionData.push(element.data)
              });
              console.log(this.segmentacionData)
             // this.CustomersList=data.data
              
            }
          },
          error => {
            //this.error=true
          });
    }
    CustomersList=[];
    getCustomersList() {
      this.Services.getCustomersList(this.client.agency_id)
      .subscribe(
          data => {
            //console.log("Hola ", data)
            if(data.success){
              this.CustomersList=data.data
              
              
            }
          },
          error => {
            //this.error=true
          });
    }
    PortafoliosList=[];
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
     cliente={}
    changeCliente(change: MatSelectChange,){
       console.log(change)
      this.portafolio.client=change.value.name
      this.getPortafoliosList(change.value._id)
    }
    total=0
    portafolio={
      client:'',
      name_portafolio:'',
      register:0
    }
    changePortafolio(change: MatSelectChange,){
      console.log(change.value._id)
      this.portafolio=change.value;
      this.total=change.value.register;
     this.getMap(change.value._id)
   }
  newCriteria(){
    this.strategy.criteria.push({
      dataInfo:[{
        client_id:this.defaults.client_id.name,
        portafolio: this.defaults.portafolio_id.name_portafolio,
        register:this.defaults.portafolio_id.register
      }],
      dataGrhap: [],
      dataSeg: [],
      dataSource:  [],
      name: "",
      percentage: 0,
      rankA: "",
      rankB: ""
    })
    this.defaults.strategy.push(this.strategy)
    console.log(this.defaults)
  }
  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.createCustomer();
    }
  }

  createCustomer() {
    const seg = this.defaults; 
    console.log(seg)
    let body=[{
      communication:this.communication,
      label:this.communication.name,
      times:this.times
    }]
   
    console.log(body)
    
    this.dialogRef.close(body);
    
    /*this.Services.newStrategy(this.defaults._id, seg.strategy)
      .subscribe(
          data => {
            if(data.success){
              
              this.dialogRef.close(seg);
              
            }
          },
          error => {
            //this.error=true
          });*/
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
