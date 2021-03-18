import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from '../../../../@vex/interfaces/vex-route.interface';
import { SegmentacionComponent } from './segmentacion.component';


const routes: VexRoutes = [
  {
    path: '',
    component: SegmentacionComponent,
    data: {
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegmentacionRoutingModule {
}
