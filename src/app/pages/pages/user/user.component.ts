import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Customer } from './interfaces/customer.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from '../../../../static-data/aio-table-data';
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
import { UserShipingMethodsComponent } from './user-shiping-methods/user-shiping-methods.component';

import { PayComponent } from './pay/pay.component';

export interface PeriodicElement {
  name: string;
  position: number;
  qty: string;
  date: string
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Pago', qty: "1,0079", date: "24/09/2022"},
  {position: 2, name: 'Pago', qty: "4,0026", date: "24/08/2022"},
  {position: 3, name: 'Pago', qty: "6,941", date: "24/07/2022"},
];

@UntilDestroy()
@Component({
  selector: 'vex-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
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
  subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  data$: Observable<Customer[]> = this.subject$.asObservable();
  customers: Customer[];

 
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selection = new SelectionModel<Customer>(true, []);
  searchCtrl = new FormControl();
  displayedColumns: string[] = ['position', 'name', 'weight', 'date'];
  dataSource = ELEMENT_DATA;
  labels = aioTableLabels;
  cantidad=8000
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
  onePay=null
  date=new Date()
  type=2
  pay=false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog) {
  }


  ngOnInit() {
    console.log("holq")
  }
   ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    //console.log("-->",this.dataSource)
  }

  openshippingmethods() {
    this.dialog.open(UserShipingMethodsComponent).afterClosed().subscribe(() => {
      /**
       * Portafolio is the updated portafolio (if the user pressed Save - otherwise it's null)
       */
      
    });
  }

  openpay(){
    this.dialog.open(PayComponent).afterClosed().subscribe(() => {
      /**
       * Portafolio is the updated portafolio (if the user pressed Save - otherwise it's null)
       */
      
    });
  }
  change(x){
    console.log(x)
    if(x==1){
      this.onePay=true
    }else
      this.onePay=false
  }
  pays=[]
  changePay(ev){
    for (let index = 0; index < ev.value; index++) {
      
      this.pays.push({date:new Date(),cant:0})
    }
  }

}
