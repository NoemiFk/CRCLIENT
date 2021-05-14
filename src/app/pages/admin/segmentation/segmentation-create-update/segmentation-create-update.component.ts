import { Component, Inject, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../interfaces/segmentation.model';
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

@Component({
  selector: 'vex-segmentation-create-update',
  templateUrl: './segmentation-create-update.component.html',
  styleUrls: ['./segmentation-create-update.component.scss']
})
export class SegmentationCreateUpdateComponent implements OnInit {

  static id = 100;

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

  

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  openCriterio2=false

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

  ngOnInit() {
     console.log(createDateArray(12))
    this.getCustomersList();
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Customer;
    }

    this.form = this.fb.group({
      name: [this.defaults.name || ''],
      description: [this.defaults.description || ''],
      client_id: [this.defaults.client_id || ''],
      portafolio_id: [this.defaults.portafolio_id || ''],
      criterio1: [this.defaults.criterio1 || ''],
      rango1A: [this.defaults.rango1A || ''],
      rango1B: [this.defaults.rango1B || ''],
      criterio2: [this.defaults.criterio1 || ''],
      rango2A: [this.defaults.rango1A || ''],
      rango2B: [this.defaults.rango1B || ''],
    });
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
  analizar(){
    this.chart=false;
    const segmentacion = this.form.value;
    console.log(segmentacion.criterio1, segmentacion.portafolio_id)
    this.Services.getASegmentacion(segmentacion.criterio1,segmentacion.portafolio_id._id)
      .subscribe(
          data => {
            console.log("Hola ", data)
            if(data.success){
               console.log(this.salesSeries[0].data)
               console.log(this.options.labels)
               console.log(data.data)
               this.options.labels=data.data.labelsGraph
               this.salesSeries[0].data=data.data.dataGraph
               this.datas=data.data
               this.chart=true
            }
          },
          error => {
            //this.error=true
          });
  }
  analizar2(){
    this.chart2=false;
    const segmentacion = this.form.value;
    console.log(segmentacion.criterio1, segmentacion.portafolio_id)
    this.Services.getASegmentacion2(segmentacion.criterio2,segmentacion.criterio1,segmentacion.portafolio_id._id,segmentacion.rango1A, segmentacion.rango1B)
      .subscribe(
          data => {
            console.log("Hola ", data)
            if(data.success){
               console.log(this.salesSeries2[0].data)
               console.log(this.options.labels)
               console.log(data.data)
               this.options2.labels=data.data.labelsGraph
               this.salesSeries2[0].data=data.data.dataGraph
               this.datas2=data.data
               this.chart2=true
            }
          },
          error => {
            //this.error=true
          });
  }
  info=0
  guardar1(){
    const segmentacion = this.form.value;
    console.log(segmentacion.criterio1)
    this.Services.getASR(segmentacion.criterio1,segmentacion.portafolio_id._id, segmentacion.rango1A, segmentacion.rango1B)
      .subscribe(
          data => {
            console.log("Hola ", data)
            if(data.success){
               console.log(data.data)
               this.info=data.data;
               
            }
          },
          error => {
            //this.error=true
          });
  }
  segmentacion=[];
  getMap(id){
      this.Services.getMap(id)
      .subscribe(
          data => {
            console.log("Hola ", data)
            if(data.success){
              this.segmentacion=data.data.segmentation
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
