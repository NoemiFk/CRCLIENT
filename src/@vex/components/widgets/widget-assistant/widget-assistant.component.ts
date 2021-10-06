import { Component, OnInit } from '@angular/core';
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';

@Component({
  selector: 'vex-widget-assistant',
  templateUrl: './widget-assistant.component.html',
  styleUrls: ['./widget-assistant.component.scss']
})
export class WidgetAssistantComponent implements OnInit {

  icCheckCircle = icCheckCircle;

  constructor() { }
  days=localStorage.getItem('days')
  x = false;
  day=0

  ngOnInit() {
    this.x = false
    if(this.day==10 || this.day==3 ||this.day==1 || this.day==0)
      this.x = true

    this.day = parseInt(this.days)
    console.log("--",this.day)
    
  }

}
