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
import {Services} from '../../../Services/services'
import { Router } from '@angular/router';

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
export class SegmentationComponent implements OnInit, AfterViewInit {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Segmentation[]> = new ReplaySubject<Segmentation[]>(1);
  data$: Observable<Segmentation[]> = this.subject$.asObservable();
  segmentations: Segmentation[];

  info_client=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_client);

  @Input()
  columns: TableColumn<Segmentation>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Financiera', property: 'name', type: 'object', object:'client_id', visible: true },
    { label: 'Portafolio', property: 'name_portafolio', type: 'object', object:'portafolio_id', visible: true },
    { label: 'Registros', property: 'registers', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: '% Segementado', property: 'porcent', type: 'text', visible: true },
    //{ label: 'Segmentos', property: 'segmentation', type: 'text', visible: true },
    { label: 'Segmentos', property: 'labels', type: 'button', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Segmentation> | null;
  selection = new SelectionModel<Segmentation>(true, []);
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
    return of(list.map(segmentation => segmentation));
    return of(aioTableData.map(customer => new Segmentation(customer)));
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
  SegmentationsList=[];
  getSegmentationsList() {
    this.Services.getSegmentationsList(this.client.agency_id)
    .subscribe(
        data => {
          //console.log("Hola ", data)
          if(data.success){
            this.SegmentationsList=data.data
            this.labels = data.data;
            
            //return this.SegmentationsList;
            this.getData(this.SegmentationsList).subscribe(segmentations => {
              this.subject$.next(segmentations);
            });
            //this.dataSource = new MatTableDataSource();

          this.data$.pipe(
            filter<Segmentation[]>(Boolean)
          ).subscribe(segmentations => {
            //console.log(segmentations)
            this.segmentations = segmentations;
            this.dataSource.data = segmentations; //this.SegmentationsList;
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
    this.getSegmentationsList();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createSegmentation() {
    this.dialog.open(SegmentationCreateComponent).afterClosed().subscribe((customer: Segmentation) => {
      /**
       * Segmentation is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        //this.segmentations.unshift(new Segmentation(customer));
        //this.subject$.next(this.segmentations);
        this.getSegmentationsList();
      }
    });
  }

  updateSegmentation(customer: Segmentation) {
    this.dialog.open(SegmentationCreateComponent, {
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
        this.getSegmentationsList();
      }
    });
  }

  Segmentation(id,index){
    let i=parseInt(index)
    this.router.navigate(['/admin/segmentationSingle/'+id+"/"+i]);
  }

  /*addSegmentation(customer: Segmentation) {
    customer.segment= null
    this.dialog.open(SegmentationCreateUpdateComponent, {
      data: customer
    }).afterClosed().subscribe((customer: Segmentation) => {
      /**
       * Segmentation is the updated customer (if the user pressed Save - otherwise it's null)
       */
      //if (customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
       /* this.getSegmentationsList();
      }
    });
  }*/

  editSegmentation(customer: Segmentation, segmentation) {
    customer.segment= segmentation
    this.dialog.open(SegmentationCreateUpdateComponent, {
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
        const index = this.segmentations.findIndex((existingSegmentation) => existingSegmentation.id === updatedSegmentation.id);
        this.segmentations[index] = new Segmentation(updatedSegmentation);
        this.subject$.next(this.segmentations);
      }
    });
  }

  deleteSegmentation(customer: Segmentation) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.segmentations.splice(this.segmentations.findIndex((existingSegmentation) => existingSegmentation.id === customer.id), 1);
    this.selection.deselect(customer);
    this.subject$.next(this.segmentations);
  }

  deleteSegmentations(segmentations: Segmentation[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    segmentations.forEach(c => this.deleteSegmentation(c));
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

  onLabelChange(change: MatSelectChange, row: Segmentation) {
    const index = this.segmentations.findIndex(c => c === row);
    this.segmentations[index].segmentation = change.value;
    this.subject$.next(this.segmentations);
  }
}
