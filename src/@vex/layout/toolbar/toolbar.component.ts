import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import icBookmarks from '@iconify/icons-ic/twotone-bookmarks';
import emojioneUS from '@iconify/icons-emojione/flag-for-flag-united-states';
import emojioneDE from '@iconify/icons-emojione/flag-for-flag-germany';
import icPortafolio from '@iconify/icons-ic/twotone-folder';
import icMenu from '@iconify/icons-ic/twotone-menu';
import { ConfigService } from '../../services/config.service';
import { map } from 'rxjs/operators';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icAssignmentTurnedIn from '@iconify/icons-ic/twotone-assignment-turned-in';
import icBallot from '@iconify/icons-ic/twotone-ballot';
import icDescription from '@iconify/icons-ic/twotone-description';
import icAssignment from '@iconify/icons-ic/twotone-assignment';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icArrow from '@iconify/icons-ic/twotone-arrow-right';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { NavigationService } from '../../services/navigation.service';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { PopoverService } from '../../components/popover/popover.service';
import { MegaMenuComponent } from '../../components/mega-menu/mega-menu.component';
import icSearch from '@iconify/icons-ic/twotone-search';
import * as moment from 'moment';
import { Router } from '@angular/router';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icMoney from '@iconify/icons-ic/money-off';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import icSegmentation from '@iconify/icons-ic/twotone-pause-circle-outline';
import icPerson from '@iconify/icons-ic/person';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icCompu from '@iconify/icons-ic/computer';
import icGrhap from '@iconify/icons-ic/outline-graphic-eq';
import icChat from '@iconify/icons-ic/twotone-chat';
import { ActivatedRoute } from '@angular/router';

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
  icLayers=icLayers
  icMoney=icMoney
  icAssigment= icAssigment
  icSegmentation=icSegmentation
  icPerson=icPerson
  icSettings=icSettings
  icCompu=icCompu
  icGrhap=icGrhap
  icChat=icChat
  navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
  isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
  isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
  isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));

  icSearch = icSearch;
  icBookmarks = icBookmarks;
  emojioneUS = emojioneUS;
  emojioneDE = emojioneDE;
  icPortafolio = icPortafolio;
  icMenu = icMenu;
  icPersonAdd = icPersonAdd;
  icAssignmentTurnedIn = icAssignmentTurnedIn;
  icBallot = icBallot;
  icDescription = icDescription;
  icAssignment = icAssignment;
  icReceipt = icReceipt;
  icArrow=icArrow;
  icDoneAll = icDoneAll;
  icArrowDropDown = icArrowDropDown;

  constructor(private layoutService: LayoutService,
              private configService: ConfigService,
              private navigationService: NavigationService,
              private popoverService: PopoverService,
              private router: Router) { }

  info_admin=localStorage.getItem('currentAgency')
  client=JSON.parse(this.info_admin);
  info_plan=localStorage.getItem('Plan')
  plan=JSON.parse(this.info_plan);
  info_agency=localStorage.getItem('Agency')
  agency=JSON.parse(this.info_agency);
  days=8;
  color1="primary"
  color2="primary"
  color3="primary"
  color4="primary"
  color5="primary"
  color6="primary"
  ngOnInit() {
    console.log("Ruta",this.router.url);
    switch (this.router.url) {
      case "/admin/portafolios":
        
        this.color2="accent"
        this.color1="primary"
        this.color3="primary"
        this.color4="primary"
        this.color5="primary"
        this.color6="primary"
        break;
        case "/admin/customers":
        
          this.color2="primary"
          this.color1="accent"
          this.color3="primary"
          this.color4="primary"
          this.color5="primary"
          this.color6="primary"
          break;
      case "/admin/segmentation":
        
          this.color1="primary"
          this.color3="accent"
          this.color2="primary"
          this.color4="primary"
          this.color5="primary"
          this.color6="primary"
          break;
      case "/admin/communication":
        
          this.color1="primary"
          this.color4="accent"
          this.color2="primary"
          this.color3="primary"
          this.color5="primary"
          this.color6="primary"
          break;
      

      case "/admin/strategy":
    
        this.color1="primary"
        this.color4="primary"
        this.color2="primary"
        this.color3="primary"
        this.color5="accent"
        this.color6="primary"
        break;

        case "/admin/portal":
    
        this.color1="primary"
        this.color4="primary"
        this.color2="primary"
        this.color3="primary"
        this.color5="primary"
        this.color6="accent"
        break;
    
      default:
        break;
    }
   //console.log("Client",this.client)
   //console.log("Agencia",this.agency)
   //console.log("Plan",this.plan)
    
    if(this.plan && this.agency.contract.type=='test')
    this.calculate()
    if(this.days>=1) this.noticeCustomer()
  }
  href(x){
    this.router.navigate([x]);
  }
  verify(){
    switch (this.router.url) {
      case "/admin/portafolios":
        this.color2="accent"
        this.color1="primary"
        this.color3="primary"
        this.color4="primary"
        this.color5="primary"
        this.color6="primary"
        break;
        case "/admin/customers":
        
          this.color2="primary"
          this.color1="accent"
          this.color3="primary"
          this.color4="primary"
          this.color5="primary"
          this.color6="primary"
          break;
      case "/admin/segmentation":
        
          this.color1="primary"
          this.color3="accent"
          this.color2="primary"
          this.color4="primary"
          this.color5="primary"
          this.color6="primary"
          break;
      case "/admin/communication":
        
          this.color1="primary"
          this.color4="accent"
          this.color2="primary"
          this.color3="primary"
          this.color5="primary"
          this.color6="primary"
          break;
      case "/admin/strategy":
    
          this.color1="primary"
          this.color4="primary"
          this.color2="primary"
          this.color3="primary"
          this.color5="accent"
          this.color6="primary"
          break;
      case "/admin/portal":

        this.color1="primary"
        this.color4="primary"
        this.color2="primary"
        this.color3="primary"
        this.color5="primary"
        this.color6="accent"
        break;
    
      default:
        break;
    }
    return true
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
