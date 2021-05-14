import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import icBookmarks from '@iconify/icons-ic/twotone-bookmarks';
import emojioneUS from '@iconify/icons-emojione/flag-for-flag-united-states';
import emojioneDE from '@iconify/icons-emojione/flag-for-flag-germany';
import icMenu from '@iconify/icons-ic/twotone-menu';
import { ConfigService } from '../../services/config.service';
import { map } from 'rxjs/operators';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icAssignmentTurnedIn from '@iconify/icons-ic/twotone-assignment-turned-in';
import icBallot from '@iconify/icons-ic/twotone-ballot';
import icDescription from '@iconify/icons-ic/twotone-description';
import icAssignment from '@iconify/icons-ic/twotone-assignment';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { NavigationService } from '../../services/navigation.service';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { PopoverService } from '../../components/popover/popover.service';
import { MegaMenuComponent } from '../../components/mega-menu/mega-menu.component';
import icSearch from '@iconify/icons-ic/twotone-search';
import * as moment from 'moment';
@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow: boolean;

  navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
  isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
  isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
  isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));

  icSearch = icSearch;
  icBookmarks = icBookmarks;
  emojioneUS = emojioneUS;
  emojioneDE = emojioneDE;
  icMenu = icMenu;
  icPersonAdd = icPersonAdd;
  icAssignmentTurnedIn = icAssignmentTurnedIn;
  icBallot = icBallot;
  icDescription = icDescription;
  icAssignment = icAssignment;
  icReceipt = icReceipt;
  icDoneAll = icDoneAll;
  icArrowDropDown = icArrowDropDown;

  constructor(private layoutService: LayoutService,
              private configService: ConfigService,
              private navigationService: NavigationService,
              private popoverService: PopoverService) { }

  info_admin=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_admin);
  info_plan=localStorage.getItem('Plan')
  plan=JSON.parse(this.info_plan);
  info_agency=localStorage.getItem('Agency')
  agency=JSON.parse(this.info_agency);
  days=8;
  ngOnInit() {
   //console.log("Client",this.client)
   //console.log("Agencia",this.agency)
   //console.log("Plan",this.plan)
    
    if(this.plan && this.agency.contract.type=='test')
    this.calculate()
    if(this.days>=1) this.noticeCustomer()
  }
  noticeCustomer() {
    console.log("entrando")
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */

    /*this.dialog.open(NoticeComponent, {
    }).afterClosed().subscribe(notice => {
      
    });*/
  }
  calculate(){
    let dateRegister= new Date(this.client.created);
   //console.log(this.plan.trialPeriod)
    let newDates= dateRegister.setDate(dateRegister.getDate() + this.plan.trialPeriod.days);
   //console.log(new Date(newDates))
    let fin=new Date(newDates)
    //newDates = new Date(newDates);
    let days=new Date(fin.getDate() - dateRegister.getDate());
   //console.log(days)
    var fecha1 = moment();
    var fecha2 = moment(fin);
    this.days=fecha2.diff(fecha1, 'days')

console.log(fecha2.diff(fecha1, 'days'), ' dias de diferencia');
  }
  

  openQuickpanel() {
    this.layoutService.openQuickpanel();
  }

  openSidenav() {
    this.layoutService.openSidenav();
  }

  openMegaMenu(origin: ElementRef | HTMLElement) {
    this.popoverService.open({
      content: MegaMenuComponent,
      origin,
      position: [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]
    });
  }

  openSearch() {
    this.layoutService.openSearch();
  }
}
