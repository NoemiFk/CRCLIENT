import { Component, OnInit } from '@angular/core';
import icSearch from '@iconify/icons-ic/twotone-search';
import { Link } from '../../../@vex/interfaces/link.interface';
import { trackByRoute } from '../../../@vex/utils/track-by';
import { Icon } from '@visurel/iconify-angular';
import icFlag from '@iconify/icons-ic/twotone-flag';
import icAttachMoney from '@iconify/icons-ic/twotone-attach-money';
import icContactSupport from '@iconify/icons-ic/twotone-contact-support';
import icBook from '@iconify/icons-ic/twotone-book';
import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { stagger40ms } from '../../../@vex/animations/stagger.animation';
import icBeenhere from '@iconify/icons-ic/twotone-beenhere';
import icStars from '@iconify/icons-ic/twotone-stars';
import icBusinessCenter from '@iconify/icons-ic/twotone-business-center';
import { Router } from '@angular/router';

@Component({
  selector: 'vex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})
export class HelpCenterComponent implements OnInit {

  icSearch = icSearch;
  icPhoneInTalk = icPhoneInTalk;
  icMail = icMail;

  links: (Link & { icon: Icon })[] = [
    {
      label: 'Getting Started',
      route: 'getting-started',
      icon: icFlag
    },
    {
      label: 'Pricing & Plans',
      route: 'pricing',
      icon: icAttachMoney
    },
    {
      label: 'FAQ',
      route: 'faq',
      icon: icContactSupport
    },
    {
      label: 'Guides',
      route: 'guides',
      icon: icBook
    }
  ];

  trackByRoute = trackByRoute;
  icBeenhere = icBeenhere;
  icStars = icStars;
  icBusinessCenter = icBusinessCenter;
  constructor(private router: Router,) { }

  ngOnInit() {
  }
  goto(params) {
     if(params =='register'){
      this.router.navigate(['/register']);
     }if(params =='login'){
      this.router.navigate(['/login']);
     }if(params =='registerPago'){
      this.router.navigate(['/register-pago']);
     }
     
   }

}
