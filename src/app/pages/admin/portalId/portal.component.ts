import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, findIndex } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Strategy } from './interfaces/strategy.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from '../../../../static-data/aio-table-data';
import { StrategyCreateUpdateComponent } from './strategy-create-update/strategy-create-update.component';
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
import { id } from 'date-fns/locale';
import data from '@iconify/icons-ic/twotone-visibility';
import icInfo from '@iconify/icons-ic/info';

@UntilDestroy()
@Component({
  selector: 'vex-strategy',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
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
export class StrategyComponent implements OnInit {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Strategy[]> = new ReplaySubject<Strategy[]>(1);
  data$: Observable<Strategy[]> = this.subject$.asObservable();
  strategys: Strategy[];
  dataSource: MatTableDataSource<Strategy> | null;
  icPerson = icPerson;
  jsDatos=[]
  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icFilterList=icFilterList;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icInfo=icInfo;
  visible=false
  searchCtrl = new FormControl();
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  constructor( private Services: Services,private router: Router, private route:ActivatedRoute, private dialog: MatDialog,) {
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
  displayedColumnsIG: string[] = ['Cliente', 'Portafolio'];
  displayedColumnsSEG: string[] = ['Registros','Datos_Segmentados', 'Porcentaje', 'No_Segmentados'];
  displayedColumns: string[] = ['date1', 'date2', 'date3', 'date4', 'date5'];
  displayedColumnsNew: string[] = ['date1', 'date2', 'date3', 'date4', 'date5'];

  refresh: Subject<any> = new Subject();
  displayedColumnsA1: string[] = ['RESUMEN DE PORTAFOLIO', '-'];
  displayedColumnsB1: string[] = ['RESUMEN DE SEGMENTACIÓN', '-', '-'];
  displayedColumnsC1: string[] = ['SEGMENTO', 'REGISTROS', '%'];
  generalIF=[{
    name:"",
    data:""
  }];
html1="En el portal se pueden mostrar hasta 5 campos de datos generales (p.e. nombre, contrato, producto etc) y hasta 5 campos de cartera vencida. Se deben activar con el chec-box la cantidad de campos que se requieren. "
html2="Configura el portal y dale un nombre al campo que le quieres mostrar al cliente. Puedes usar hasta 30 caracteres."
html3="Elige el campo correspondiente del mapeo."
html4=""
OnePay=false
morePay= false
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 0;
  bufferValue = 10; 
  canales=[
    {label:"SMS",days:0},
    {label:"E-MAIL",days:0},
    {label:"BLASTER",days:0}
  ]
  segmentation_id = this.route.snapshot.params.id;
  indexSegmentation = this.route.snapshot.params.index;
  strategy={
    name:"",
    description:"",
    type:"rank",
    criteria:[],
    register:0,
    porcent:0,
    query:"",
  }
  strategy1={
    name:"",
    description:"",
    type:"rank",
    register:0,
    porcent:0,
    query:{},
    criteria:[]
  }
  segmenta={
    _id:"",
    segmentation:[],
    portafolio_id:""
  }
  segment={
    _id:"",
    portafolio_id:"",
    segmentation:[],
    strategy:[{
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
    
    this.getSegmentation()
    //this.getStrategy()
    this.getMap()
    
  }
  dataPortal=[
    {
      name:"",
      status:false,
      data:""
    },
    {
      name:"",
      status:false,
      data:""
    }
    ,
    {
      name:"",
      status:false,
      data:""
    },
    {
      name:"",
      status:false,
      data:""
    }
    ,
    {
      name:"",
      status:false,
      data:""
    }
  ]
  deudaPortal=[
    {
      name:"",
      status:false,
      data:"",
      descuento:0,
      pay:""
    },
    {
      name:"",
      status:false,
      data:"",
      descuento:0,
      pay:""
    }
    ,
    {
      name:"",
      status:false,
      data:"",
      descuento:0,
      pay:""
    },
    {
      name:"",
      status:false,
      data:"",
      descuento:0,
      pay:""
    }
    ,
    {
      name:"",
      status:false,
      data:"",
      descuento:0,
      pay:""
    }
  ]
  currentData=null
  getSegmentation(){
    this.Services.getSegmentation(this.segmentation_id)
    .subscribe(
        data => {
          if(data.success){
            this.segmenta=data.data;
            console.log("*********************",this.segmenta.segmentation[this.indexSegmentation])
            this.segmentacionData=this.segmenta.segmentation[this.indexSegmentation]
            this.getPortaolio(this.segmenta.portafolio_id)
          }
        },
        error => {
          //this.error=true
        });
  }

  onCheckboxChange(x){
    console.log(x.checked)
    this.visible=x.checked
  }
  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }
  isEdit=false
  isNew=false
  registerTotal=0
  name=""
  communicationData=[]
  getMap(){
    this.Services.getMap("608ab9458eb7d30bf1e9b855")
    .subscribe(
        data => {
          console.log("getMap ", data)
          if(data.success){
            data.data.strategies.forEach(element => {
              if(element.status){

              
                this.communicationData.push(element.data)
              }
                
            });
           // this.CustomersList=data.data
            
          }
        },
        error => {
          //this.error=true
        });
  }
  generalP=[]
  displayedColumnsA2: string[] = ['Cliente', 'Portafolio','Registros','Segmentación'];
  getPortaolio(id){
  this.Services.getPortafolio(id)
  .subscribe(
      data => {
        if(data.success){
          this.portafolio=data.data;
          (this.indexSegmentation==0)
            this.registerTotal=this.portafolio.register
          //console.log("Portafolio",this.portafolio)
          this.segment.strategy.forEach(element => {
            //console.log(element.porcent)
            this.value=this.value+element.porcent
            this.bufferValue=this.value
          });
          this.generalP=[{
            cliente: this.portafolio.client_id.name,
            portafolio: this.portafolio.name_portafolio,
            registros: this.portafolio.register.toString()||"null",
            segmentado: this.segmentacionData.name
          }]
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
            data: this.portafolio.register.toString()
          },
          {
            name:"SEGMENTO ",
            data: this.segmentacionData.name
          }]
        }
      },
      error => {
        //this.error=true
      });
  }
  segmentacionData={
    name:"",
    portafolio_id:"",
    segmentation_id:""
    
  }
  segmentacion={}
  displayedColumnsS = ["comunication"]
  days=null
  init=""
  noneDays=null
  columns: TableColumn<Strategy>[] = [];
  
  changeCriterio(ev,index){
    //console.log(ev.value,index)
    this.strategy.criteria[index].name= ev.value
   /* switch (index) {
      case 0:
        this.strategy.criteria[index].name= ev.value
        this.analytics(index)
      break;
      case 1:
        this.strategy.criteria[1].name= ev.value
        //this.analizar2()
      break;
      case 2:
        this.strategy.criteria[2].name= ev.value
        //this.analizar3()
      break;
      case 3:
        this.strategy.criteria[3].name= ev.value
        //this.analizar4()
      
      break;

      default:
        break;
    }*/
  }
  editStrategy(customer: Strategy, label) {
    console.log("**",label)
    customer.name_seg=label
    this.dialog.open(StrategyCreateUpdateComponent, {
      data: customer
    }).afterClosed().subscribe(updatedSegmentation => {
      /**
       * Segmentation is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedSegmentation) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
         const index = this.jsDatos.findIndex((dato) => dato[0].Comunicacion === customer.Comunicacion);
         console.log("--------",this.jsDatos[index][0])
         this.jsDatos[index].push({
           [label]:updatedSegmentation[0]
         })
         //this.jsDatos[index][0][label] = updatedSegmentation[0]
        console.log(updatedSegmentation)
        console.log(this.jsDatos)
      }
    });
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
  active=false
  datos=[]
  create(){
    let body={
      portafolio_id: this.segmenta.portafolio_id,
      segmentation_id: this.segmenta._id,
      segmentation: this.segmentation_id,
      isCanal:this.visible,
      canales:this.canales,
      days:this.days,
      noneDays:this.noneDays,
      calendary:this.jsDatos
    }
    console.log(body)
    this.router.navigate(['/admin/portal']);
  }
  addStrategy(){
    this.datos=[]
    for (let index = 1; index < parseInt(this.days) + 1; index++) {

      this.datos.push("Día "+ index)
       
     }
     this.datos.unshift("Comunicacion")
    this.columns=[];
    let table=[]
    this.datos.forEach(element => {
  table.push({[element]:""})
     //console.log(element)
     if(element!="Comunicacion")
      this.columns.push({ label: element.toString(), property: element.toString(), type: 'text', visible: true })
      else
      this.columns.push({ label: element.toString(), property: element.toString(), type: 'text', visible: true })

    })
   
   this.jsDatos.push([{"Comunicacion":"SMS"}])
   this.jsDatos.push([{"Comunicacion":"E-MAIL"}])
   this.jsDatos.push([{"Comunicacion":"BLASTER"}])
   this.jsDatos.push([{"Comunicacion":"CARTA"}])
   this.active=true
  }
  get visibleColumns() {
    let columns=this.columns.filter(column => column.visible).map(column => column.property);
    
    return columns;
   // return this.columns.filter(column => column.visible).map(column => column.property);
  }

}
