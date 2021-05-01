import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Customer } from './interfaces/map.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from '../../../../static-data/aio-table-data';
import { MapCreateUpdateComponent } from './map-create-update/map-create-update.component';
import { MapUpdateComponent } from './map-update/map-update.component';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icLoad from '@iconify/icons-ic/arrow-drop-down-circle';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icUpload from '@iconify/icons-ic/file-upload';
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
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Services} from '../../../Services/services'

@UntilDestroy()
@Component({
  selector: 'vex-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
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
export class MapComponent implements OnInit, AfterViewInit {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  data$: Observable<Customer[]> = this.subject$.asObservable();
  customers: Customer[];

  @Input()
  columns: TableColumn<Customer>[] = [];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Customer> | null;
  selection = new SelectionModel<Customer>(true, []);
  searchCtrl = new FormControl();
  willDownload=false;
  labels = aioTableLabels;

  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icLoad=icLoad;
  icAdd = icAdd;
  icUpload=icUpload;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  agency_id=this.client.agency_id;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort: MatSort;
  portafolio_id = this.route.snapshot.params.id;
  isNew = this.route.snapshot.params.isNew;

  constructor(private dialog: MatDialog, private Services: Services,private route:ActivatedRoute, private snackbar: MatSnackBar,) {
  }

  get visibleColumns() {
    let columns=this.columns.filter(column => column.visible).map(column => column.property);
    //console.log(columns)
    return columns;
   // return this.columns.filter(column => column.visible).map(column => column.property);
  }
  get visibleColumns1() {
    let columns=this.columns1.filter(column => column.visible).map(column => column.property);
   //console.log(columns)
    return columns;
  }
    

  displayedColumns1: string[] = [ "1", "2"];
  jsDatos1 = [];
  jsDatos = [];
  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData() {
    return of(aioTableData.map(customer => new Customer(customer)));
  }

  ngOnInit() {
    this.getData().subscribe(customers => {
      this.subject$.next(customers);
    });
    if(this.isNew=="false"){
     //console.log("Es False")
      this.getMap();
    }

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Customer[]>(Boolean)
    ).subscribe(customers => {
      this.customers = customers;
      this.dataSource.data = customers;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }
  get displayedColumns() {
    var keys = [];
    if(this.jsonData &&this.jsonData.Datos.length){
      
      for(var k in this.jsonData.Datos[0]){
        keys.push(k);
      }  
      this.datos=keys;
      
    }
    //keys=[ "INDICE", "Agencia Previa 1", "Agencia Previa 3", "Monto Agencia Previa", "Monto Agencia Previa 1", "Monto Agencia Previa 2", "Monto Agencia Previa 3", "Monto Agencia Previa 4", "Fecha Agencia Previa 5", "Fecha de mora", "Fecha Nacimiento Cliente", "Fecha primer carga", "Fecha Quebranto", "Límite credito", "Monto Agencia Previa 5", "Monto Capital por Vencer", "Monto de Capital Pagado", "Monto Referencia Agencia Actual", "Monto total a disposición", "Monto Ult Pago", "Monto Ultimo Pago", "Monto Vencido", "Moratorios", "Nombre Cliente", "Nombre Empresa", "Ordinario Vencido", "Ordinarios Pagados", "Originadora", "Pago Liquidacion Anticipada", "Pago Minimo", "Pago Vencido", "Plaza", "PRIORIDAD", "Propietario", "Referencia Bancaria", "RFC Cliente", "Saldo Total", "Sexo Cliente", "Situacion Especial", "Sub Producto", "Tel Cliente", "Telefono 3", "Tipo Producto", "Total pagado", "Ultima Accion", "Gestor ", "Monto a disposición", "CP Cliente", "Credito / Numero Tarjeta", "Dias Corte", "Dias Mora", "Direccion 2", "Direccion Cliente", "Estado Cliente", "Estatus", "Fecha Actualizacion", "Fecha Agencia Previa", "Fecha Agencia Previa 1", "Fecha Agencia Previa 2", "Fecha Agencia Previa 3"]

    return keys;

  }
  
  createMapeo() {
    let data={
      datos:this.datos,
      agency_id:this.agency_id,
      portafolio_id:this.portafolio_id
    }
    this.dialog.open(MapCreateUpdateComponent, {data: data}).afterClosed().subscribe((customer: Customer) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        //this.customers.unshift(new Customer(customer));
        this.subject$.next(this.customers);
      }
    });
  }
  uploadActive=true;
  dataSourceUpload=[]
  upload(){
    let body={
      "cart":this.jsonData.Datos,
      "type":"upload",
      portafolio_id:this.portafolio_id
    }
    this.dialog.open(MapUpdateComponent, {
      data: body
    }).afterClosed().subscribe(updatedCustomer => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedCustomer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.uploadActive=false;
        this.columns=[];
        this.datos.forEach(element => {
         //console.log(element)
          this.columns.push({ label: element.toString(), property: element.toString(), type: 'text', visible: true })
          
        });
        this.dataSourceUpload=this.jsonData.Datos
       //console.log(this.columns)
      }
    });
  }
  getMap(){
    this.Services.getDataMap(this.portafolio_id)
    .subscribe(
        data => {
          if(data.success){
           //console.log(data.data)
            this.dataSourceUpload=data.data;
            if(this.dataSourceUpload.length){
      let keys=[];
              for(var k in this.dataSourceUpload[0]){
                keys.push(k);
              }  
              this.datos=keys;
              this.columns=[];
              this.datos.forEach(element => {
               //console.log(element)
                this.columns.push({ label: element.toString(), property: element.toString(), type: 'text', visible: true })
                this.map.push({
                datos:element.toString(),
                ejemplo:this.dataSourceUpload[0][element.toString()]})
    
                this.analysis.push({
                  data:element.toString(),
                  status:false
                });
                this.segmentation.push({
                  data:element.toString(),
                  status:false
                })
                this.strategies.push({
                  data:element.toString(),
                  status:false
                });
                this.customerPortal.push({
                  data:element.toString(),
                  status:false
                });
                this.validations.push({
                  data:element.toString(),
                  status:false,
                  type:""
                });
              });
            }
          }
        },
        error => {
          //this.error=true
        });
  }
  load(){
    let body={
      "cart":this.jsonData.Datos,
      "type":"load"
    }
    this.dialog.open(MapUpdateComponent, {
      data: body
    }).afterClosed().subscribe(updatedCustomer => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedCustomer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.customers.findIndex((existingCustomer) => existingCustomer.id === updatedCustomer.id);
        this.customers[index] = new Customer(updatedCustomer);
        this.subject$.next(this.customers);
      }
    });
  }
  
  updateCustomer(customer: Customer) {
    this.dialog.open(MapCreateUpdateComponent, {
      data: customer
    }).afterClosed().subscribe(updatedCustomer => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedCustomer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.customers.findIndex((existingCustomer) => existingCustomer.id === updatedCustomer.id);
        this.customers[index] = new Customer(updatedCustomer);
        this.subject$.next(this.customers);
      }
    });
  }

  deleteCustomer(customer: Customer) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.customers.splice(this.customers.findIndex((existingCustomer) => existingCustomer.id === customer.id), 1);
    this.selection.deselect(customer);
    this.subject$.next(this.customers);
  }

  deleteCustomers(customers: Customer[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    customers.forEach(c => this.deleteCustomer(c));
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Customer) {
    const index = this.customers.findIndex(c => c === row);
    this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }

  //MAP
   jsonData = {Datos:[]};
   datos: String[];
   name:'Datos'
   map=[];
   columns1=[]
   analysis=[]
   segmentation=[]
   strategies=[]
   customerPortal=[]
   validations=[]
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
            this.map.push({
            datos:element.toString(),
            ejemplo:jsonData.Datos[0][element.toString()]})

            this.analysis.push({
              data:element.toString(),
              status:false
            });
            this.segmentation.push({
              data:element.toString(),
              status:false
            })
            this.strategies.push({
              data:element.toString(),
              status:false
            });
            this.customerPortal.push({
              data:element.toString(),
              status:false
            });
            this.validations.push({
              data:element.toString(),
              status:false,
              type:""
            });
          });
        }
        
       //console.log(this.map)
        this.jsDatos =this.jsonData.Datos
      }, 300);
    }
    reader.readAsBinaryString(file);
  }
  create(){
    let body={
      portafolio_id:this.portafolio_id,
      datos:this.datos,
      analysis: this.analysis,
      segmentation: this.segmentation,
      strategies: this.strategies,
      customerPortal: this.customerPortal,
      validations: this.validations
    }
    this.Services.createMap(body)
    .subscribe(
        data => {
          if(data.success){
           //console.log(data.data)
            this.isNew='false';

            this.dataSourceUpload=this.jsonData.Datos
           //console.log(this.dataSourceUpload)
            this.uploadActive=false
          }
        },
        error => {
          //this.error=true
        });
  }
 

  
  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute("download", 'xlsxtojson.json');
    }, 100)
  }
  
}
