import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Portafolio } from './interfaces/Portafolio.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from '../../../../static-data/aio-table-data';
import { PortafolioCreateUpdateComponent } from './portafolio-create-update/portafolio-create-update.component';
import { PortafolioDeleteComponent } from './portafolio-delete/portafolio-delete.component';
import { MapUpdateComponent } from './mapeo-update/mapeo-update.component';
import { Router } from '@angular/router';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icUpload from '@iconify/icons-ic/file-upload';
import icload from '@iconify/icons-ic/update';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icList from '@iconify/icons-ic/twotone-list';
import icPay from '@iconify/icons-ic/twotone-payment';
import icPromisses from '@iconify/icons-ic/twotone-list-alt';
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

import {Services} from '../../../Services/services'


@UntilDestroy()
@Component({
  selector: 'vex-aio-table',
  templateUrl: './portafolios.component.html',
  styleUrls: ['./portafolios.component.scss'],
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
export class AioTableComponent implements OnInit, AfterViewInit {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Portafolio[]> = new ReplaySubject<Portafolio[]>(1);
  data$: Observable<Portafolio[]> = this.subject$.asObservable();
  portafolios: Portafolio[];
  PortafoliosList:[];
  selectClient={};



  @Input()
  columns: TableColumn<Portafolio>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Financiera', property: 'name', type: 'object', object:'client_id', visible: true },
    { label: 'Portafolio', property: 'name_portafolio', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Descripción', property: 'description', type: 'text', visible: false },
    { label: 'Mapeo', property: 'map', type: 'boolean', visible: true },
    { label: 'Fecha', property: 'updatemap', type: 'date', visible: true },
    { label: 'Registros', property: 'register', type: 'text', visible: true },
    { label: 'Actualización de  información', property: 'actions1', type: 'button', visible: true },
    { label: 'Alta/Actualización de portafolio', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Portafolio> | null;
  selection = new SelectionModel<Portafolio>(true, []);
  searchCtrl = new FormControl();

  labels = aioTableLabels;

  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icUpload=icUpload;
  icload=icload;
  icFilterList = icFilterList;
  icPromisses= icPromisses;
  icPay=icPay;
  icList=icList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  // User 
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  client_id=""
  agency={}
  agency_id=""
  CustomersList=[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog,  private Services: Services,private router: Router) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData(list) {
    //console.log("-->",list)
    return of(list.map(portafolio => portafolio));
  }
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
  getAgency() {
   //console.log("Clientt",this.client.agency_id)
    this.Services.getAgency(this.client.agency_id)
    .subscribe(
        data => {
          if(data.success){
            this.agency=data.data
           //console.log("----",this.agency)
            //this.agency_id=data.data._id;
           
          }
        },
        error => {
          //this.error=true
        });
  }
  getPortafoliosListAgency() {
   //console.log("Agency   ------", this.client.agency_id)
    this.Services.getPortafoliosListAgency(this.client.agency_id)
    .subscribe(
        data => {
          if(data.success){
            this.PortafoliosList=data.data
            
            //return this.PortafoliosList;
            this.getData(this.PortafoliosList).subscribe(portafolios => {
              this.subject$.next(portafolios);
            });
            //this.dataSource = new MatTableDataSource();

          this.data$.pipe(
            filter<Portafolio[]>(Boolean)
          ).subscribe(portafolios => {
            //console.log(portafolios)
            this.portafolios = portafolios;
            this.dataSource.data = portafolios; //this.PortafoliosList;
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
  getPortafoliosList(client_id) {
   //console.log("GET PORTAFOLOS",this.client.agency_id, client_id)
    this.Services.getPortafoliosList(client_id)
    .subscribe(
        data => {
          //console.log("Portafolios ", data)
          if(data.success){
            this.PortafoliosList=data.data
            
            //return this.PortafoliosList;
            this.getData(this.PortafoliosList).subscribe(portafolios => {
              this.subject$.next(portafolios);
            });
            //this.dataSource = new MatTableDataSource();

          this.data$.pipe(
            filter<Portafolio[]>(Boolean)
          ).subscribe(portafolios => {
            //console.log(portafolios)
            this.portafolios = portafolios;
            this.dataSource.data = portafolios; //this.PortafoliosList;
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

  ngOnInit() {
   //console.log("Clientt",this.client)
    this.dataSource = new MatTableDataSource();
    this.getAgency() 
    this.getPortafoliosListAgency();
    this.getCustomersList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createPortafolio() {
    this.dialog.open(PortafolioCreateUpdateComponent).afterClosed().subscribe((portafolio: Portafolio) => {
      /**
       * Portafolio is the updated portafolio (if the user pressed Save - otherwise it's null)
       */
      if (portafolio) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.getPortafoliosListAgency();
      }
    });
  }

  updatePortafolio(portafolio: Portafolio) {
    this.dialog.open(PortafolioCreateUpdateComponent, {
      data: portafolio
    }).afterClosed().subscribe(updatedPortafolio => {
      /**
       * Portafolio is the updated portafolio (if the user pressed Save - otherwise it's null)
       */
      if (updatedPortafolio) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.portafolios.findIndex((existingPortafolio) => existingPortafolio._id === updatedPortafolio._id);
        this.portafolios[index] = new Portafolio(updatedPortafolio);
        this.subject$.next(this.portafolios);
      }
    });
  }

  deletePortafolio(portafolio: Portafolio) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */

    this.dialog.open(PortafolioDeleteComponent, {
      data: portafolio
    }).afterClosed().subscribe(updatedPortafolio => {
      /**
       * Portafolio is the updated portafolio (if the user pressed Save - otherwise it's null)
       */
      if (updatedPortafolio) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.portafolios.splice(this.portafolios.findIndex((existingPortafolio) => existingPortafolio._id === portafolio._id), 1);
        this.selection.deselect(portafolio);
        this.subject$.next(this.portafolios);
      }
    });
  }

  deletePortafolios(portafolios: Portafolio[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    portafolios.forEach(c => this.deletePortafolio(c));
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

  onLabelChange(change: MatSelectChange, row: Portafolio) {
    const index = this.portafolios.findIndex(c => c === row);
    //this.portafolios[index].labels = change.value;
    this.subject$.next(this.portafolios);
  }
  onChangeClient(x){
   //console.log(x)
    let client_id=x.value;
    this.getPortafoliosList(client_id)
  }
  create(id){
    this.router.navigate(['/admin/map/'+id+'/'+true]);
  }
  upload(id){
    this.router.navigate(['/admin/map/'+id+'/'+false]);
  }
  uploadMap(portafolio: Portafolio) {
    console.log(portafolio)
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */

    this.dialog.open(MapUpdateComponent, {
      data: portafolio
    }).afterClosed().subscribe(MapUpdate => {
      /**
       * Portafolio is the updated portafolio (if the user pressed Save - otherwise it's null)
       */
      if (MapUpdate) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
      }
    });
  }
}
