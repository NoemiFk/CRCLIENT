import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Communication } from './interfaces/communication.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from '../../../../static-data/aio-table-data';
import { CommunicationCreateUpdateComponent } from './communication-create-update/communication-create-update.component';
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
import {Services} from '../../../Services/services'
import { Router } from '@angular/router';
@UntilDestroy()
@Component({
  selector: 'vex-strategy',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss'],
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
export class CommunicationComponent implements OnInit, AfterViewInit {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Communication[]> = new ReplaySubject<Communication[]>(1);
  data$: Observable<Communication[]> = this.subject$.asObservable();
  customers: Communication[];

  @Input()
  columns: TableColumn<Communication>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Financiera', property: 'name', type: 'object', object:'client_id', visible: true },
    { label: 'Portafolio', property: 'name_portafolio', type: 'object', object:'portafolio_id', visible: true },
    { label: 'SMS', property: 'SMS', type: 'number', visible: true, cssClasses: ['font-medium'] },
    { label: 'Cartas', property: 'Letter', type: 'number', visible: true, cssClasses: ['font-medium'] },
    { label: 'Blaster', property: 'Blaster', type: 'number', visible: true, cssClasses: ['font-medium'] },
    { label: 'E-Mails', property: 'Mail', type: 'number', visible: true, cssClasses: ['font-medium'] },
    { label: 'Notificaciones', property: 'Notification', type: 'number', visible: true, cssClasses: ['font-medium'] },
    { label: 'Demandas', property: 'Demand', type: 'number', visible: true, cssClasses: ['font-medium'] },
    { label: 'Segmentos', property: 'labels', type: 'button', visible: false },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Communication> | null;
  selection = new SelectionModel<Communication>(true, []);
  searchCtrl = new FormControl();

  labels = aioTableLabels;

  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;

  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog,private Services: Services,private router: Router) {
  }

  segmentations: Communication[];
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData(list) {
    return of(list.map(segmentation => segmentation));
    return of(aioTableData.map(customer => new Communication(customer)));
  }

  ngOnInit() {
    //console.log(this.client)
    this.getAgency() 
    this.dataSource = new MatTableDataSource();
    this.getCommunicationsList();
  }

  agency={}
  label = [];
  getAgency() {
    this.Services.getAgency(this.client.agency_id)
    .subscribe(
        data => {
          if(data.success){
            this.agency=data.data
            //console.log(this.agency)
          }
        },
        error => {
          //this.error=true
        });
  }
  addNew(x,a,y,z) {
    console.log("Generar")
    let body={
      portafolio_id:y,
      title:x,
      value:a,
      data:z
    }
    
    this.dialog.open(CommunicationCreateUpdateComponent, {
      data: body
    }).afterClosed().subscribe(createCommunication => {
      /**
       * Communication is the create customer (if the user pressed Save - otherwise it's null)
       */
      if (createCommunication) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        //const index = this.customers.findIndex((existingCommunication) => existingCommunication.id === createCommunication.id);
        //this.customers[index] = new Communication(updatedCommunication);
        this.getCommunicationsList()
        this.subject$.next(this.customers);
      }
    });
  }
  CommunicationsList=[];
  getCommunicationsList() {
    this.Services.getCommunicationList(this.client.agency_id)
    .subscribe(
        data => {
          //console.log("Hola ", data)
          if(data.success){
            this.CommunicationsList=data.data
            this.labels = data.data;
            
            //return this.CommunicationsList;
            this.getData(this.CommunicationsList).subscribe(segmentations => {
              this.subject$.next(segmentations);
            });
            //this.dataSource = new MatTableDataSource();

          this.data$.pipe(
            filter<Communication[]>(Boolean)
          ).subscribe(segmentations => {
            //console.log(segmentations)
            this.segmentations = segmentations;
            this.dataSource.data = segmentations; //this.CommunicationsList;
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

  createCommunication(id) {
    this.router.navigate(['/admin/communicationId/'+id]);
  }

  updateCommunication(customer: Communication) {
    this.dialog.open(CommunicationCreateUpdateComponent, {
      data: customer
    }).afterClosed().subscribe(updatedCommunication => {
      /**
       * Communication is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedCommunication) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.customers.findIndex((existingCommunication) => existingCommunication.id === updatedCommunication.id);
        this.customers[index] = new Communication(updatedCommunication);
        this.subject$.next(this.customers);
      }
    });
  }

  deleteCommunication(customer: Communication) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.customers.splice(this.customers.findIndex((existingCommunication) => existingCommunication.id === customer.id), 1);
    this.selection.deselect(customer);
    this.subject$.next(this.customers);
  }

  deleteCommunications(customers: Communication[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    customers.forEach(c => this.deleteCommunication(c));
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



  onLabelChange(change: MatSelectChange, row: Communication) {
    const index = this.customers.findIndex(c => c === row);
    this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }
}
