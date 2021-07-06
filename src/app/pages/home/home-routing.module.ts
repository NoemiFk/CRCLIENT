import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelpCenterComponent } from './home.component';
import { VexRoutes } from '../../../@vex/interfaces/vex-route.interface'


const routes: VexRoutes = [
  {
    path: '',
    component: HelpCenterComponent,
    data: {
      toolbarShadowEnabled: true
    },
    children: [
      {
        path: '',
        redirectTo: 'getting-started'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpCenterRoutingModule {
}
