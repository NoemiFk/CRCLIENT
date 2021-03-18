import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from '../../../../@vex/interfaces/vex-route.interface';
import { BriefcaseComponent } from './briefcase.component';


const routes: VexRoutes = [
  {
    path: '',
    component: BriefcaseComponent,
    data: {
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BriefcaseRoutingModule {
}
