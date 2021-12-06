import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, findIndex, timeout } from 'rxjs/operators';
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

import icError from '@iconify/icons-ic/error';
import { query } from '@angular/animations';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

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
  icError=icError
  icAdd=icAdd;
  icDelete=icDelete;
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
  rest_assigned = false;

  displayedColumnsA1: string[] = ['RESUMEN DE PORTAFOLIO', '-'];
  displayedColumnsA2: string[] = ['Cliente', 'Portafolio','Registros','Segmentación','segmentado', 'no_sgmentado', 'porcentaje'];
  displayedColumnsB1: string[] = ['RESUMEN DE SEGMENTACIÓN', '-', '-'];
  displayedColumnsC1: string[] = ['SEGMENTO', 'REGISTROS', '%'];
  generalIF=[{
    name:"",
    data:""
  }];

  registros=""

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 0;
  viewOptions= false
  add_rest = false
  bufferValue = 10; 
  segmentation_id = this.route.snapshot.params.id;
  indexSegmentation = parseInt(this.route.snapshot.params.index);
  segmentation={
    name:"",
    description:"",
    type:"rank",
    criteria:[],
    register:0,
    porcent:0,
    query:"",
    add_rest:false
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
    query_rest:"",
    portafolio_id:"",
    query_rest_assigned:false,
    segmentation:[{
      name:"",
      description:"",
      type:"rank",
      criteria:[],
      register:0,
      porcent:0,
      query:"",
      add_rest:false
    },{
      name:"",
      description:"",
      type:"rank",
      criteria:[],
      register:0,
      porcent:0,
      query:"",
      add_rest:false
    },{
      name:"",
      description:"",
      type:"rank",
      criteria:[],
      register:0,
      porcent:0,
      query:"",
      add_rest:false
    }]
  }
  AddCriteria=true
  spinner=false
  dataSourceIG=[]
  filter=""
  portafolio={
    client_id:{name:""},
    name_portafolio:"",
    _id:"",
    register:0
  }
  ngOnInit() {
    console.log(this.indexSegmentation, this.segmentation_id)
    this.getSegmentation()
    setTimeout(() => {
      
      //this.createInit()
      //this.getSegmentation()
      //this.AnaliticsAllSegment()
    }, 1000);
    
    
  }
  infoList=[]
  rangeA=0
  rangeB=0
  getSegInfo(id) {
    console.log("getSegInfo")
    this.alert2= false
    this.Services.getSegInfo(id)
    .subscribe(
        data => {
          if(data.success){
            console.log("PPPP",data.data)
            this.infoList=[]
            data.data.forEach(element => {
              if(element.datos.length)
              console.log(!element.datos[0].B,element.datos[0])
                if(!element.datos[0].B){
                  element.filter = "equal"
                }
               this.infoList.push(element)
            });
          }
        },
        error => {
          console.log("------------>",error)
          this.alert2= true
        });
  }
  
  onSearch(ev,i){
    console.log(ev,i)
    if(ev.code == "Enter")
      this.save(i)
  }
  onSearch1(ev, name, count, filter, info){
    console.log(ev)
    if(ev.code == "Enter")
      //this.save(i)
      this.newCriteriaActual(name,info.rangeA,info.rangeB,count, filter)
  }
  validCriterio(name){
    let active = false
    //this.segment.segmentation.forEach(element => {
      //console.log(this.segment.segmentation[this.indexSegmentation])
      //if()
      const index = this.segment.segmentation[this.indexSegmentation].criteria.findIndex((crit) => {
        return crit.name === name});
      if(index!=-1) active = true
      
    //});
    return active
  }

  generalP=[]
  isEdit=false
  isNew=false
  SEGMENTOPORTAFOLIO={
    segmentation:{}
  }
  getSegmentation(){
    this.Services.getSegmentation(this.segmentation_id)
    .subscribe(
        data => {
          if(data.success){
            this.segment=data.data;
            console.log("$$$$$$$$$$$$$$$$$$$$$$$",data.data.segmentation.length, 3-data.data.segmentation.length)
            //Nuevo
            let limit = 0
            if (data.data.segmentation.length == 0) {
              limit = 3
            }
            if (data.data.segmentation.length == 1) {
              limit = 2
            }
            if (data.data.segmentation.length == 2) {
              limit = 1
            }
            for (let index = 0; index < limit; index++) {
              this.segment.segmentation.push({
                    name:"",
                    description:"",
                    type:"rank",
                    criteria:[],
                    register:0,
                    porcent:0,
                    query:"",
                    add_rest:false
                  })
              
            }
            //Bloqueo
            // if (this.segment.segmentation.length < 1)  {
            //   this.segment.segmentation.push({
            //     name:"",
            //     description:"",
            //     type:"rank",
            //     criteria:[],
            //     register:0,
            //     porcent:0,
            //     query:"",
            //     add_rest:false
            //   })
            // }
            // if (this.segment.segmentation.length < 2)  {
            //   this.segment.segmentation.push({
            //     name:"",
            //     description:"",
            //     type:"rank",
            //     criteria:[],
            //     register:0,
            //     porcent:0,
            //     query:"",
            //     add_rest:false
            //   })
            // }
            // if (this.segment.segmentation.length < 3)  {
            //   this.segment.segmentation.push({
            //     name:"",
            //     description:"",
            //     type:"rank",
            //     criteria:[],
            //     register:0,
            //     porcent:0,
            //     query:"",
            //     add_rest:false
            //   })
            // }
            this.getPortaolio(this.segment.portafolio_id)
            this.getMap(this.segment.portafolio_id)
            let query_rest = this.get_query_rest()
            //console.log("Segmento",this.segment)
            this.SEGMENTOPORTAFOLIO = data.data.segmentation
            console.log("Segmentacion1",data.data.segmentation, this.indexSegmentation)
            //console.log("Segmentacion1",data.data.segmentation.length!=0,data.data.segmentation[this.indexSegmentation],this.segmentation1)
            this.segmentation=data.data.segmentation[this.indexSegmentation]?data.data.segmentation[this.indexSegmentation]:this.segmentation1
             console.log("Segmentacion",this.segmentation)
             console.log("Segmentacion1",data.data.segmentation)
             console.log("Segmentacion 2",this.segment)

            if(this.segment.segmentation.length){

              if(this.segment.segmentation[this.indexSegmentation].query){
                this.segment.segmentation[this.indexSegmentation].criteria.forEach((criteria,x) => {
                  console.log("***********", criteria.percentage)
                  
                  this.segmentation.criteria[x].dataSeg=[{
                    "actual": criteria.register,
                    "info": criteria.segments,
                    "porcent":criteria.percentage.toFixed(1),
                    "register":criteria.nos_egments,
                  }]
                  let query = JSON.parse(criteria.query)
                  this.get_infoList(query)
                })
              }
            }
             if(data.data.query_rest_assigned){
              this.segmentation_query_rest = this.segmentation
             }
            if(data.data.segmentation.length){
              console.log("_____________No_____________")
              this.isEdit=true
               if(this.segmentation.criteria.length){
                let promises=[]
                this.viewOptions= true
                console.log(this.infoList.length,  this.viewOptions)
                //Bloqueo
                //  if(this.segmentation.criteria[0]){
                //   this.viewOptions= false
                //    console.log("<<<<<<<<<<<<<<<<<<<<<",this.segmentation.query)
                //    this.segmentation.criteria[0].dataSource=[]
                //    this.segmentation.criteria[0].dataSeg=[]
                //    //this.analytics(0)
                //    //promises.push(this.analytics1(0))
                //     this.analytics1(0)
                //     .then(result => {
                //           console.log("analytics1", result)
                //           this.save(0)
                //           .then(result => {
                //             console.log("save", result)
                //             //#################################################
                //             if(this.segmentation.criteria[1]){
                //               console.log("<<<<<<<<<<<<<<<<<<<<<",this.segmentation.query)
                //               this.segmentation.criteria[1].dataSource=[]
                //               this.segmentation.criteria[1].dataSeg=[]
                //               //this.analytics(0)
                //               //promises.push(this.analytics1(0))
                //                this.analytics1(1)
                //                .then(result => {
                //                      console.log("analytics1", result)
                //                      this.save(1)
                //                      .then(result => {
                //                        console.log("save", result)
                //                        //#################################################
                //                        if(this.segmentation.criteria[2]){
                //                         console.log("<<<<<<<<<<<<<<<<<<<<<",this.segmentation.query)
                //                         this.segmentation.criteria[2].dataSource=[]
                //                         this.segmentation.criteria[2].dataSeg=[]
                //                         //this.analytics(0)
                //                         //promises.push(this.analytics1(0))
                //                          this.analytics1(2)
                //                          .then(result => {
                //                                console.log("analytics1", result)
                //                                this.save(2)
                //                                .then(result => {
                //                                  console.log("save", result)
                //                                  this.viewOptions= true
                //                                })
                //                                .catch(err =>{
                //                                  console.log(err)
                //                                });
                //                            })
                //                            .catch(err =>{
                //                              console.log(err)
                //                            });
                //                          }
                //                          else
                //                          this.viewOptions= true
                //                      })
                //                      .catch(err =>{
                //                        console.log(err)
                //                      });
                //                  })
                //                  .catch(err =>{
                //                    console.log(err)
                //                  });
                //             }
                //             else
                //               this.viewOptions= true
                            
                //           })
                //           .catch(err =>{
                //             console.log(err)
                //           });
                //       })
                //       .catch(err =>{
                //         console.log(err)
                //       });
                //     }
              
               
               }
               else{
                 console.log("QUERY REAL",query_rest)
                this.getNewCriteria(query_rest)
                // if (this.indexSegmentation==0 ) {
                //   this.getSegInfo(this.segment.portafolio_id)
                //   this.viewOptions= true 
                // }
                //Comentado 1
                //  if(this.indexSegmentation-1>=0){

                //    console.log("<<<<<<<<<<<<<<<<<<<<<",this.segment.segmentation,this.indexSegmentation-1, this.segment.segmentation[this.indexSegmentation-1].query)
                //    //this.getNewCriteria(this.segment.segmentation[this.indexSegmentation-1].query)
                //    this.getNewCriteria(query_rest)
                //  }
                //  else{
                //   if (this.indexSegmentation==0 ) {
                //     this.getSegInfo(this.segment.portafolio_id)
                //     this.viewOptions= true 
                //   }
                //  }
               }
               console.log("CREATE________________")
               
               
            }
            else{
              if(data.data.segmentation[0].register>1){
                console.log("_____________EXITE SEGMENTACION 1_____________")
              }
              else{
                this.isNew=true
                console.log("_____________La segmentacion de este portafolio es nueva_____________")
                if (this.indexSegmentation==0 ) {
                  this.getSegInfo(this.segment.portafolio_id)
                }
              }
              if(data.data.segmentation[1].register>1){
                console.log("_____________EXITE SEGMENTACION 1_____________")
              }
              if(data.data.segmentation[2].register>1){
                console.log("_____________EXITE SEGMENTACION 1_____________")
              }

              
           

            }
               
            
          }
        },
        error => {
          //this.error=true
        });
  }
  
  getSegmentationDelete(){
    this.getPortaolio(this.segment.portafolio_id)
            this.getMap(this.segment.portafolio_id)
            this.get_query_rest()
            console.log("Segmentacion",this.segmentation)
             console.log("Segmentacion1",this.segment.segmentation)
             console.log("Segmentacion 2",this.segment)
            if(this.segment.segmentation.length){
              console.log("_____________No_____________")
              
              this.isEdit=true
               if(this.segmentation.criteria.length){
                let promises=[]
                 if(this.segmentation.criteria[0]){
                  this.viewOptions= false
                   console.log("<<<<<<<<<<<<<<<<<<<<<",this.segmentation.query)
                   this.segmentation.criteria[0].dataSource=[]
                   this.segmentation.criteria[0].dataSeg=[]
                   //this.analytics(0)
                   //promises.push(this.analytics1(0))
                    this.analytics1(0)
                    .then(result => {
                          console.log("analytics1", result)
                          this.save(0)
                          .then(result => {
                            console.log("save", result)
                            //#################################################
                            if(this.segmentation.criteria[1]){
                              console.log("<<<<<<<<<<<<<<<<<<<<<",this.segmentation.query)
                              this.segmentation.criteria[1].dataSource=[]
                              this.segmentation.criteria[1].dataSeg=[]
                              //this.analytics(0)
                              //promises.push(this.analytics1(0))
                               this.analytics1(1)
                               .then(result => {
                                     console.log("analytics1", result)
                                     this.save(1)
                                     .then(result => {
                                       console.log("save", result)
                                       //#################################################
                                       if(this.segmentation.criteria[2]){
                                        console.log("<<<<<<<<<<<<<<<<<<<<<",this.segmentation.query)
                                        this.segmentation.criteria[2].dataSource=[]
                                        this.segmentation.criteria[2].dataSeg=[]
                                        //this.analytics(0)
                                        //promises.push(this.analytics1(0))
                                         this.analytics1(2)
                                         .then(result => {
                                               console.log("analytics1", result)
                                               this.save(2)
                                               .then(result => {
                                                 console.log("save", result)
                                                 this.viewOptions= true
                                               })
                                               .catch(err =>{
                                                 console.log(err)
                                               });
                                           })
                                           .catch(err =>{
                                             console.log(err)
                                           });
                                         }
                                         else
                                         this.viewOptions= true
                                     })
                                     .catch(err =>{
                                       console.log(err)
                                     });
                                 })
                                 .catch(err =>{
                                   console.log(err)
                                 });
                            }
                            else
                              this.viewOptions= true
                            
                          })
                          .catch(err =>{
                            console.log(err)
                          });
                      })
                      .catch(err =>{
                        console.log(err)
                      });
                    }
              
                  
               }
               else{
                console.log("_____________SI_____________")
                 if(this.segment.segmentation,this.indexSegmentation-1>=0){

                   console.log("DELETE",this.segment.segmentation,this.indexSegmentation-1, this.segment.segmentation[this.indexSegmentation-1].query)
                   this.getNewCriteria(this.segment.segmentation[this.indexSegmentation-1].query)
                 }
                 else{
                  if (this.indexSegmentation==0 ) {
                    this.getSegInfo(this.segment.portafolio_id)
                    this.viewOptions= true 
                  }
                  this.calcularTotal()
                 }
               }
               
            }
            
  }
  getPortaolio(id){
  this.Services.getPortafolio(id)
  .subscribe(
      data => {
        if(data.success){
          this.portafolio=data.data;
          (this.indexSegmentation==0)
            this.registerTotal=this.portafolio.register
          console.log("Portafolio",this.portafolio)
          let reg = 0
          this.segment.segmentation.forEach((item, x) => {
            console.log("Portafolio",this.segment.segmentation[x])
            console.log("--->>>--",this.segment.segmentation[x].name,this.segment.segmentation[x].register,this.segment.segmentation[x].porcent)
            console.log("--->>>",item)
            console.log("--->>>--",item.name,item.register,item.porcent)
            reg = reg + item.register
            console.log("---",reg)
            this.value=this.value+item.porcent
            this.bufferValue=this.value
          });
          console.log("--------------->",this.segment.segmentation)
          console.log("--- REG",reg)
          var  value = (100 / this.portafolio.register) * reg 
          this.generalP=[{
            cliente: this.portafolio.client_id.name,
            portafolio: this.portafolio.name_portafolio,
            segmentadocant:reg,
            registros: this.portafolio.register.toString()||"null",
            nosegmentadocant:this.portafolio.register - reg,
            nosegmentado:(100 - value).toFixed(1),
            segmentado: value.toFixed(1)
          }]
          console.log("generalP 1",this.generalP[0])
          this.registros = this.value.toFixed(1) +" %"
          console.log("REGISTROS",this.registros)
         
          
        }
      },
      error => {
        //this.error=true
      });
  }
  segmentacionData=[]
  segmentacion={}
  getMap(id){
    this.alert2= false
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
          console.log("------------>",error)
          //this.alert2= true
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
      console.log("SEGTES")
      //this.segmentation.criteria[x].dataGrhap.chart=false;
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
            if(data.success){
              let dataSeg=data.data
              console.log("**dataSeg**",dataSeg)
             /* this.displayedColumnsNew= ['rango', dataSeg.data[0], dataSeg.data[1],dataSeg.data[2], 'sin info'];
              this.segmentation.criteria[x].dataSource = [
               // {date1: dataSeg.porcents[0].toFixed(1), date2: dataSeg.porcents[1].toFixed(1), date3:dataSeg.porcents[2].toFixed(1), date4: dataSeg.porcents[3].toFixed(1)},
                {date1: "%", date2:dataSeg.porcents[0].toFixed(1)+" %", date3:dataSeg.porcents[1].toFixed(1)+" %", date4:dataSeg.porcents[2].toFixed(1)+" %", date5: dataSeg.porcents[3]?dataSeg.porcents[3].toFixed(1)+" %":"0 %"},
                {date1:"REGISTROS", date2: dataSeg.lables[0], date3: dataSeg.lables[1], date4: dataSeg.lables[2],date5: dataSeg.lables[3]},
              ];*/
               /* this.options.labels=data.data.labelsGraph
                this.salesSeries[0].data=data.data.dataGraph*/
                this.registerActual=data.data.register
                console.log("registerActual 1",this.registerActual)
               // console.log("registerActual DATA",data.data.labelsGraph)
                this.segmentation.criteria[x].dataSeg[0]={actual:this.registerActual}
                //console.log("dataSeg", this.segmentation.criteria[x].dataSeg)
                /*this.segmentation.criteria[x].dataGrhap={
                  "options":this.options,
                  "salesSeries":this.salesSeries,
                  "chart": true
                }*/
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
  analytics1(x){
    return new Promise((resolve, reject) => {
      console.log("SEGTES", x)
      //this.segmentation.criteria[x].dataGrhap.chart=false;
      //console.log("------X",x)
      let body={
        "query": {},
        "criterio1": "Riesgo",
      }
      let query1= {}
      let query2= {}
 
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
  
            //console.log("version 2",this.segment.segmentation[0].query)
            query1= JSON.parse(this.segment.segmentation[0].query)
            //console.log("version 2.1",query1)
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
      
      
      
      console.log("BODY________",body,"________")
      console.log("getASR2- 4")
      this.Services.getASR2(this.segment.portafolio_id,body)
      .subscribe(
          data => {
            console.log("______________________________________________________________")
            console.log("Hola---------------------",x, data)
            if(data.success){
              console.log(data.data)
             //this.infoList=data.data
             data.data.forEach(element => {
               console.log(element)
               if(element.datos.length)
                this.infoList.push(element)
             });
             console.log("***dataSeg***",data.data, this.infoList)
             this.registerActual=data.data[0].register
                console.log("registerActual 1",this.registerActual)
               // console.log("registerActual DATA",data.data.labelsGraph)
                this.segmentation.criteria[x].dataSeg[0]={actual:this.registerActual}
             if(this.segmentation.criteria[x].rankB || this.segmentation.criteria[x].rankA){
             resolve(true)
               
             }
            }
          },
          error => {
            //this.error=true
          });
    })
  }
  alert2= false
  get_query_rest(){

    console.log("########SEGMENTACION###########",this.segment.segmentation)
    let params = []
    let query = {}
    
    this.segment.segmentation.forEach(element => {
      if(element.query){
        console.log("***",JSON.parse(element.query))
        params.push(JSON.parse(element.query))
      }
      
    });
    console.log("############PL#############",params.length)
    switch (params.length) {
      case 0:
        query = {}
      break;
      case 1:
        query =  params[0]
      break;
      case 2:
          query =  {
            "$and":params
          }
      break;
      case 3:
          query =  {
            "$and":params
          }
      break;
    
      default:
        break;
    }
    
  
    //{"$and":[{"$or":[{"dias_no_pago":{"$lt":20}},{"dias_no_pago":{"$gt":96}}]},{"$or":[{"interes":{"$lt":394}},{"interes":{"$gt":720}}]}]}
    //{"$and":[{"$or":[{"dias_no_pago":{"$lt":20}},{"dias_no_pago":{"$gt":96}}]},{"$or":[{"interes":{"$lt":394}},{"interes":{"$gt":720}}]}]}

    //{"$and":[{"$or":[{"dias_no_pago":{"$lt":20}},{"dias_no_pago":{"$gt":96}}]},{"$or":[{"interes":{"$lt":394}},{"interes":{"$gt":720}}]}]}
    console.log(query)
      console.log("QUERY REST",JSON.stringify(query))
     return JSON.stringify(query)
  }
  ultimoQuery={}
  goto(x){
    console.log(this.segmentation_id+"/"+x)
    this.router.navigate(['/admin/segmentationSingle/'+this.segmentation_id+"/"+x]);
    setTimeout(() => {
      location.reload();
    }, 100);

  }
  get_infoList(body) {
    
    this.Services.getASR2(this.segment.portafolio_id,body)
        .subscribe( 
        data => {
          this.infoList=[]
          data.data.forEach(element => {
            console.log(element)
            if(element.datos.length)
             this.infoList.push(element)
          });
        },
        error => {
          //this.error=true
        });

        
  }
  save(x){
    
    return new Promise((resolve, reject) => {
    
      console.log("sabe",x)
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
      console.log("BODY-",body,"-",body.toString())
      console.log("getASR2- 1")
      this.Services.getASR2(this.segment.portafolio_id,body)
        .subscribe(
            data => {
              console.log("Hola__________",x, data)
              if(data.success){
                let info2=data.data[0].register;
                this.infoList=[]
                data.data.forEach(element => {
                  console.log(element)
                  if(element.datos.length)
                   this.infoList.push(element)
                });
                console.log("registerActual 2",this.registerActual, this.segmentation.criteria[x])
                let actual= this.segmentation.criteria[x].dataSeg[0].actual || 0
                console.log("registerActual 3", actual)
                let reg = 0
                // this.segment.segmentation.forEach(element => {
                //   console.log("---",element)
                //   console.log("---",element.register)
                //   reg = reg + element.register
                //   this.value=this.value+element.porcent
                //   this.bufferValue=this.value
                // });
                // console.log("++++",this.portafolio.register, reg )
                // var  value = (100 / this.portafolio.register) * reg 
                
                // this.generalP=[{
                // cliente: this.portafolio.client_id.name,
                // portafolio: this.portafolio.name_portafolio,
                // segmentadocant:reg,
                // registros: this.portafolio.register.toString()||"null",
                // nosegmentadocant:this.portafolio.register - reg,
                // nosegmentado:(100 - value).toFixed(1),
                // segmentado: value.toFixed(1)
                // }]
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
                //this.portafolio.register=this.value>100?"100.00 %":this.value.toFixed(1)+"%"
                this.registros=this.value>100?"100.00 %":this.value.toFixed(1)+"%"
                 console.log("........",this.value,actual,register, porcent2,info2)
                 console.log("registerActual",actual)
                 
                 this.segmentation.criteria[x].dataSeg=[{
                  "actual": actual,
                  "info": info2,
                  "porcent":porcent2.toFixed(1),
                  "register":actual - info2,
                }]
                this.segmentation.criteria[x].dataSeg[0].inf
                console.log("--dataSeg--",this.segmentation.criteria[x].dataSeg)
                resolve(true)
              }
            },
            error => {
              reject(false)
              //this.error=true
            });
    });
  }
  calcularTotal(){
    console.log("CALCULATE TOTAL")
    let reg=0
     this.segment.segmentation.forEach(element => {
        console.log("---",element)
        console.log("---",element.register)
        reg = reg + element.register
        this.value=this.value+element.porcent
        this.bufferValue=this.value
      });
      console.log("++++",this.portafolio.register, reg, this.value )
      var  value = (100 / this.portafolio.register) * reg 
      console.log("++++",value )

      this.registros=this.value>100?"100.00 %":this.value.toFixed(1)+"%"
      this.generalP=[{
      cliente: this.portafolio.client_id.name,
      portafolio: this.portafolio.name_portafolio,
      segmentadocant:reg,
      registros: this.portafolio.register.toString()||"null",
      nosegmentadocant:this.portafolio.register - reg,
      nosegmentado:(100 - value).toFixed(1),
      segmentado: value.toFixed(1)
      }]
      console.log("generalP 2",this.generalP[0])
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
  getNewCriteria(query){
    return new Promise((resolve, reject) => {
      let body={
        query: JSON.parse(query)
      }
      console.log("BODY########",body)
      console.log("getASR2- 2")
      this.Services.getASR2(this.segment.portafolio_id,body)
      .subscribe(
          data => {
            console.log("Hola__________!!!!!", data)
            if(data.success){
              let info2=data.data[0].register;
              this.viewOptions = true;
              this.infoList=data.data
              console.log("registerActual 2",this.registerActual, this.infoList, this.segmentation_query_rest)
              resolve(true)
            }
          },
          error => {
            reject(false)
            //this.error=true
          });
    })
  }
  getQuery(x){
    let q={}
    let value= null
    console.log("******",this.segmentation.criteria[x])
    //switch (this.segmentation.criteria[x].type) {
      switch (this.segmentation.criteria[x].type) {
      case 'rank':
          value = this.validIsNumber(this.segmentation.criteria[x].rankA)
          console.log("*************",value)
          if(this.segmentation.criteria[x].rankA && this.segmentation.criteria[x].rankB){

            if(typeof value === 'string' || !value){
              q={[this.segmentation.criteria[x].name]: {
                "$gte": this.segmentation.criteria[x].rankA,
                "$lte": this.segmentation.criteria[x].rankB
                }}
            }else{
              //q={[this.segmentation.criteria[x].name]: parseInt(this.segmentation.criteria[x].rankA) }
              q={[this.segmentation.criteria[x].name]: {
                "$gte": parseInt(this.segmentation.criteria[x].rankA),
                "$lte": parseInt(this.segmentation.criteria[x].rankB)
                }}
            }
          }else{
            value = this.validIsNumber(this.segmentation.criteria[x].rankA)
            console.log("*************",value)
            if(typeof value === 'string' || !value){
              q={[this.segmentation.criteria[x].name]: this.segmentation.criteria[x].rankA}
            }else{
              q={[this.segmentation.criteria[x].name]: parseInt(this.segmentation.criteria[x].rankA) }
            }
          }
        
        break;
        case 'higher':
          
          value = this.validIsNumber(this.segmentation.criteria[x].rankA)
          console.log("*************",value)
          if(typeof value === 'string' || !value){
            q={[this.segmentation.criteria[x].name]: this.segmentation.criteria[x].rankA}
          }else{
            q={[this.segmentation.criteria[x].name]: {"$gte": parseInt(this.segmentation.criteria[x].rankA) }}
          }
          break;
        case 'less':
          value = this.validIsNumber(this.segmentation.criteria[x].rankA)
          console.log("*************",value)
          if(typeof value === 'string' || !value){
            q={[this.segmentation.criteria[x].name]: this.segmentation.criteria[x].rankA}
          }else{
            q={[this.segmentation.criteria[x].name]: { "$lte":parseInt(this.segmentation.criteria[x].rankA)} }
          }
          break;
        case 'equal':
         
          value = this.validIsNumber(this.segmentation.criteria[x].rankA)
          console.log("*************",value)
          if(typeof value === 'string' || !value){
            q={[this.segmentation.criteria[x].name]: this.segmentation.criteria[x].rankA}
          }else{
            q={[this.segmentation.criteria[x].name]: parseInt(this.segmentation.criteria[x].rankA) }
          }
          break;
    
        case 'exists':
          q={[this.segmentation.criteria[x].name]: {"$exists": true}}
          break;
      
      default:
        break;
      }
      console.log("QUERY",q)
      return q
  }
  validIsNumber(dato){
    //let  regex = /^[0-9]*$/;
    
    //let  regex = /[+-]?([0-9]*[.])?[0-9]+/
    let  regex = /^[0-9]+([.][0-9]+)?$/
    let value = null
    let onlyNumbers = regex.test(dato);
    console.log("DATO", dato, onlyNumbers)
    if(onlyNumbers){
      let datoo =  dato.toString()
      console.log("validDate",datoo.includes('.000Z',' ', 'a'))
       // devuelve false
      if (datoo.includes('.000Z')||datoo.includes(' ') || datoo.includes('a')) {
        value = dato
      }else
      value = parseInt(dato)
    }else{

      value = dato
    }
    console.log("*************",value)
    return value
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
  newCriteriaActual(name,A,B,count,filter){
    console.log("AAAAAA",name,A,B,count,filter)
    let criteria=this.segmentation.criteria||[]
    const index = this.segmentation.criteria.findIndex((crit) => crit.name === name);
    if(index ==-1)
      criteria.push({
        dataInfo:[{}],
        dataGrhap: [],
        dataSeg: [],
        dataSource:  [],
        name: name,
        percentage: 0,
        rankA: A,
        rankB: B,
        type: filter
      })
    else{
      criteria[index].rankA=A
      criteria[index].rankB=B
      criteria[index].filter=filter
      
    }
    this.segmentation.criteria=criteria
    if(!this.segment.segmentation[this.indexSegmentation]){
      console.log("Creamos nuevo")
      this.segment.segmentation.push(this.segmentation)
    }
    this.segmentation.criteria[criteria.length - 1].dataSeg[0]={actual:count||0}
    this.save(criteria.length - 1)
  }

  edit(){
    console.log("edit")
  }
  return(){
    console.log("return")
    this.router.navigate(['/admin/segmentation']);
  }
 
  delete(i){
    console.log(i, this.segment)

      this.segmentation.criteria.splice(i,1)
      this.value=0;
      // this.segment.segmentation.forEach(element => {
      //   //console.log(element.porcent)
      //   this.value=this.value+element.porcent
      //   this.bufferValue=this.value
      // });
      // this.registros=this.value>100?"100.00 %":this.value.toFixed(1)+"%"
      this.calcularTotal()
      this.getSegmentationDelete()
    //Volver a cargar 
  }
  deleteSeg(){
    console.log(this.indexSegmentation)
    console.log(this.segment.segmentation)
    this.value = 0
    let delete_segment = []
    this.segment.segmentation.forEach(element => {
      if (element.name) {
        delete_segment.push(element)
      }
    });
    delete_segment.splice(this.indexSegmentation,1)
    console.log(delete_segment)
    delete_segment.forEach(element => {
      console.log("**********",element.porcent)
      this.value=this.value+element.porcent
      this.bufferValue=this.value
    });
    this.registros=this.value>100?"100.00 %":this.value.toFixed(1)+"%"
    //this.segment.segmentation.splice(this.indexSegmentation,1)
    //console.log(this.segment.segmentation)
    let body3={
      porcent:this.registros,
      segmentation:delete_segment//this.segment.segmentation
    }
    console.log("ELIMINAR SEGMENTO",body3)
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
     let value= null
     console.log("***********",this.segmentation.criteria[x].type, "***********")
   // switch (this.segmentation.criteria[x].type) {
    switch (this.segmentation.criteria[x].type) {
      case 'rank':
        value = this.validIsNumber(this.segmentation.criteria[x].rankA)
          console.log("*************",value)
          if(typeof value === 'string' || !value){
            q=	{
              '$or': [
                {
                  [this.segmentation.criteria[x].name]: {
                    "$lt": this.segmentation.criteria[x].rankA
                  }
                },
                {
                  [this.segmentation.criteria[x].name]: {
                    "$gt": this.segmentation.criteria[x].rankB
                  }
                }
              ]
            }
          }
          else{

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
          value = this.validIsNumber(this.segmentation.criteria[x].rankA)
          console.log("*************",value)
          if(typeof value === 'string' || !value){
            q={[this.segmentation.criteria[x].name]:  { "$nin": [this.segmentation.criteria[x].rankA]}}

          }else{
            //q={[this.segmentation.criteria[x].name]: parseInt(this.segmentation.criteria[x].rankA) }
            q={[this.segmentation.criteria[x].name]:  { "$nin": [ parseInt(this.segmentation.criteria[x].rankA)]}}
          }
          break;
          case 'exists':
            q={[this.segmentation.criteria[x].name]: {"$exists": false}}
            break;
      default:
        break;
      }
     console.log("QUERY NOT",q)
      return q
  }
  AnaliticsAllSegment(){
    console.log("ANALISIS ",this.segment.segmentation)
    this.segment.segmentation.forEach(element => {
      console.log(element.criteria.length)
      let length1=element.criteria.length-1
      console.log(length1)
      if(length1>=0){

        console.log(element.criteria[length1].query)
        let query1= JSON.parse(element.criteria[length1].query)
        console.log(query1.query)
        let query2=JSON.stringify(query1.query)
        console.log(query2)
        let body ={
          query:query1.query
        }
        console.log(body)
        this.Services.Analysis(this.segment.portafolio_id, body)
        .subscribe(
            data => {
              if(data.success){
                console.log("DATOS ANALISADOS",data.data)
                console.log("Hola", element)
                console.log("Hola", this.portafolio.register)
               let porcent = (100/this.portafolio.register)*data.data.result
               console.log("Hola", porcent)
               element.porcent=porcent
               element.register=data.data.result
                
              }
            },
            error => {
              //this.error=true
            });
      }
      
    });
    this.value=0;
    this.segment.segmentation.forEach(element => {
      //console.log(element.porcent)
      this.value=this.value+element.porcent
      this.bufferValue=this.value
    });
    this.registros=this.value>100?"100.00 %":this.value.toFixed(1)+"%"
    //this.getSegmentationDelete()
  }
  segmentation_query_rest=null
  query_rest_assignedChange(e){
    
    this.segmentation.add_rest = e
    this.getNewCriteria(this.get_query_rest())
    .then(result =>{
      if(e){

        let actualRegisters = this.infoList[0].register
        console.log("TRUE",actualRegisters)
        if(this.segmentation.criteria.length){
          console.log("criteria",actualRegisters)
          this.segmentation.query = this.get_query_rest()
          this.segmentation.register =  this.segmentation.register + actualRegisters
          
    
          console.log("================*",this.portafolio.register, (100 /this.portafolio.register  ), ( 100 /this.portafolio.register ) * this.segmentation.register)
          this.segmentation.porcent = ( 100 / this.portafolio.register ) * this.segmentation.register
          console.log("================*",this.portafolio.register)
        }else{
          console.log("NO criteria",actualRegisters)
          this.segmentation.query =  this.get_query_rest()
          this.segmentation.register = actualRegisters
          console.log("================*",actualRegisters)
    
          console.log("================*",this.portafolio.register, (100 /this.portafolio.register  ), ( 100 /this.portafolio.register )* actualRegisters)
          this.segmentation.porcent = ( 100 / this.portafolio.register ) * actualRegisters
          console.log("================*",this.portafolio.register)
        }
    
        this.segment.query_rest_assigned = e
        this.segmentation_query_rest = this.segmentation
        console.log("================",this.segmentation_query_rest)
        this.calcularTotal()
      }else{

        //this.getPortaolio(this.segment.portafolio_id)
        //this.getSegmentationDelete()
        //this.deleteSeg()
        let actualRegisters =  this.portafolio.register - this.infoList[0].register
        if(this.segmentation.criteria.length){
          console.log("criteria FALSE",actualRegisters)
          this.segmentation.query = this.get_query_rest()
          this.segmentation.register =  this.segmentation.register - this.infoList[0].register
          
    
          console.log("================*",this.portafolio.register, (100 / this.portafolio.register  ), ( 100 /this.portafolio.register ) * this.segmentation.register)
          this.segmentation.porcent = ( 100 / this.portafolio.register ) *  this.segmentation.register
          console.log("================*",this.portafolio.register)
        }else{
          this.segmentation.query =  this.get_query_rest()
          console.log("criteria FALSE",actualRegisters)
          this.segmentation.register = this.segmentation.register - actualRegisters
          console.log("================*",actualRegisters)
    
          console.log("================*",this.portafolio.register, (100 /this.portafolio.register  ), ( 100 /this.portafolio.register )* this.segmentation.register)
          this.segmentation.porcent = ( 100 / this.portafolio.register ) * this.segmentation.register
          console.log("================*",this.portafolio.register)
        }
    
        this.segment.query_rest_assigned = e
        this.segmentation_query_rest = this.segmentation
        console.log("================",this.segmentation_query_rest)
        this.calcularTotal()
      }
    })
    console.log("================",this.segmentation_query_rest)
  }
  getRest(){
  
     
    // console.log("BODY________",this.get_query_rest(),"________")
    // let query = this.get_query_rest()
    // console.log("getASR2- 3")
    // this.Services.getASR2(this.segment.portafolio_id,JSON.parse(query))
    // .subscribe(
    //     data => {
    //       console.log("______________________________________________________________")
    //       console.log("Hola---------------------", data)
    //       if(data.success){
    //         console.log(data.data)
    //        //this.infoList=data.data
    //        data.data.forEach(element => {
    //          console.log(element)
    //          if(element.datos.length)
    //           this.infoList.push(element)
    //        });
    //        console.log("***dataSeg***",data.data, this.infoList)
    //        this.registerActual=data.data[0].register
    //           console.log("registerActual 1",this.registerActual)
    //          // console.log("registerActual DATA",data.data.labelsGraph)
    //           //this.segmentation.criteria[x].dataSeg[0]={actual:this.registerActual}
           
    //       }
    //     },
    //     error => {
    //       //this.error=true
    //     });
  }
  create(){
    const seg = this.segment.query_rest_assigned ? this.segmentation_query_rest : this.segmentation; 
    let new1 =[]
    console.log("¿¿¿",seg)
    let body1={
      query:{}
    }
    let x=this.segmentation.criteria.length-1
    
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
                "$or": [ q01,q02]
              
            }
          }
          break;
        case 2:
          let q11 = this.getQueryNot(0);
          let q12= this.getQueryNot(1);
          let q13= this.getQueryNot(2);
          console.log(q11)
          console.log(q12)
          console.log(q13)
          
          body1={
            "query": {
                "$or": [ q11,q12,q13]
              
            }
          }
          break;
      default:
        break;
    }
    console.log("________________________________",body1)
    console.log("________________________________",JSON.stringify(body1.query))
    let body={
      name:seg.name,
      description:seg.description,
      register:seg.register,
      porcent:seg.porcent,
      query:this.segment.query_rest_assigned ? seg.query : JSON.stringify(body1.query),
      criteria:this.segmentation.criteria,
      type:"",
      add_rest:seg.add_rest
    }
    this.segment.segmentation[this.indexSegmentation]=body
    console.log("BODY",this.segment.segmentation)
    

      this.segment.segmentation.forEach(element => {
        if(element.criteria.length)
          new1.push(element)
        else if(element.add_rest){
          console.log("##################################################################",element)

          new1.push(element)
        }
      });
      this.segment.segmentation= new1
    
    console.log("##################################################################",this.segment.segmentation)
    this.calcularTotal()
    let body3={
      porcent:this.registros,
      query_rest:this.get_query_rest(),
      query_rest_assigned:this.segment.query_rest_assigned,
      segmentation:this.segment.segmentation
    }
    console.log("BODY3",body3)
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
  createInit(){
    console.log("create")
    const seg = this.segmentation; 
    let new1 =[]
    console.log(seg)
    let body1={
      query:{}
    }
    let x=this.segmentation.criteria.length-1
    console.log("HOLAAAAAAA_________",x)
    
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
        case 2:
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
    console.log("________________________________",body1)
    console.log("________________________________",JSON.stringify(body1.query))
    let body={
      name:seg.name,
      description:seg.description,
      register:seg.register,
      porcent:seg.porcent,
      query:JSON.stringify(body1.query),
      criteria:this.segmentation.criteria,
      type:"--",
      add_rest:seg.add_rest
    }
    console.log("BODY*",body)
    this.segment.segmentation[this.indexSegmentation]=body
    console.log("BODY*",this.segment.segmentation)
    
    // this.segment.segmentation.forEach(element => {
    //   console.log("element",element)
    //   if(element.criteria.length)
    //     new1.push(element)
    // });
    // this.segment.segmentation= new1
    console.log("segmentation*****",this.segment.segmentation)
    let body3={
      porcent:this.registros,
      query_rest:this.segment.query_rest,
      query_rest_assigned:this.segment.query_rest_assigned,
      segmentation:this.segment.segmentation
    }
    console.log("segmentation*****¡s",this.segment.segmentation)
    console.log("BODY----",body3,this.segment._id)
     this.Services.newSegmentation(this.segment._id, body3)
      .subscribe(
          data => {
            if(data.success){
              //console.log(data.data)
              //this.router.navigate(['/admin/segmentation']);
              //this.dialogRef.close(seg);
              
            }
          },
          error => {
            //this.error=true
          });

 
  }
}
