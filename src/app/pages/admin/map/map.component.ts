import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Customer } from './interfaces/map.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from '../../../../static-data/aio-table-data';
import { MapCreateUpdateComponent } from './map-create-update/map-create-update.component';
import { MapUpdateComponent } from './map-update/map-update.component';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icLoad from '@iconify/icons-ic/arrow-drop-down-circle';
import icBack from '@iconify/icons-ic/arrow-back';
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
import { MatSelectChange, SELECT_PANEL_INDENT_PADDING_X } from '@angular/material/select';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Services} from '../../../Services/services'
import { type } from 'os';
import icInfo from '@iconify/icons-ic/info';
import icError from '@iconify/icons-ic/error';
import icWarning from '@iconify/icons-ic/warning';
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
  displayedColumnsA2: string[] = ['Campo','Ejemplo','Segmentación','Comunicación','Portal','Aval','Validación'];

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
  portal=""
  icInfo=icInfo;
  icError=icError
  icWarning= icWarning
  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icLoad=icLoad;
  icBack=icBack;
  icAdd = icAdd;
  icUpload=icUpload;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  agency_id=this.client.agency_id;
  active=false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort: MatSort;
  portafolio_id = this.route.snapshot.params.id;
  isNew = this.route.snapshot.params.isNew;

  constructor(private dialog: MatDialog, private Services: Services,private route:ActivatedRoute, private snackbar: MatSnackBar,private router: Router) {
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

  count = 0
  disableSegment=false
  alert4 = false 
  saveChange(val,index){
    this.alert4 = false 
    this.disableSegment=false
    switch (val) {
      case "analysis":
        console.log(this.analysis[index].status)
        if(this.analysis[index].status) this.analysis[index].status=false
        else this.analysis[index].status=true
        console.log(this.analysis[index])
        break;
        case "segmentation":
          if(this.segmentation[index].status) this.segmentation[index].status=false
          else this.segmentation[index].status=true
          this.segmentation.forEach((element,x) => {
            if(element.status && (this.segmentation[index].data == element.data)){
              this.count++
              if (this.count >= 10) {
                this.alert4 = true 
                this.disableSegment=true
                
              }
            }
          });
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
  ngOnInit() {
    this.getData().subscribe(customers => {
      this.subject$.next(customers);
    });
    this.getPortaolio(this.portafolio_id)
    if(this.isNew=="false"){
     console.log("Es False")
      this.getMap(this.portafolio_id);
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



    //console.log("CREAR Mapa", this.portafolio_id)
   
   
  
   
   // Call the function while passing in an array of your choice.
  
  }
 randomArray = [3, 5, 1, 5, 7,];
  // Create an empty array.
  arrayOfArrays = [];
  countDatos=0
 splitArray( array ) {
   console.log("++",array.length)
   this.countDatos= array.length
    while (array.length > 0) {
        let arrayElement = array.splice(0,50);
        this.arrayOfArrays.push(arrayElement);
        console.log("------",array.length)
    }
     console.log("**",this.arrayOfArrays)
    return this.arrayOfArrays;
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

  back(){
    this.router.navigate(['/admin/portafolios']);
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

  portafolio={
    name_portafolio:"",
    register:0
  }
  registros = 0
  getPortaolio(id){
    this.Services.getPortafolio(id)
    .subscribe(
        data => {
          if(data.success){
            this.portafolio=data.data;
            console.log("PORTAFOL",this.portafolio)
            this.registros = this.portafolio.register
            
          }
        },
        error => {
          //this.error=true
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
  created='';
  update='';
  type='string'
  getDataMap(){
    this.Services.getDataMap(this.portafolio_id)
    .subscribe(
        data => {
          if(data.success){
           console.log(data.data.length)
            this.dataSourceUpload=data.data;
            if(this.dataSourceUpload.length){
      let keys=[];
              for(var k in this.dataSourceUpload[0]){
                keys.push(k);
              }  
              this.datos=keys;
              this.columns=[];
              this.datos.forEach(element => {
                console.log(element)
                this.type = typeof this.dataSourceUpload[0][element.toString()]
                console.log("----type-----",this.type, this.dataSourceUpload[0][element.toString()])
                let isValidDate = Date.parse(this.dataSourceUpload[0][element.toString()]);
                if (isNaN(isValidDate)) {
                  this.type = "date"
                }
                if(this.validateEmail(this.dataSourceUpload[0][element.toString()]))
                  this.type = "email"
                if(this.validatePhone(this.dataSourceUpload[0][element.toString()]))
                  this.type = "phone"
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
                this.endorsement.push({
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
                  type:this.type
                });
              });
            }
          }
        },
        error => {
          //this.error=true
        });
  }
  dataMapeo=null
  validateEmail(email) {
    let regex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
    console.log("validate email", regex.test(email))
    return regex.test(email)
  }
  validatePhone(phone) {

    console.log("validate phone", phone)

      let regex = /^(\d{10})$/
      let regex1 = /^(\d{12})$/
      console.log("validate phone", regex.test(phone),regex1.test(phone))
      return regex.test(phone) || regex1.test(phone)
   
  }
  getMap(id){
    this.Services.getMap(id)
    .subscribe(
        data => {
          console.log("Hola ", data)
          if(data.success){
            this.dataMapeo = data.data.datos
            console.log(data.data)
            //this.created=data.data.created;
            //this.update=data.data.update;
            //this.map=data.data;
            this.getDataMap()
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
  actualizando= false
  datosactualizados = 0
  updateDataMapeo(){
    this.active= true
    this.deleteRegister()
      
  }

  updateRegister (register){
    return new Promise((resolve, reject) => {
      this.Services.updateRegister(register,this.portafolio_id)
      .subscribe(
          data => {
            if(data.success){
              this.actualizando= true
              this.datosactualizados = this.jsonData.Datos.length  - this.registros
              if(this.datosactualizados < 0)
              this.datosactualizados = this.datosactualizados  * -1
              resolve(true)
            }
          },
          error => {
            //this.error=true
            reject(false)
          });
    });
  }
  deleteRegister (){
      this.Services.deleteRegister(this.portafolio_id)
      .subscribe(
          data => {
            if(data.success){
              console.log("Cartera Eliminada.......")
              console.log("Cargar Archivos.......")
              this.createRegister()
            }
          },
          error => {
            console.error(error)
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

  sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }
  
  async createRegister() {

   this.count=0
   console.log(this.jsDatos.length)
    this.jsDatos.forEach((el,y) => {
      //console.log("-----------------------",)
      if(y==0){
        el.firts = true
      }
      else{
        el.firts = false
        console.log(el.firts,y)
      }
    })
    let array = this.splitArray(this.jsDatos)
    let promises= []
    console.log("Datos", this.jsDatos)
   array.forEach((element, x) => {
     
       promises.push(
         this.registerCart(element)
       )

      //this.sleep(200);
      
   });
   Promise.all(promises)
    .then(result => {
        console.log("Termino de Cargar datos ", result, this.isNew)

        
        if(this.isNew=="false"){ 
          console.log("Vista anterior", this.countDatos, this.registros)
          this.actualizando= true
          this.datosactualizados = this.countDatos  - this.registros
          if(this.datosactualizados < 0)
            this.datosactualizados = this.datosactualizados  * -1
            console.log(this.datosactualizados, this.registros)
          this.active=false
          setTimeout(() => {
            if(!this.alert1)
              this.router.navigate(['/admin/portafolios']);
          },8000)

        }
    })
    .catch(err =>{
      console.error(err)
    })

  }
  validMap(){

  }
  registerCart(element){
    return new Promise((resolve, reject) => {
      this.Services.createRegister(element,this.portafolio_id)
        .subscribe(
            data => {
              if(data.success){
                setTimeout(resolve, 4000, "completado");
                
              }
            },
            error => {
              //this.error=true
              console.error(error)
              reject(error)
            });
    });
  }
  return(){
    this.active= false
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
   table=[];
   columns1=[]
   analysis=[]
   segmentation=[]
   endorsement=[]
   strategies=[]
   customerPortal=[]
   validations=[]
   alert1=false
   alert2=false
   alert3=false
  onFileChange(ev) {
    this.alert1=false
   this.active= true
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' , cellDates: true, dateNF: 'dd/mm/yyyy' });
      workBook.SheetNames.forEach(element => {
        
        //console.log("--",element)
      });
      for (let i = 0, l = workBook.SheetNames.length; i < l; i += 1) {
        //this.processSheet(workBook.Sheets[workBook.SheetNames[i]]);
       }
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        this.name=name;
        const sheet = workBook.Sheets[name];
        console.log("----------------",sheet)
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        console.log("----------------",initial)
        return initial;
      }, {});
     //console.log(jsonData[this.name])
      jsonData.Datos=jsonData[this.name]
     //console.log(jsonData.Datos.length)
      this.jsonData=jsonData;
      const dataString = JSON.stringify(jsonData);
      console.log(dataString)
      //document.getElementById('output').innerHTML = jsonData.Datos.length.toString();
      //document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
      //this.setDownload(dataString);
      this.jsonData.Datos.forEach(element => {
        
        if(this.isNew){

         // element.create_at_cr = new Date()
         // element.update_at_cr = new Date()
         // element.active_cr = "true"
        }
        if(!this.isNew){
          element.update_at_cr = new Date()
        }
      });
      setTimeout(() => {
       //console.log("Tiempo")
        let keys=[];
        let i=0
        if(this.jsonData &&this.jsonData.Datos.length){
          console.log("datos",this.jsonData.Datos)
          console.log("jsonData",this.jsonData)
          for(var k in this.jsonData.Datos[0]){
            console.log("code",k)
            if(k.includes('__EMPTY')){
              //this.jsonData = {Datos:[]};
              delete this.jsonData[k]
              this.snackbar.open("Tu cartera actual contiene encabezados vacios, estos campos no se tomaran en cuenta, valida esta información,", 'OK', {
                duration: 10000
              });
            }else{

              keys.push(k);
            }
            i++
          } 
          console.log("datos2",this.jsonData.Datos)
          console.log("jsonData2",this.jsonData)
        

          this.datos=keys;
          this.columns=[];
          this.datos.forEach((element,i) => {
            console.log(element)
                this.type = typeof jsonData.Datos[0][element.toString()]
                console.log("----type-----",this.type, jsonData.Datos[0][element.toString()])
                if(this.type =="object"){

                  let isValidDate = Date.parse(jsonData.Datos[0][element.toString()]);
                  console.log("----isValidDate-----",isValidDate)
                  if (!isNaN(isValidDate)) {
                    this.type = "date"
                  }
                }
                if(this.validateEmail(jsonData.Datos[0][element.toString()]))
                this.type = "email"
                if(this.validatePhone(jsonData.Datos[0][element.toString()]))
                  this.type = "phone"
                console.log("----type-----",this.type)
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
            this.endorsement.push({
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
              status: this.type == null?false: true,
              type:this.type 
            });
            
            this.table.push(
              {
                map:element,
                segmentation:this.segmentation[i],
                ejemplo:jsonData.Datos[i][element.toString()],
                strategies:this.strategies[i],
                customerPortal:this.customerPortal[i],
                endorsement:this.endorsement[i],
                validations:this.validations[i]
              })
          });
          if(this.isNew=="false"){
            console.log("Es False")
             this.dataMapeo.forEach(element => {
               const index = this.datos.findIndex((val) => {
                return val === element});
               if(index==-1){
                //console.log(element)
                 this.alert1=true
                 return;
               }
             });
           }
        }
        
       //console.log(this.map)
        this.jsDatos =this.jsonData.Datos
      }, 300);
     
      
    }
    reader.readAsBinaryString(file);
    setTimeout(() => {
      this.active= false
   //},60000);
    },300)
  }
  valid(){
    
  }
  create(){
    this.alert3=false
    let body={
      portafolio_id:this.portafolio_id,
      datos:this.datos,
      analysis: this.analysis,
      segmentation: this.segmentation,
      endorsement:this.endorsement,
      strategies: this.strategies,
      customerPortal: this.customerPortal,
      validations: this.validations
    }
    const index = this.validations.findIndex((val) => val.type === "id");
    if(index==-1){
      this.alert3=true
      this.snackbar.open("En el MAPEO debe asignar un campo ID Unico.", 'OK', {
        duration: 10000
      });
      return;
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
            this.router.navigate(['/admin/portafolios']);
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
