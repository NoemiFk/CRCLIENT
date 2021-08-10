import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Segmentation } from './interfaces/segmentation.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from '../../../../static-data/aio-table-data';
import { SegmentationCreateUpdateComponent } from './segmentation-create-update/segmentation-create-update.component';
import { SegmentationCreateComponent } from './segmentation-create/segmentation-create-update.component';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from '../../../../@vex/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSelectChange } from '@angular/material/select';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import icPerson from '@iconify/icons-ic/twotone-person';
import {Services} from '../../../Services/services'
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApexOptions } from '../../../../@vex/components/chart/chart.component';
import { defaultChartOptions } from '../../../../@vex/utils/default-chart-options';
import { createDateArray } from '../../../../@vex/utils/create-date-array';
import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';
import icInfo from '@iconify/icons-ic/info';

@UntilDestroy()
@Component({
  selector: 'vex-segmentation',
  templateUrl: './segmentation.component.html',
  styleUrls: ['./segmentation.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class SegmentationComponent implements OnInit {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Segmentation[]> = new ReplaySubject<Segmentation[]>(1);
  data$: Observable<Segmentation[]> = this.subject$.asObservable();
  segmentations: Segmentation[];
  icPerson = icPerson;
  icInfo=icInfo;
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  constructor( private Services: Services,private router: Router, private route:ActivatedRoute) {
  }
  
  @Input() series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  @Input() options: ApexOptions = defaultChartOptions({
    grid: {
      show: true,
      strokeDashArray: 3,
      padding: {
        left: 16
      }
    },
    title: {
      text: "Previsualización de segmentación del portafolio",
      align: "center"
    },
    
    chart: {
      type: 'area',
      height: 400,
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
      tooltip: {
        enabled: true,
      }
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
  displayedColumnsIG: string[] = ['Cliente', 'Portafolio'];
  displayedColumnsSEG: string[] = ['Registros','Datos_Segmentados', 'Porcentaje', 'No_Segmentados'];
  displayedColumns: string[] = ['date1', 'date2', 'date3', 'date4', 'date5'];
  displayedColumnsNew: string[] = ['date1', 'date2', 'date3', 'date4', 'date5'];


  displayedColumnsA1: string[] = ['RESUMEN DE PORTAFOLIO', '-'];
  displayedColumnsB1: string[] = ['RESUMEN DE SEGMENTACIÓN', '-', '-'];
  displayedColumnsC1: string[] = ['SEGMENTO', 'REGISTROS', '%'];
  generalIF=[{
    name:"",
    data:""
  }];

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 0;
  bufferValue = 10; 
  segmentation_id = this.route.snapshot.params.id;
  indexSegmentation = this.route.snapshot.params.index;
  segmentation={
    name:"",
    description:"",
    type:"rank",
    criteria:[],
    register:0,
    porcent:0,
    query:"",
  }
  segmentation1={
    name:"",
    description:"",
    type:"rank",
    register:0,
    porcent:0,
    query:{},
    criteria:[]
  }
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
  AddCriteria=true
  spinner=false
  dataSourceIG=[]
  portafolio={
    client_id:{name:""},
    name_portafolio:"",
    _id:"",
    register:0
  }
  ngOnInit() {
    console.log(this.indexSegmentation, this.segmentation_id)
    this.getSegmentation()
    
    
  }
  isEdit=false
  isNew=false
  getSegmentation(){
    this.Services.getSegmentation(this.segmentation_id)
    .subscribe(
        data => {
          if(data.success){
            this.segment=data.data;
            this.getPortaolio(this.segment.portafolio_id)
            this.getMap(this.segment.portafolio_id)
            //console.log("Segmento",this.segment)
            //console.log("Segmentacion1",data.data.segmentation)
            //console.log("Segmentacion1",data.data.segmentation.length!=0,data.data.segmentation[this.indexSegmentation],this.segmentation1)
            this.segmentation=data.data.segmentation[this.indexSegmentation]?data.data.segmentation[this.indexSegmentation]:this.segmentation1
             //console.log("Segmentacion",this.segmentation)
             //console.log("Segmento",this.segment)
             if(data.data.segmentation.length){
              //console.log("_____________No_____________")
              this.isEdit=true
               if(this.segmentation.criteria.length){
                let promises=[]
                

            
                 if(this.segmentation.criteria[0]){
                  // console.log("<<<<<<<<<<<<<<<<<<<<<",this.segmentation.query)
                   //console.log("<<<<<<<<<<<<<<<<<<<<<",JSON.parse(this.segmentation.query))
                   
                   
                   this.segmentation.criteria[0].dataInfo=this.dataSourceIG;
                   this.segmentation.criteria[0].dataGrhap={
                     "options":this.options,
                     "salesSeries":this.salesSeries,
                     "chart": false
                   }
                   this.segmentation.criteria[0].dataSource=[]
                   this.segmentation.criteria[0].dataSeg=[]
                   //this.analytics(0)
                   promises.push(this.analytics(0))
                   
                   //this.guardar1()
                   }
                 if(this.segmentation.criteria[1]){
                 
                   this.segmentation.criteria[1].dataInfo=this.dataSourceIG;
                   this.segmentation.criteria[1].dataGrhap={
                     "options":this.options,
                     "salesSeries":this.salesSeries,
                     "chart": false
                   }
                   this.segmentation.criteria[1].dataSource=[]
                   this.segmentation.criteria[1].dataSeg=[]
                   //this.analytics(1)
                   promises.push(this.analytics(1))
                   //this.guardar1()
                   }
                 if(this.segmentation.criteria[2]){
               
                   this.segmentation.criteria[2].dataInfo=this.dataSourceIG;
                   this.segmentation.criteria[2].dataGrhap={
                     "options":this.options,
                     "salesSeries":this.salesSeries,
                     "chart": false
                   }
                   this.segmentation.criteria[2].dataSource=[]
                   this.segmentation.criteria[2].dataSeg=[]
                   //this.analytics(2)
                   promises.push(this.analytics(2))
                   //this.guardar2()
                   }
                 if(this.segmentation.criteria[3]){
             
                   this.segmentation.criteria[3].dataInfo=this.dataSourceIG;
                   this.segmentation.criteria[3].dataGrhap={
                     "options":this.options,
                     "salesSeries":this.salesSeries,
                     "chart": false
                   }
                   this.segmentation.criteria[3].dataSource=[]
                   this.segmentation.criteria[3].dataSeg=[]
                   //this.analytics(3)
                   promises.push(this.analytics(3))
                   //this.guardar1()
                   }
               }
               else{
                 //console.log("_____________Nuevo_____________")

               }
            }
            else{
              this.isNew=true
              //console.log("_____________Nuevo 1_____________")

            }
            
          }
        },
        error => {
          //this.error=true
        });
  }
  getPortaolio(id){
  this.Services.getPortafolio(id)
  .subscribe(
      data => {
        if(data.success){
          this.portafolio=data.data;
          (this.indexSegmentation==0)
            this.registerTotal=this.portafolio.register
          //console.log("Portafolio",this.portafolio)
          this.segment.segmentation.forEach(element => {
            //console.log(element.porcent)
            this.value=this.value+element.porcent
            this.bufferValue=this.value
          });
          this.generalIF=[{
            name:"CLIENTE",
            data: this.portafolio.client_id.name
          },
          {
            name:"PORTAFOLIO",
            data: this.portafolio.name_portafolio
          },
          {
            name:"REGISTROS",
            
            data: this.portafolio.register.toString()||"null"
          },
          {
            name:"SEGMENTADO",
            data: this.value.toFixed(1) +" %"
          }]
        }
      },
      error => {
        //this.error=true
      });
  }
  segmentacionData=[]
  segmentacion={}
  getMap(id){
    this.Services.getMap(id)
    .subscribe(
        data => {
          //console.log("getMap ", data)
          if(data.success && data.data){
            this.segmentacion=data.data.segmentation;
            let segmentacion=[]
            data.data.segmentation.forEach(element => {
              if(element.status)
                this.segmentacionData.push(element.data)
            });
           // console.log(this.segmentacionData, this.segmentacion)
           // this.CustomersList=data.data
            
          }
        },
        error => {
          //this.error=true
        });
  }
  changeCriterio(ev,index){
    //console.log(ev.value,index)
    this.segmentation.criteria[index].name= ev.value
    this.analytics(index)
   /* switch (index) {
      case 0:
        this.segmentation.criteria[index].name= ev.value
        this.analytics(index)
      break;
      case 1:
        this.segmentation.criteria[1].name= ev.value
        //this.analizar2()
      break;
      case 2:
        this.segmentation.criteria[2].name= ev.value
        //this.analizar3()
      break;
      case 3:
        this.segmentation.criteria[3].name= ev.value
        //this.analizar4()
      
      break;

      default:
        break;
    }*/
  }
  registerActual=0
  registerTotal=0
  registerAc=0
  analytics(x){
    return new Promise((resolve, reject) => {

      this.segmentation.criteria[x].dataGrhap.chart=false;
      //console.log("------X",x)
      let body={
        "query": {},
        "criterio1": "Riesgo",
      }
      switch (x) {
        case 0:
          let val={}
          let q1= this.getQuery(x);
          console.log(q1)
          //console.log("<<<<<<<<<<<<<<<<<<<<<",JSON.parse(this.segment.segmentation[0].query))
          //console.log("<<<<<<<<<<<<<<<<<<<<<",this.segment.segmentation[0].query)
          //if(this.segment.segmentation[0].query)
          // val=JSON.parse(this.segment.segmentation[0].query)
          let query1= {}
          let query2= {}
          body={
            "query": {},
            "criterio1": this.segmentation.criteria[x].name
          }
          if(this.indexSegmentation == 1){
  
            console.log("version 2",this.segment.segmentation[0].query)
            query1= JSON.parse(this.segment.segmentation[0].query)
            console.log("version 2.1",query1)
            body={
              "query": query1,
              "criterio1": this.segmentation.criteria[x].name
            }
          }
          if(this.indexSegmentation == 2){
  
            console.log("version 3",this.segment.segmentation[1].query)
            query1= JSON.parse(this.segment.segmentation[0].query)
            query2= JSON.parse(this.segment.segmentation[1].query)
            console.log("version 3.1",query1)
            body={
              "query": {
                "$and": [ query1,query2
                ]
            },
              "criterio1": this.segmentation.criteria[x].name
            }
          }
          break;
        case 1:
          let q01 = this.getQuery(0);
          let q02= this.getQuery(x);
          console.log(q01)
          console.log(q02)
          
          body={
            "query": q01,
            "criterio1": this.segmentation.criteria[x].name
          }
          if(this.indexSegmentation == 1){
  
            console.log("version 2",this.segment.segmentation[0].query)
            let query1= JSON.parse(this.segment.segmentation[0].query)
            //let query2= JSON.parse(this.segment.segmentation[1].query)
            console.log("version 2.1",query1)
            body={
              "query": {
                "$and": [ q01,query1
                ]
              },
              "criterio1": this.segmentation.criteria[x].name
            }
          }
          if(this.indexSegmentation == 2){
  
            console.log("version 3",this.segment.segmentation[1].query)
            let query1= JSON.parse(this.segment.segmentation[0].query)
            let query2= JSON.parse(this.segment.segmentation[1].query)
            console.log("version 3.1",query1)
            body={
              "query": {
                "$and": [ q01,query1,query2
                ]
            },
              "criterio1": this.segmentation.criteria[x].name
            }
          }
          break;
          case 2: 
          console.log("CRITERIO 3")
            let q11 = this.getQuery(1);
            let q12= this.getQuery(x);
            let q13= this.getQuery(0);
            console.log(q11)
            console.log(q12)
            
            body={
              "query": {
                  "$and": [ q11,q13
                  ]
                
              },
              "criterio1": this.segmentation.criteria[x].name
            }
            if(this.indexSegmentation == 1){
  
              console.log("version 2",this.segment.segmentation[0].query)
              let query1= JSON.parse(this.segment.segmentation[0].query)
              //let query2= JSON.parse(this.segment.segmentation[1].query)
              console.log("version 2.1",query1)
              body={
                "query": {
                  "$and": [  q11,q13,query1
                  ]
                },
                "criterio1": this.segmentation.criteria[x].name
              }
            }
            if(this.indexSegmentation == 2){
  
              console.log("version 2",this.segment.segmentation[0].query)
              let query1= JSON.parse(this.segment.segmentation[0].query)
              let query2= JSON.parse(this.segment.segmentation[1].query)
              console.log("version 2.1",query1)
              body={
                "query": {
                  "$and": [  q11,q13,query1,query2
                  ]
                },
                "criterio1": this.segmentation.criteria[x].name
              }
            }
          break;
      
        default:
          break;
      }
      console.log("________",body,"________")
      this.Services.getASegment(body,this.segment.portafolio_id)
      .subscribe(
          data => {
            console.log("__getMap__", data)
            if(data.success){
              let dataSeg=data.data
              this.displayedColumnsNew= ['rango', dataSeg.data[0], dataSeg.data[1],dataSeg.data[2], 'sin info'];
              this.segmentation.criteria[x].dataSource = [
               // {date1: dataSeg.porcents[0].toFixed(1), date2: dataSeg.porcents[1].toFixed(1), date3:dataSeg.porcents[2].toFixed(1), date4: dataSeg.porcents[3].toFixed(1)},
                {date1: "%", date2:dataSeg.porcents[0].toFixed(1)+" %", date3:dataSeg.porcents[1].toFixed(1)+" %", date4:dataSeg.porcents[2].toFixed(1)+" %", date5: dataSeg.porcents[3]?dataSeg.porcents[3].toFixed(1)+" %":"0 %"},
                {date1:"REGISTROS", date2: dataSeg.lables[0], date3: dataSeg.lables[1], date4: dataSeg.lables[2],date5: dataSeg.lables[3]},
              ];
                this.options.labels=data.data.labelsGraph
                this.salesSeries[0].data=data.data.dataGraph
                this.registerActual=data.data.register
                console.log("registerActual 1",this.registerActual)
                console.log("registerActual DATA",data.data.labelsGraph)
                this.segmentation.criteria[x].dataSeg[0]={actual:this.registerActual}
                console.log("dataSeg", this.segmentation.criteria[x].dataSeg)
                this.segmentation.criteria[x].dataGrhap={
                  "options":this.options,
                  "salesSeries":this.salesSeries,
                  "chart": true
                }
                if(this.segmentation.criteria[x].rankB || this.segmentation.criteria[x].rankA)
                  this.save(x)
                  resolve(true)
            }
          },
          error => {
            //this.error=true
            reject(false)
          });
    })
  }
  ultimoQuery={}
  save(x){
    console.log("sabe")
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
    //console.log("type",this.segmentation.criteria[x])
    //console.log("type",this.segmentation.criteria)
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
    this.segmentation.criteria[x].query= JSON.stringify(body);
    this.ultimoQuery=body.query
    console.log("-",body,"-")
    this.Services.getASR2(this.segment.portafolio_id,body)
      .subscribe(
          data => {
            console.log("Hola--", data)
            if(data.success){
               //console.log(data.data)
             let info2=data.data;
             console.log("registerActual 2",this.registerActual)
             let actual= this.segmentation.criteria[x].dataSeg[0].actual
             console.log("registerActual 3", actual)
             let register=actual-info2;
             this.AddCriteria=true
             if(register==0 || x==2 ) this.AddCriteria=false
             let porcent2= (info2*100)/this.registerTotal 
             this.segmentation.porcent=porcent2;
             this.segmentation.register=info2
             this.bufferValue=porcent2
             this.value=0;
             this.segment.segmentation.forEach(element => {
              //console.log(element.porcent)
              this.value=this.value+element.porcent
              this.bufferValue=this.value
            });
            this.generalIF[3].data=this.value>100?"100.00 %":this.value.toFixed(1)+"%"
               console.log("........",this.value,actual,register, porcent2,info2)
               console.log("registerActual",actual)
               
               this.segmentation.criteria[x].dataSeg=[{
                "actual": actual,
                "info": info2,
                "porcent":porcent2.toFixed(1),
                "register":register,
              }]
              this.segmentation.criteria[x].dataSeg[0].inf
              console.log("--dataSeg--",this.segmentation.criteria[x].dataSeg)
            }
          },
          error => {
            //this.error=true
          });
  }
  getQuery(x){
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
  newCriteria(){
    let criteria=this.segmentation.criteria||[]
  criteria.push({
      dataInfo:[{}],
      dataGrhap: [],
      dataSeg: [],
      dataSource:  [],
      name: "",
      percentage: 0,
      rankA: "",
      rankB: "",
    })
    this.segmentation.criteria=criteria
    if(!this.segment.segmentation[this.indexSegmentation]){
      console.log("Creamos nuevo")
      this.segment.segmentation.push(this.segmentation)
    }
  }

  edit(){
    console.log("edit")
  }
  return(){
    console.log("return")
    this.router.navigate(['/admin/segmentation']);
  }
  create(){
    console.log("create")
    const seg = this.segmentation; 
    console.log(seg)
    let body1={
      query:{}
    }
    let x=this.segmentation.criteria.length-1
     //console.log("HOLAAAAAAA_________",x)
     console.log("BODY",this.segment.segmentation)
    switch (x) {
      case 0:
        let q1= this.getQueryNot(0);
        console.log(q1)
        body1={
          "query": q1
        }
        console.log(body1)
        break;
        case 1:
          let q01 = this.getQueryNot(0);
          let q02= this.getQueryNot(1);
          console.log(q01)
          console.log(q02)
          
          body1={
            "query": {
                "$and": [ q01,q02]
              
            }
          }
          break;
        case 1:
          let q11 = this.getQueryNot(0);
          let q12= this.getQueryNot(1);
          let q13= this.getQueryNot(2);
          console.log(q11)
          console.log(q12)
          console.log(q13)
          
          body1={
            "query": {
                "$and": [ q11,q12,q13]
              
            }
          }
          break;
      default:
        break;
    }
    //console.log("_________",this.segment.segmentation[this.indexSegmentation])

    let body={
      name:seg.name,
      description:seg.description,
      register:seg.register,
      porcent:seg.porcent,
      query:JSON.stringify(body1.query),
      criteria:this.segmentation.criteria,
      type:""
    }
    this.segment.segmentation[this.indexSegmentation]=body
    //console.log("BODY",this.segment.segmentation)
    
    let body3={
      porcent:this.generalIF[3].data,
      segmentation:this.segment.segmentation
    }
     this.Services.newSegmentation(this.segment._id, body3)
      .subscribe(
          data => {
            if(data.success){
              //console.log(data.data)
              this.router.navigate(['/admin/segmentation']);
              //this.dialogRef.close(seg);
              
            }
          },
          error => {
            //this.error=true
          });

 
  }
  delete(i){
    //console.log(i, this.segmentation.criteria)
    this.segmentation.criteria.splice(i,1)
    this.value=0;
    this.segment.segmentation.forEach(element => {
      //console.log(element.porcent)
      this.value=this.value+element.porcent
      this.bufferValue=this.value
    });
    this.generalIF[3].data=this.value>100?"100.00 %":this.value.toFixed(1)+"%"
  }
  deleteSeg(){
    console.log(this.indexSegmentation)
    this.segment.segmentation.splice(this.indexSegmentation,1)
    let body3={
      porcent:this.generalIF[3].data,
      segmentation:this.segment.segmentation
    }
    this.Services.newSegmentation(this.segment._id, body3)
    .subscribe(
        data => {
          if(data.success){
            //console.log(data.data)
            this.router.navigate(['/admin/segmentation']);
            //this.dialogRef.close(seg);
            
          }
        },
        error => {
          //this.error=true
        });
  }
  getQueryNot(x){
    let q={}
     console.log("***********",x,this.segmentation.criteria[x])
    switch (this.segmentation.criteria[x].type) {
      case 'rank':
        q=	{
          '$or': [
            {
              [this.segmentation.criteria[x].name]: {
                "$lt": parseInt(this.segmentation.criteria[x].rankA)
              }
            },
            {
              [this.segmentation.criteria[x].name]: {
                "$gt": parseInt(this.segmentation.criteria[x].rankB)
              }
            }
          ]
        }
      break;
        case 'higher':
          q={[this.segmentation.criteria[x].name]: {
            "$lte": parseInt(this.segmentation.criteria[x].rankA)
            }
          }
          break;
        case 'less':
          q={[this.segmentation.criteria[x].name]: {
            "$gte": parseInt(this.segmentation.criteria[x].rankA)
            }
          }
          break;
        case 'equal':
          q={[this.segmentation.criteria[x].name]:  { "$nin": [ parseInt(this.segmentation.criteria[x].rankA)]}}
          break;
    
      default:
        break;
      }
     // console.log("QUERY NOT",q)
      return q
  }
}
