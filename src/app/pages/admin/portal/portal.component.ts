import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Stretegy } from './interfaces/strategy.model';
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
import {Services} from '../../../Services/services'
import { Router } from '@angular/router';
import icInfo from '@iconify/icons-ic/info';

@UntilDestroy()
@Component({
  selector: 'vex-portal',
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
export class PortalComponent implements OnInit, AfterViewInit {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Stretegy[]> = new ReplaySubject<Stretegy[]>(1);
  data$: Observable<Stretegy[]> = this.subject$.asObservable();
  strategys: Stretegy[];
  icInfo=icInfo;
  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);
  html = `
  <p> 
  Muestra el estatus de la estrategia:
<p><b style=" color:red">Rojo</b> = falta definición de una estrategia de gestión</p>
<p><b style=" color:green">Verde</b>  = estrategia de gestión definida </p>


  </p>
  `;
  @Input()
  columns: TableColumn<Stretegy>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Financiera', property: 'name', type: 'object', object:'client_id', visible: true },
    { label: 'Portafolio', property: 'name_portafolio', type: 'object', object:'portafolio_id', visible: true },
    //{ label: 'Segmentos', property: 'strategy', type: 'text', visible: true },
    { label: 'Segmentos', property: 'labels', type: 'button', visible: true,  info: true, text: this.html},
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Stretegy> | null;
  selection = new SelectionModel<Stretegy>(true, []);
  searchCtrl = new FormControl();

  

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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog, private Services: Services,private router: Router) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData(list) {
    return of(list.map(strategy => strategy));
    return of(aioTableData.map(customer => new Stretegy(customer)));
  }
  agency={}
  labels = [];
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
  StretegysList=[];
  getStretegysList() {
    this.Services.getSegmentationsList(this.client.agency_id)
    .subscribe(
        data => {
          //console.log("Hola ", data)
          if(data.success){
            //this.StretegysList=data.data
            this.labels = data.data;
            data.data.forEach(element => {
              if(element.segmentation.length)
              this.StretegysList.push(element)
            });
            //return this.StretegysList;
            this.getData(this.StretegysList).subscribe(strategys => {
              this.subject$.next(strategys);
            });
            //this.dataSource = new MatTableDataSource();

          this.data$.pipe(
            filter<Stretegy[]>(Boolean)
          ).subscribe(strategys => {
            //console.log(strategys)
            this.strategys = strategys;
            this.dataSource.data = strategys; //this.StretegysList;
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
    //console.log(this.client)
    this.getAgency() 
    this.dataSource = new MatTableDataSource();
    this.getStretegysList();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createStretegy() {
    this.dialog.open(StrategyCreateUpdateComponent).afterClosed().subscribe((customer: Stretegy) => {
      /**
       * Stretegy is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        //this.strategys.unshift(new Stretegy(customer));
        //this.subject$.next(this.strategys);
        this.getStretegysList();
      }
    });
  }

  updateStretegy(customer: Stretegy) {
    this.dialog.open(StrategyCreateUpdateComponent, {
      data: customer
    }).afterClosed().subscribe(updatedStretegy => {
      /**
       * Stretegy is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedStretegy) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.getStretegysList();
      }
    });
  }

  Stretegy(id,index){
    let i=parseInt(index)
    this.router.navigate(['/admin/portalId/'+id+"/"+index]);
  }

  /*addStretegy(customer: Stretegy) {
    customer.segment= null
    this.dialog.open(StretegyCreateUpdateComponent, {
      data: customer
    }).afterClosed().subscribe((customer: Stretegy) => {
      /**
       * Stretegy is the updated customer (if the user pressed Save - otherwise it's null)
       */
      //if (customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
       /* this.getStretegysList();
      }
    });
  }*/

  editStretegy(customer: Stretegy, strategy) {
    
    this.dialog.open(StrategyCreateUpdateComponent, {
      data: customer
    }).afterClosed().subscribe(updatedStretegy => {
      /**
       * Stretegy is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedStretegy) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.strategys.findIndex((existingStretegy) => existingStretegy.id === updatedStretegy.id);
        this.strategys[index] = new Stretegy(updatedStretegy);
        this.subject$.next(this.strategys);
      }
    });
  }

  deleteStretegy(customer: Stretegy) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.strategys.splice(this.strategys.findIndex((existingStretegy) => existingStretegy.id === customer.id), 1);
    this.selection.deselect(customer);
    this.subject$.next(this.strategys);
  }

  deleteStretegys(strategys: Stretegy[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    strategys.forEach(c => this.deleteStretegy(c));
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

  onLabelChange(change: MatSelectChange, row: Stretegy) {
    const index = this.strategys.findIndex(c => c === row);
    this.strategys[index].strategy = change.value;
    this.subject$.next(this.strategys);
  }
}
