import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';

@Component({
  selector: 'vex-editor',
  templateUrl: './editor.component.html',
  styleUrls: [
    './editor.component.scss',
    '../../../../../node_modules/quill/dist/quill.snow.css',
    '../../../../@vex/styles/partials/plugins/_quill.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInUp400ms]
})
export class EditorComponent implements OnInit {

  text = ``;
  form = new FormControl(this.text);


  constructor() { }

  ngOnInit() {
    console.log(this.form)
  }
  
  late() {
    console.log("nuevo",this.form)

  }

}
