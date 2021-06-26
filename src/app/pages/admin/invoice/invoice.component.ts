import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Invoice } from './interfaces/invoice.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from '../../../../static-data/aio-table-data';
//import { InvoiceCreateUpdateComponent } from './invoice-create-update/invoice-create-update.component';
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
import icEye from '@iconify/icons-ic/sharp-view-list';
import icChek from '@iconify/icons-ic/check-circle';
import icDonwload from '@iconify/icons-ic/file-download';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import {Services} from '../../../Services/services'
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@UntilDestroy()
@Component({
  selector: 'vex-strategy',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
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
export class InvoiceComponent implements OnInit, AfterViewInit {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Invoice[]> = new ReplaySubject<Invoice[]>(1);
  data$: Observable<Invoice[]> = this.subject$.asObservable();
  customers: Invoice[];

  @Input()
  columns: TableColumn<Invoice>[] = [
    { label: 'Fecha', property: 'created', type: 'date', visible: true },

    { label: 'Vista Preva', property: 'status', type: 'object', object:'preview', visible: true },
    { label: 'CFDI', property: 'UUID', type: 'object', object:'invoice', visible: true, cssClasses: ['font-medium'] },
    { label: 'PPD', property: 'folio',type: 'object', object:'ppd', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Invoice> | null;
  selection = new SelectionModel<Invoice>(true, []);
  searchCtrl = new FormControl();

  labels = aioTableLabels;

  icPhone = icPhone;
  icEye =icEye
  icChek=icChek
  icDonwload =icDonwload
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;

  email2=""
  email1=""
  cfdiUse=""
  paymentForm=""
  bussinesName=""
  rfc=""
  info_agency=localStorage.getItem('Agency')
  agency=JSON.parse(this.info_agency);
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(private Services: Services,private router: Router,private route:ActivatedRoute,) {
  }
  
  client_id = this.route.snapshot.params.id;
  segmentations: Invoice[];
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData(list) {
    return of(list.map(segmentation => segmentation));
    return of(aioTableData.map(customer => new Invoice(customer)));
  }

  ngOnInit() {
    console.log(this.agency)
    this.email2=this.agency.email2
    this.email1=this.agency.email1
    this.cfdiUse=this.agency.cfdiUse
    this.paymentForm=this.agency.paymentForm
    this.bussinesName=this.agency.bussinesName
    this.rfc=this.agency.RFC
    this.dataSource = new MatTableDataSource();
    this.getInvoice();
  }

  
  label = [];
 
  Invoice={
    client_id:"",
    Letter:[],
    SMS: [],
    Blaster: [],
    Mail: [],
    Notification: [],
    Demand: []
  };
  latters=[]
  getInvoice() {
    this.Services.getInvoice(this.agency._id)
    .subscribe(
        data => {
          //console.log("Hola ", data)
          if(data.success){
            this.Invoice=data.data
            console.log("----------*",this.Invoice)
                //return this.InvoicesList;
              this.getData(this.Invoice).subscribe(latters => {
                this.subject$.next(latters);
              });
              //this.dataSource = new MatTableDataSource();
              this.data$.pipe(
                filter<Invoice[]>(Boolean)
              ).subscribe(latters => {
                //console.log(latters)
                this.latters = latters;
                this.dataSource.data = latters; //this.InvoicesList;
                console.log("----------*",this.dataSource)
              });
              this.searchCtrl.valueChanges.pipe(
                untilDestroyed(this)
              ).subscribe(value => this.onFilterChange(value));
                //this.ClientAddList=data.data
                ////console.log("--",this.usersList)
           
            }
            
        },
        error => {
          //this.error=true
        });
  }
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createInvoice() {
   
  }

  updateInvoice(customer) {
    console.log(customer)
    customer.client=this.Invoice.client_id;
   
  }

  deleteInvoice(customer: Invoice) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.customers.splice(this.customers.findIndex((existingInvoice) => existingInvoice.id === customer.id), 1);
    this.selection.deselect(customer);
    this.subject$.next(this.customers);
  }

  deleteInvoices(customers: Invoice[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    customers.forEach(c => this.deleteInvoice(c));
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


  onLabelChange(change: MatSelectChange, row: Invoice) {
    const index = this.customers.findIndex(c => c === row);
    this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }

  ///////////////////////////
  preview(history_id){
    window.open("http://localhost:3002/facturama/preview/"+this.agency._id+"/"+history_id, '_blank');
  }
  donwload(id){
    window.open("http://localhost:3002/facturama/cfdi/pdf/"+id, '_blank');
    window.open("http://localhost:3002/facturama/cfdi/xml/"+id, '_blank');

  }
  donwloadPPD(id){
    window.open("http://localhost:3002/facturama/cfdi/pdf/"+id, '_blank');
    window.open("http://localhost:3002/facturama/cfdi/xml/"+id, '_blank');

  }
}
