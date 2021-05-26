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
  displayedColumnsIG: string[] = ['Cliente', 'Portafolio'];
  displayedColumnsSEG: string[] = ['Registros','Datos_Segmentados', 'Porcentaje', 'No_Segmentados'];
  displayedColumns: string[] = ['date1', 'date2', 'date3', 'date4'];
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 0;
  bufferValue = 10; 
  segmentation_id = this.route.snapshot.params.id;
  indexSegmentation = this.route.snapshot.params.index;
  segmentation={
    name:"",
    criteria:[]
  }
  segment={
    portafolio_id:"",
    segmentation:[]
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
  getSegmentation(){
    this.Services.getSegmentation(this.segmentation_id)
    .subscribe(
        data => {
          if(data.success){
            this.segment=data.data;
            this.getPortaolio(this.segment.portafolio_id)
            this.getMap(this.segment.portafolio_id)
            this.segmentation=data.data.segmentation[this.indexSegmentation]
             console.log("Segmentacion",this.segmentation)
             console.log("Segmento",this.segment)
             if(this.indexSegmentation==0){
               if(this.segmentation.criteria.length)
               if(this.segmentation.criteria[0]){
                
                this.segmentation.criteria[0].dataInfo=this.dataSourceIG;
                this.segmentation.criteria[0].dataGrhap={
                  "options":this.options,
                  "salesSeries":this.salesSeries,
                  "chart": false
                }
                this.segmentation.criteria[0].dataSource=[]
                this.segmentation.criteria[0].dataSeg=[]
                this.analytics(0)
                
                //this.guardar1()
              }
                  //this.analytics()
               else{

               }

              this.dataSourceIG=[{
                client_id:"",
                portafolio: ""
              }]
              this.segmentation.criteria[0].dataGrhap={
                "register":0,
                "options":0,
                "salesSeries":0,
                "chart": false
              }
              this.segmentation.criteria[0].dataSource=[]
              this.segmentation.criteria[0].dataSeg=[]
              this.segmentation.criteria[0].dataInfo=this.dataSourceIG;
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
          console.log("Portafolio",this.portafolio)
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
          console.log("getMap ", data)
          if(data.success){
            this.segmentacion=data.data.segmentation;
            let segmentacion=[]
            data.data.segmentation.forEach(element => {
              if(element.status)
                this.segmentacionData.push(element.data)
            });
            console.log(this.segmentacionData, this.segmentacion)
           // this.CustomersList=data.data
            
          }
        },
        error => {
          //this.error=true
        });
  }
  changeCriterio(ev,index){
    console.log(ev.value,index)
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
  analytics(x){
      
    this.segmentation.criteria[x].dataGrhap.chart=false;
    console.log(x)
    let body={
      "query": {},
      "criterio1": "Riesgo",
  }
    switch (x) {
      case 0:
        body={
          "query": {},
          "criterio1": this.segmentation.criteria[x].name
        }
        break;
      case 1:
          body={
            "query": {
              [this.segmentation.criteria[0].name]: {
                "$gte": parseInt(this.segmentation.criteria[0].rankA),
                "$lte": parseInt(this.segmentation.criteria[0].rankB)
              },
            },
            "criterio1": this.segmentation.criteria[x].name
          }
        break;
    
      default:
        break;
    }
    console.log(body, this.segment.portafolio_id)
    this.Services.getASegment(body,this.segment.portafolio_id)
    .subscribe(
        data => {
          console.log("getMap ", data)
          if(data.success){
            let dataSeg=data.data
            this.segmentation.criteria[x].dataSource = [
              {date1: dataSeg.porcents[0], date2: dataSeg.porcents[1], date3:dataSeg.porcents[2], date4: dataSeg.porcents[3]},
              {date1: dataSeg.data[0], date2: dataSeg.data[1], date3:dataSeg.data[2], date4: ''},
              {date1:dataSeg.lables[0], date2: dataSeg.lables[1], date3: dataSeg.lables[2], date4: dataSeg.lables[3]},
            ];
              this.options.labels=data.data.labelsGraph
               this.salesSeries[0].data=data.data.dataGraph
            this.registerActual=data.data.register
              this.segmentation.criteria[x].dataGrhap={
                "options":this.options,
                "salesSeries":this.salesSeries,
                "chart": true
              }
              if(this.segmentation.criteria[x].rankB && this.segmentation.criteria[x].rankA)
                this.save(x)
          }
        },
        error => {
          //this.error=true
        });
  }
  save(x){
    let body={
      "query": {},
      "criterio1": "Riesgo"
  }
    switch (x) {
      case 0:
        body={
          "query": {[this.segmentation.criteria[x].name]: {
            "$gte": parseInt(this.segmentation.criteria[x].rankA),
            "$lte": parseInt(this.segmentation.criteria[x].rankB)
            }
          },
          "criterio1": this.segmentation.criteria[x].name
        }
        break;
        case 1:
          body={
            "query": {
                "$and": [
                  {
                    [this.segmentation.criteria[0].name]: {
                      "$gte": parseInt(this.segmentation.criteria[0].rankA),
                      "$lte": parseInt(this.segmentation.criteria[0].rankB)
                    }
                  },
                  {
                    [this.segmentation.criteria[1].name]: {
                      "$gte": parseInt(this.segmentation.criteria[1].rankA),
                      "$lte": parseInt(this.segmentation.criteria[1].rankB)
                    }
                  }
                ]
              
            },
            "criterio1": this.segmentation.criteria[x].name
          }
          break;
    
      default:
        break;
    }
    console.log(body, this.segment.portafolio_id)
    this.Services.getASR2(this.segment.portafolio_id,body)
      .subscribe(
          data => {
            console.log("Hola--", data)
            if(data.success){
               console.log(data.data)
             let info2=data.data;
             let register=this.registerActual-info2;
             this.AddCriteria=true
             if(register==0) this.AddCriteria=false
             let porcent2= (info2*100)/this.registerTotal 
             this.bufferValue=porcent2
             this.value=porcent2
               console.log("........",this.registerActual,register, porcent2,info2)
               this.segmentation.criteria[x].dataSeg=[{
                "actual": this.registerActual,
                "register":register,
                "porcent":porcent2.toFixed(1),
                "info": info2
              }]
            }
          },
          error => {
            //this.error=true
          });
  }
  newCriteria(){
    this.segmentation.criteria.push({
      dataInfo:[{}],
      dataGrhap: [],
      dataSeg: [],
      dataSource:  [],
      name: "",
      percentage: 0,
      rankA: "",
      rankB: ""
    })
    this.segment.segmentation.push(this.segmentation)
    console.log(this.segment)
  }

 
}
