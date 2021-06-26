import { Component, Inject, OnInit } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Portafolio } from '../interfaces/Portafolio.model';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { MatTableDataSource } from '@angular/material/table';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {Services} from '../../../../Services/services'
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icSearch from '@iconify/icons-ic/twotone-search';
import * as XLSX from 'xlsx';
import { TableColumn } from '../../../../../@vex/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { stagger40ms } from '../../../../../@vex/animations/stagger.animation';
@UntilDestroy()
@Component({
  selector: 'vex-pay-update',
  templateUrl: './pay-update.component.html',
  styleUrls: ['./pay-update.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class PayUpdateComponent implements OnInit {

  static id = 100;
  layoutCtrl = new FormControl('boxed');

  mode: 'create' | 'update' = 'create';
  agency={};
  searchCtrl = new FormControl();
  icMoreVert = icMoreVert;
  icClose = icClose;
  icSearch=icSearch;
  icFilterList=icFilterList;
  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  subject$: ReplaySubject<Portafolio[]> = new ReplaySubject<Portafolio[]>(1);
  data$: Observable<Portafolio[]> = this.subject$.asObservable();
  customers: Portafolio[];
  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  CustomersList={}
  map=[];
  columns1=[]
  analysis=[]
  segmentation=[]
  strategies=[]
  customerPortal=[]
  endorsement=[]
  validations=[]
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<PayUpdateComponent>,
              private Services: Services,
              private snackbar: MatSnackBar) {
  }

  portafolio_id="";
  columns: TableColumn<Portafolio>[] = [];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Portafolio> | null;
  selection = new SelectionModel<Portafolio>(true, []);
  ngOnInit() {
    
    if (this.defaults) {
      this.mode = 'update';
      this.portafolio_id = this.defaults._id;
      let portafolio=this.defaults
      //console.log(this.defaults)
      this.getMap(this.portafolio_id)
      this.defaults= {
        "_id":portafolio._id,
      "name_portafolio": portafolio.name_portafolio,
      "description": portafolio.description,
      "agency_id": portafolio.agency_id,
      "type": portafolio.type,
      "client_id": portafolio.client_id,
      }
      console.log(this.defaults)
    } else {
      this.defaults = {} as Portafolio;
    }

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Portafolio[]>(Boolean)
    ).subscribe(customers => {
      this.customers = customers;
      this.dataSource.data = customers;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  getMap(id){
    this.Services.getMap(id)
    .subscribe(
        data => {
          console.log("Hola ", data)
          if(data.success){
            console.log(data.data)
            this.map=data.data.datos;
            this.analysis=data.data.analysis
            this.segmentation=data.data.segmentation
            this.strategies=data.data.strategies
            this.customerPortal=data.data.customerPortal;
            this.endorsement=data.data.endorsement||[];
            this.validations=data.data.validations
            console.log(this.analysis)
            this.map.forEach(element => {
               this.endorsement.push({
                 data:element.toString(),
                 status:false
               });
              });
            //this.segmentacion=data.data.segmentation
           // this.CustomersList=data.data
            
          }
        },
        error => {
          //this.error=true
        });
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  
  save() {
    console.log(this.analysis)
      this.updateMap();
  }

  saveChange(val,index){
    switch (val) {
      case "analysis":
        console.log(this.analysis[index].status)
        if(this.analysis[index].status) this.analysis[index].status=false
        else this.analysis[index].status=true
        console.log(this.analysis[index])
        break;
        case "segmentation":
          console.log(this.segmentation[index].status)
          if(this.segmentation[index].status) this.segmentation[index].status=false
          else this.segmentation[index].status=true
          console.log(this.segmentation[index])
        break;
        case "strategies":
          console.log(this.strategies[index].status)
          if(this.strategies[index].status) this.strategies[index].status=false
          else this.strategies[index].status=true
          console.log(this.strategies[index])
        break;
        case "customerPortal":
          console.log(this.customerPortal[index].status)
          if(this.customerPortal[index].status) this.customerPortal[index].status=false
          else this.customerPortal[index].status=true
          console.log(this.customerPortal[index])
        break;
        case "endorsement":
          console.log(this.endorsement[index].status)
          if(this.endorsement[index].status) this.endorsement[index].status=false
          else this.endorsement[index].status=true
          console.log(this.endorsement[index])
        break;
        case "validations":
          console.log(this.validations[index].status)
          if(this.validations[index].status) this.validations[index].status=false
          else this.validations[index].status=true
          console.log(this.validations[index])
        break;
    
      default:
        break;
    }
  }

  createRegister() {

    //console.log("CREAR Mapa", this.portafolio_id)
 
     this.Services.createRegister(this.jsDatos,this.portafolio_id)
     .subscribe(
         data => {
           if(data.success){
            //console.log(data.data)
             //this.info=data.data
           }
         },
         error => {
           //this.error=true
         });
 
   }
   get visibleColumns() {
    let columns=this.columns.filter(column => column.visible).map(column => column.property);
    //console.log(columns)
    return columns;
   // return this.columns.filter(column => column.visible).map(column => column.property);
  }

  jsonData = {Datos:[]};
  datos: String[];
  name:'Datos'
  jsDatos1 = [];
  jsDatos = [];
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      workBook.SheetNames.forEach(element => {
        
        //console.log("--",element)
      });
      for (let i = 0, l = workBook.SheetNames.length; i < l; i += 1) {
        //this.processSheet(workBook.Sheets[workBook.SheetNames[i]]);
       }
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        this.name=name;
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
     //console.log(jsonData[this.name])
      jsonData.Datos=jsonData[this.name]
     //console.log(jsonData.Datos.length)
      this.jsonData=jsonData;
      const dataString = JSON.stringify(jsonData);
      //console.log(dataString)
     // document.getElementById('output').innerHTML = jsonData.Datos.length.toString();
      //document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
      //this.setDownload(dataString);
      setTimeout(() => {
       //console.log("Tiempo")
        let keys=[];
        if(this.jsonData &&this.jsonData.Datos.length){
      
          for(var k in this.jsonData.Datos[0]){
            keys.push(k);
          }  
          this.datos=keys;
          this.columns=[];
          this.datos.forEach(element => {
           //console.log(element)
            this.columns.push({ label: element.toString(), property: element.toString(), type: 'text', visible: true })
            
          });
        }
        
       //console.log(this.map)
        this.jsDatos =this.jsonData.Datos
      }, 300);
    }
    reader.readAsBinaryString(file);
  }


  
  updateMap(){
    let body={
      portafolio_id:this.portafolio_id,
      datos:this.map,
      analysis: this.analysis,
      segmentation: this.segmentation,
      strategies: this.strategies,
      customerPortal: this.customerPortal,
      endorsement:this.endorsement,
      validations: this.validations
    }
    this.Services.updateMap(body, this.portafolio_id)
    .subscribe(
        data => {
          if(data.success){
            this.snackbar.open(data.data, 'OK', {
              duration: 10000
            });
            this.dialogRef.close(data.data);
          }
        },
        error => {
          console.log(error.error.type)
          this.snackbar.open(error.error.type, 'OK', {
            duration: 10000
          });
          //this.error=true
        });
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
}
