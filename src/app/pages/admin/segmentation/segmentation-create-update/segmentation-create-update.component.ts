import { Component, Inject, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Segmentation } from '../interfaces/segmentation.model';
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
  selector: 'vex-segmentation-create-update',
  templateUrl: './segmentation-create-update.component.html',
  styleUrls: ['./segmentation-create-update.component.scss']
})
export class SegmentationCreateUpdateComponent implements OnInit {

  static id = 100;
  name1="Noemi"
  operaciones = [
    {valor:'suma', muestraValor:'Sumar'},
    {valor:'resta', muestraValor:'Restar'},
    {valor:'multiplicacion', muestraValor:'Multiplicar'},
    {valor:'division', muestraValor:'Dividir'}
  ];

  seleccionada: string = this.operaciones[0].valor;
  @Input() series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  @Input() options: ApexOptions = defaultChartOptions({
    grid: {
      show: true,
      strokeDashArray: 3,
      padding: {
        left: 16
      }
    },
    chart: {
      type: 'area',
      height: 384,
      sparkline: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 90, 100]
      }
    },
    colors: ['#008ffb', '#ff9800'],
    labels: [10, 40, 70, 100],//createDateArray(12),
    xaxis: {
      type: 'category',
      labels: {
        show: true
      },
    },
    yaxis: {
      labels: {
        show: true
      }
    },
    legend: {
      show: true,
      itemMargin: {
        horizontal: 4,
        vertical: 4
      }
    }
  });
  @Input() options2: ApexOptions = defaultChartOptions({
    grid: {
      show: true,
      strokeDashArray: 3,
      padding: {
        left: 16
      }
    },
    chart: {
      type: 'area',
      height: 384,
      sparkline: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 90, 100]
      }
    },
    colors: ['#008ffb', '#ff9800'],
    labels: [10, 40, 70, 100],//createDateArray(12),
    xaxis: {
      type: 'category',
      labels: {
        show: true
      },
    },
    yaxis: {
      labels: {
        show: true
      }
    },
    legend: {
      show: true,
      itemMargin: {
        horizontal: 4,
        vertical: 4
      }
    }
  });

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
              private dialogRef: MatDialogRef<SegmentationCreateUpdateComponent>,
              private fb: FormBuilder,
              private Services: Services) {
  }
  cliente_id=""
  portafolio_id=""
  register=0
  register2=0
  register3=0
  register4=0
  porcent1=0
  porcent2=0
  porcent3=0
  porcent4=0
  segmentation={
    name:"",
    criteria: []
  }
  seg=[]
  indexACT=0
  dataSourceIG=[]
  displayedColumnsIG: string[] = ['Cliente', 'Portafolio', 'Registros'];
  displayedColumnsSEG: string[] = ['Datos_Segmentados', 'Porcentaje', 'No_Segmentados'];
  ngOnInit() {
     console.log(createDateArray(12))
    this.getCustomersList();
    if (this.defaults) {
      this.cliente_id=this.defaults.client_id.name;
      this.portafolio_id=this.defaults.portafolio_id.name_portafolio
      this.register=this.defaults.portafolio_id.register
      this.seg=this.defaults.segmentation;
      if(this.defaults.segment){
        console.log("---^^^^^^^--",this.defaults.segment)
        this.segmentation=this.defaults.segment;
        this.mode = 'update';
        
        const index = this.defaults.segmentation.findIndex((i) => i.name === this.segmentation.name)
        if(index!=-1) this.indexACT=index
        else {
          this.mode = 'create';
          this.indexACT=0 
        }
        console.log("this.indexACT",this.indexACT, this.seg.length)
      }else{
        this.mode = 'create';
        this.indexACT=this.seg.length 
        console.log("this.indexACT 2",this.indexACT, this.seg.length)
      }
      
      //console.log("--------",this.defaults.segmentation)
      if(this.segmentation){
        console.log("---*********--",this.segmentation)

      }
      if(this.seg.length){
        console.log(this.seg)
        //console.log(this.cliente_id, this.portafolio_id, this.register, this.segmentation.criteria)
        

        
        if(this.segmentation.criteria[0]){
          //console.log("Holaaaa 2",this.segmentation.criteria[0])
          
          this.dataSourceIG=[{
            client_id:this.defaults.client_id.name,
            portafolio: this.defaults.portafolio_id.name_portafolio,
            register:this.defaults.portafolio_id.register
          }]
          this.segmentation.criteria[0].dataInfo=this.dataSourceIG;
          this.segmentation.criteria[0].dataGrhap={
            "options":this.options,
            "salesSeries":this.salesSeries,
            "chart": false
          }
          this.segmentation.criteria[0].dataSource=[]
          this.segmentation.criteria[0].dataSeg=[]
          this.analizar()
          this.guardar1()
        }
        if(this.segmentation.criteria[1]){
          //console.log("Holaaaa",this.segmentation.criteria[1])
          this.chart=true;
          this.dataSourceIG=[{
            client_id:this.defaults.client_id.name,
            portafolio: this.defaults.portafolio_id.name_portafolio,
            register:this.register2
          }]
          this.segmentation.criteria[1].dataInfo=this.dataSourceIG;
          this.segmentation.criteria[1].dataGrhap={
            "options":this.options,
            "salesSeries":this.salesSeries,
            "chart": false
          }
          this.segmentation.criteria[1].dataSource=[]
          this.segmentation.criteria[1].dataSeg=[]
          
          this.analizar2()
          this.guardar2()
        }
        if(this.segmentation.criteria[2]){
          this.openCriterio3=true
          this.form = this.fb.group({
            criterio2: [this.segmentation.criteria[2].name || ''],
            rango2A: [this.segmentation.criteria[2].rankA || ''],
            rango2B: [this.segmentation.criteria[2].rankB || '']
            })
        }
        if(this.segmentation.criteria[3]){
          this.openCriterio4=true
          this.form = this.fb.group({
            criterio2: [this.segmentation.criteria[3].name || ''],
            rango2A: [this.segmentation.criteria[3].rankA || ''],
            rango2B: [this.segmentation.criteria[3].rankB || '']
            })
        }
      }else{
        this.mode = 'create';
        console.log("CREATEEEEEEEE")
      }
      this.getMap(this.defaults.portafolio_id._id)
      
    } else {
      this.defaults = {} as Segmentation;
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
  analizar(){
    
    this.segmentation.criteria[0].dataGrhap.chart=false;
    this.spinner=true
    const segmentacion = this.defaults;
    console.log("_*_*",segmentacion.segmentation)
    console.log(segmentacion.segmentation[this.indexACT].criteria[0].name, segmentacion.portafolio_id)
    this.Services.getASegmentacion(segmentacion.segmentation[this.indexACT].criteria[0].name,segmentacion.portafolio_id._id)
      .subscribe(
          data => {
            if(data.success){
              
               console.log(this.salesSeries[0].data)
               console.log(this.options.labels)
               console.log(data.data)
               this.dataSourceIG=[{
                client_id:this.defaults.client_id.name,
                portafolio: this.defaults.portafolio_id.name_portafolio,
                register:this.defaults.portafolio_id.register
              }]
              this.options.labels=data.data.labelsGraph
               this.salesSeries[0].data=data.data.dataGraph
               this.datas=data.data
               this.chart=true
              this.segmentation.criteria[0].dataGrhap={
                "options":this.options,
                "salesSeries":this.salesSeries,
                "chart": true
              }
               this.segmentation.criteria[0].dataSource = [
                {date1: this.datas.data[0]+"-"+this.datas.data[1], date2: this.datas.data[1]+"-"+this.datas.data[2], date3: this.datas.data[2]+"-"+this.datas.data[3], date4: ''},
                {date1:this.datas.lables[0], date2: this.datas.lables[1], date3: this.datas.lables[2], date4: this.register-(this.datas.lables[0]+this.datas.lables[1]+this.datas.lables[2])},
              ];
              setTimeout(() => {
                this.spinner=false
              }, 1000);
            
            }
          },
          error => {
            //this.error=true
          });
  }
  analizar2(){
    this.chart2=false;
    const segmentacion = this.defaults;
    console.log("------Analizar2")
    let body={
      criterio1:segmentacion.segmentation[this.indexACT].criteria[0].name,
      criterio2: segmentacion.segmentation[this.indexACT].criteria[1].name,
      rango1A:segmentacion.segmentation[this.indexACT].criteria[0].rankA,
      rango1B:segmentacion.segmentation[this.indexACT].criteria[0].rankB

    }
    this.Services.getASegmentacion2(segmentacion.portafolio_id._id,body)
      .subscribe(
          data => {
            /*/if(data.success){
               console.log(this.salesSeries2[0].data)
               console.log(this.options.labels)
               console.log(data.data)
               this.options2.labels=data.data.labelsGraph
               this.salesSeries2[0].data=data.data.dataGraph
               this.datas2=data.data
               this.chart2=true
               this.dataSource2 = [
                {date1: this.datas2.data[0]+"-"+this.datas2.data[1], date2: this.datas2.data[1]+"-"+this.datas2.data[2], date3: this.datas2.data[2]+"-"+this.datas2.data[3], date4: ''},
                {date1:this.datas2.lables[0], date2: this.datas2.lables[1], date3: this.datas2.lables[2], date4: this.info-(this.datas2.lables[0]+this.datas2.lables[1]+this.datas2.lables[2])},
              ];
            }*/
            if(data.success){
              console.log("***",data.data, this.register2)
              this.dataSourceIG=[{
               client_id:this.defaults.client_id.name,
               portafolio: this.defaults.portafolio_id.name_portafolio,
               register:this.register-this.info
             }]
             this.segmentation.criteria[1].dataInfo=this.dataSourceIG;
             this.options.labels=data.data.labelsGraph
              this.salesSeries[0].data=data.data.dataGraph
              this.datas=data.data
              this.chart=true
             this.segmentation.criteria[1].dataGrhap={
               "options":this.options,
               "salesSeries":this.salesSeries,
               "chart": true
             }
             console.log("SEF, ", this.register2,this.info-(this.datas.lables[0]+this.datas.lables[1]+this.datas.lables[2]))
              this.segmentation.criteria[1].dataSource = [
               {date1: this.datas.data[0]+"-"+this.datas.data[1], date2: this.datas.data[1]+"-"+this.datas.data[2], date3: this.datas.data[2]+"-"+this.datas.data[3], date4: ''},
               {date1:this.datas.lables[0], date2: this.datas.lables[1], date3: this.datas.lables[2], date4: this.info-(this.datas.lables[0]+this.datas.lables[1]+this.datas.lables[2])},
             ];
             setTimeout(() => {
               this.spinner=false
             }, 1000);
           
           }
          },
          error => {
            //this.error=true
          });
  }
  analizar3(){
    this.chart2=false;
    const segmentacion = this.defaults;
    console.log("------Analizar3")
    let body={
      criterio1:segmentacion.segmentation[this.indexACT].criteria[0].name,
      criterio2: segmentacion.segmentation[this.indexACT].criteria[1].name,
      criterio3: segmentacion.segmentation[this.indexACT].criteria[2].name,
      rango1A:segmentacion.segmentation[this.indexACT].criteria[0].rankA,
      rango1B:segmentacion.segmentation[this.indexACT].criteria[0].rankB,
      rango2A:segmentacion.segmentation[this.indexACT].criteria[1].rankA,
      rango2B:segmentacion.segmentation[this.indexACT].criteria[1].rankB

    }
    this.Services.getASegmentacion2(segmentacion.portafolio_id._id,body)
      .subscribe(
          data => {
            /*/if(data.success){
               console.log(this.salesSeries2[0].data)
               console.log(this.options.labels)
               console.log(data.data)
               this.options2.labels=data.data.labelsGraph
               this.salesSeries2[0].data=data.data.dataGraph
               this.datas2=data.data
               this.chart2=true
               this.dataSource2 = [
                {date1: this.datas2.data[0]+"-"+this.datas2.data[1], date2: this.datas2.data[1]+"-"+this.datas2.data[2], date3: this.datas2.data[2]+"-"+this.datas2.data[3], date4: ''},
                {date1:this.datas2.lables[0], date2: this.datas2.lables[1], date3: this.datas2.lables[2], date4: this.info-(this.datas2.lables[0]+this.datas2.lables[1]+this.datas2.lables[2])},
              ];
            }*/
            if(data.success){
              console.log("***",data.data, this.register2)
              this.dataSourceIG=[{
               client_id:this.defaults.client_id.name,
               portafolio: this.defaults.portafolio_id.name_portafolio,
               register:this.register-this.info
             }]
             this.segmentation.criteria[1].dataInfo=this.dataSourceIG;
             this.options.labels=data.data.labelsGraph
              this.salesSeries[0].data=data.data.dataGraph
              this.datas=data.data
              this.chart=true
             this.segmentation.criteria[2].dataGrhap={
               "options":this.options,
               "salesSeries":this.salesSeries,
               "chart": true
             }
             console.log("SEF, ", this.register2,this.info-(this.datas.lables[0]+this.datas.lables[1]+this.datas.lables[2]))
              this.segmentation.criteria[2].dataSource = [
               {date1: this.datas.data[0]+"-"+this.datas.data[1], date2: this.datas.data[1]+"-"+this.datas.data[2], date3: this.datas.data[2]+"-"+this.datas.data[3], date4: ''},
               {date1:this.datas.lables[0], date2: this.datas.lables[1], date3: this.datas.lables[2], date4: this.info-(this.datas.lables[0]+this.datas.lables[1]+this.datas.lables[2])},
             ];
             setTimeout(() => {
               this.spinner=false
             }, 1000);
           
           }
          },
          error => {
            //this.error=true
          });
  }
  analizar4(){
    this.chart2=false;
    const segmentacion = this.defaults;
    console.log("------Analizar2")
    let body={
      criterio1:segmentacion.segmentation[this.indexACT].criteria[2].name,
      criterio2: segmentacion.segmentation[this.indexACT].criteria[3].name,
      rango1A:segmentacion.segmentation[this.indexACT].criteria[2].rankA,
      rango1B:segmentacion.segmentation[this.indexACT].criteria[2].rankB

    }
    this.Services.getASegmentacion2(segmentacion.portafolio_id._id,body)
      .subscribe(
          data => {
            /*/if(data.success){
               console.log(this.salesSeries2[0].data)
               console.log(this.options.labels)
               console.log(data.data)
               this.options2.labels=data.data.labelsGraph
               this.salesSeries2[0].data=data.data.dataGraph
               this.datas2=data.data
               this.chart2=true
               this.dataSource2 = [
                {date1: this.datas2.data[0]+"-"+this.datas2.data[1], date2: this.datas2.data[1]+"-"+this.datas2.data[2], date3: this.datas2.data[2]+"-"+this.datas2.data[3], date4: ''},
                {date1:this.datas2.lables[0], date2: this.datas2.lables[1], date3: this.datas2.lables[2], date4: this.info-(this.datas2.lables[0]+this.datas2.lables[1]+this.datas2.lables[2])},
              ];
            }*/
            if(data.success){
              console.log("***",data.data, this.register2)
              this.dataSourceIG=[{
               client_id:this.defaults.client_id.name,
               portafolio: this.defaults.portafolio_id.name_portafolio,
               register:this.register-this.info
             }]
             this.segmentation.criteria[3].dataInfo=this.dataSourceIG;
             this.options.labels=data.data.labelsGraph
              this.salesSeries[0].data=data.data.dataGraph
              this.datas=data.data
              this.chart=true
             this.segmentation.criteria[3].dataGrhap={
               "options":this.options,
               "salesSeries":this.salesSeries,
               "chart": true
             }
             console.log("SEF, ", this.register2,this.info-(this.datas.lables[0]+this.datas.lables[1]+this.datas.lables[2]))
              this.segmentation.criteria[3].dataSource = [
               {date1: this.datas.data[0]+"-"+this.datas.data[1], date2: this.datas.data[1]+"-"+this.datas.data[2], date3: this.datas.data[2]+"-"+this.datas.data[3], date4: ''},
               {date1:this.datas.lables[0], date2: this.datas.lables[1], date3: this.datas.lables[2], date4: this.info-(this.datas.lables[0]+this.datas.lables[1]+this.datas.lables[2])},
             ];
             setTimeout(() => {
               this.spinner=false
             }, 1000);
           
           }
          },
          error => {
            //this.error=true
          });
  }
  info=0
  guardar1(){
    const segmentacion = this.defaults;
    console.log(this.indexACT,segmentacion.segmentation[this.indexACT].criteria[0])
    this.Services.getASR(segmentacion.segmentation[this.indexACT].criteria[0].name,segmentacion.portafolio_id._id, segmentacion.segmentation[this.indexACT].criteria[0].rankA, segmentacion.segmentation[this.indexACT].criteria[0].rankB)
      .subscribe(
          data => {
            console.log("Hola 1 ", data)
            if(data.success){
               this.info=data.data;
               this.register2=this.register-this.info;
               this.porcent1= (100/this.register) * this.info;
               this.segmentation.criteria[0].dataSeg=[{
                "register":this.register2,
                "porcent":this.porcent1.toFixed(2),
                "info": this.info
              }]
            }
          },
          error => {
            //this.error=true
          });
  }
  info2=0
  guardar2(){
    const segmentacion = this.defaults;
    console.log("------Guardar 2")
    let body={
      criterio1:segmentacion.segmentation[this.indexACT].criteria[0].name,
      criterio2: segmentacion.segmentation[this.indexACT].criteria[1].name,
      rango1A:segmentacion.segmentation[this.indexACT].criteria[0].rankA,
      rango1B:segmentacion.segmentation[this.indexACT].criteria[0].rankB,
      rango2A:segmentacion.segmentation[this.indexACT].criteria[1].rankA,
      rango2B:segmentacion.segmentation[this.indexACT].criteria[1].rankB

    }
    this.Services.getASR2(segmentacion.portafolio_id._id,body)
      .subscribe(
          data => {
            console.log("Hola--", data)
            if(data.success){
               console.log(data.data)
               this.info2=data.data;
               this.register3=this.register2-this.info2;
               this.porcent2= (100/this.register3) * this.info2;
               console.log("........",this.register, this.register2, this.register3,this.porcent2, this.info2)
               this.segmentation.criteria[1].dataSeg=[{
                "register":this.register3,
                "porcent":this.porcent2.toFixed(2),
                "info": this.info2
              }]
            }
          },
          error => {
            //this.error=true
          });
  }
  changeCriterio(ev,index){
    console.log(ev.value)
  switch (index) {
    case 0:
      this.defaults.segmentation[0].criteria[0].name= ev.value
      this.analizar()
    break;
    case 1:
      this.defaults.segmentation[0].criteria[1].name= ev.value
      this.analizar2()
    break;
    case 2:
      this.defaults.segmentation[0].criteria[2].name= ev.value
      this.analizar3()
    break;
    case 3:
      this.defaults.segmentation[0].criteria[3].name= ev.value
      this.analizar4()
    
    break;
  
    default:
      break;
  }
  }
  segmentacion=[];
  segmentacionData=[]
  getMap(id){
      this.Services.getMap(id)
      .subscribe(
          data => {
            console.log("getMap ", data)
            if(data.success){
              this.segmentacion=data.data.segmentation;
              let segmentacion=[]
              data.data.segmentation.forEach(element => {
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
    this.segmentation.criteria.push({
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
    this.defaults.segmentation.push(this.segmentation)
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
      name:seg.name,
      criteria:[]
    }]
    if(seg.criterio1)
      body[0].criteria.push({
        name:seg.criterio1,
        rankA:seg.rango1A,
        rankB:seg.rango1B,
        percentage:this.porcent1
      })
    if(seg.criterio2)
      body[0].criteria.push({
        name:seg.criterio2,
        rankA:seg.rango2A,
        rankB:seg.rango2B,
        percentage:this.porcent2
      })
    if(seg.criterio3)
      body[0].criteria.push({
        name:seg.criterio3,
        rankA:seg.rango3A,
        rankB:seg.rango3B,
        percentage:this.porcent3
      })
    if(seg.criterio4)
      body[0].criteria.push({
        name:seg.criterio4,
        rankA:seg.rango4A,
        rankB:seg.rango4B,
        percentage:this.porcent4
      })
    console.log(body)
    
    this.Services.newSegmentation(this.defaults._id, seg.segmentation)
      .subscribe(
          data => {
            if(data.success){
              
              this.dialogRef.close(seg);
              
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
