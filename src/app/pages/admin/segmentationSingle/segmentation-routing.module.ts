import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from '../../../../@vex/interfaces/vex-route.interface';
import { SegmentationComponent } from './segmentation.component';


const routes: VexRoutes = [
  {
    path: '',
    component: SegmentationComponent,
    data: {
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegmentationRoutingModule {
}
