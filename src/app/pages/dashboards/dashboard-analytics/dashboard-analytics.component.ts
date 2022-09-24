import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icGroup from '@iconify/icons-ic/twotone-group';
import icPageView from '@iconify/icons-ic/twotone-pageview';
import icCloudOff from '@iconify/icons-ic/twotone-cloud-off';
import icTimer from '@iconify/icons-ic/twotone-timer';
import { defaultChartOptions } from '../../../../@vex/utils/default-chart-options';
import { Order, tableSalesData } from '../../../../static-data/table-sales-data';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { WelcomeComponent } from './welcome/welcome.component';
import { NoticeComponent } from './notice/notice.component';
import { CustomerUpdateComponent } from './customer-update/customer-update.component'
import { MatDialog } from '@angular/material/dialog';
import { CustomerUpdateModel } from './customer-update/customer-update.module';
import {CustomerFactComponent} from './customer-fact/customer-update.component'

import {Services} from '../../../Services/services'
@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss']
})
export class DashboardAnalyticsComponent implements OnInit {

  tableColumns: TableColumn<Order>[] = [
    {
      label: '',
      property: 'status',
      type: 'badge'
    },
    {
      label: 'PRODUCT',
      property: 'name',
      type: 'text'
    },
    {
      label: '$ PRICE',
      property: 'price',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'DATE',
      property: 'timestamp',
      type: 'text',
      cssClasses: ['text-secondary']
    }
  ];
  tableData = tableSalesData;

  series: ApexAxisChartSeries = [{
    name: 'Subscribers',
    data: [28, 40, 36, 0, 52, 38, 60, 55, 67, 33, 89, 44]
  }];

  userSessionsSeries: ApexAxisChartSeries = [
    {
      name: 'Users',
      data: [10, 50, 26, 50, 38, 60, 50, 25, 61, 80, 40, 60]
    },
    {
      name: 'Sessions',
      data: [5, 21, 42, 70, 41, 20, 35, 50, 10, 15, 30, 50]
    },
  ];

  salesSeries: ApexAxisChartSeries = [{
    name: 'Sales',
    data: [28, 40, 36, 0, 52, 38, 60, 55, 99, 54, 38, 87]
  }];

  pageViewsSeries: ApexAxisChartSeries = [{
    name: 'Page Views',
    data: [405, 800, 200, 600, 105, 788, 600, 204]
  }];

  uniqueUsersSeries: ApexAxisChartSeries = [{
    name: 'Unique Users',
    data: [356, 806, 600, 754, 432, 854, 555, 1004]
  }];

  uniqueUsersOptions = defaultChartOptions({
    chart: {
      type: 'area',
      height: 100
    },
    colors: ['#ff9800']
  });

  icGroup = icGroup;
  icPageView = icPageView;
  icCloudOff = icCloudOff;
  icTimer = icTimer;
  icMoreVert = icMoreVert;
  info_agency=localStorage.getItem('Agency')
  agency=JSON.parse(this.info_agency);
  
  constructor(private cd: ChangeDetectorRef, private dialog: MatDialog, private Services: Services) { }

  ngOnInit() {
    setTimeout(() => {
      const temp = [
        {
          name: 'Subscribers',
          data: [55, 213, 55, 0, 213, 55, 33, 55]
        },
        {
          name: ''
        }
      ];
      
    }, 3000);
    setTimeout(() => {
      if(this.agency.welcome)
        this.welcomeCustomer()
    }, 10000);
  }

  welcomeCustomer() {
    console.log("entrando")
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */

    this.dialog.open(WelcomeComponent, {
    }).afterClosed().subscribe(welcome => {
      if (welcome) {
        /*this.dialog.open(CustomerUpdateComponent, {
          data: this.agency
        }).afterClosed().subscribe(updatedCustomer => {
          if (updatedCustomer) {
            this.getAgency(this.agency._id);
            this.dialog.open(CustomerFactComponent, {
              data: this.agency
            }).afterClosed().subscribe(factCustomer => {
              if (factCustomer) {
                this.getAgency(this.agency._id);
              }
            });
          }
        });*/
      }
    });
  }
  noticeCustomer() {
    console.log("entrando")
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */

    this.dialog.open(NoticeComponent, {
    }).afterClosed().subscribe(notice => {
      
    });
  }
  

}
