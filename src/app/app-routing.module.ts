import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { VexRoutes } from '../@vex/interfaces/vex-route.interface';
import { AuthGuard } from './Services/AuthGuard';

const routes: VexRoutes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/pages/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HelpCenterModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/pages/auth/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'register-pago',
    loadChildren: () => import('./pages/pages/auth/register-pago/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: '',
    component: CustomLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboards/analytics',
        redirectTo: '/'
      },
      {
        path: '',
        loadChildren: () => import('./pages/dashboards/dashboard-analytics/dashboard-analytics.module').then(m => m.DashboardAnalyticsModule),
      },
      {
        path: 'engagement',
        loadChildren: () => import('./pages/pages/pricing/pricing.module').then(m => m.PricingModule)
      },
      {
        path: 'apps',
        children: [
          {
            path: 'chat',
            loadChildren: () => import('./pages/apps/chat/chat.module').then(m => m.ChatModule),
            data: {
              toolbarShadowEnabled: true
            }
          },
          {
            path: 'mail',
            loadChildren: () => import('./pages/apps/mail/mail.module').then(m => m.MailModule),
            data: {
              toolbarShadowEnabled: true,
              scrollDisabled: true
            }
          },
          {
            path: 'social',
            loadChildren: () => import('./pages/apps/social/social.module').then(m => m.SocialModule)
          },
          {
            path: 'contacts',
            loadChildren: () => import('./pages/apps/contacts/contacts.module').then(m => m.ContactsModule)
          },
          {
            path: 'calendar',
            loadChildren: () => import('./pages/apps/calendar/calendar.module').then(m => m.CalendarModule),
            data: {
              toolbarShadowEnabled: true
            }
          },
          {
            path: 'aio-table',
            loadChildren: () => import('./pages/apps/aio-table/aio-table.module').then(m => m.AioTableModule),
          },
          {
            path: 'customers',
            loadChildren: () => import('./pages/admin/customers/aio-table.module').then(m => m.AioTableModule),
          },
          {
            path: 'help-center',
            loadChildren: () => import('./pages/apps/help-center/help-center.module').then(m => m.HelpCenterModule),
          },
          {
            path: 'scrumboard',
            loadChildren: () => import('./pages/apps/scrumboard/scrumboard.module').then(m => m.ScrumboardModule),
          },
          {
            path: 'editor',
            loadChildren: () => import('./pages/apps/editor/editor.module').then(m => m.EditorModule),
          },
        ]
      },
      {
        path: 'admin',
        children: [
         
          {
            path: 'customers',
            loadChildren: () => import('./pages/admin/customers/aio-table.module').then(m => m.AioTableModule),
          },
          {
            path: 'portafolios',
            loadChildren: () => import('./pages/admin/portafolios/portafolios.module').then(m => m.AioTableModule),
          },
          {
            path: 'portafoliosId/:id',
            loadChildren: () => import('./pages/admin/portafoliosId/portafolios.module').then(m => m.AioTableModule),
          },
          {
            path: 'map/:id/:isNew',
            loadChildren: () => import('./pages/admin/map/map.module').then(m => m.MapModule),
          },
          {   
            path: 'analysis',
            loadChildren: () => import('./pages/admin/analysis/analysis.module').then(m => m.AnalysisModule),
          },
          {
            path: 'segmentation',
            loadChildren: () => import('./pages/admin/segmentation/segmentation.module').then(m => m.SegmentationModule),
          },
          {
            path: 'segmentationSingle/:id/:index',
            loadChildren: () => import('./pages/admin/segmentationSingle/segmentation.module').then(m => m.SegmentationModule),
          },
          {
            path: 'communication',
            loadChildren: () => import('./pages/admin/communication/communication.module').then(m => m.CommunicationModule),
          },
          {
            path: 'communicationId/:id',
            loadChildren: () => import('./pages/admin/communicationId/communication.module').then(m => m.CommunicationModule),
          },
          {
            path: 'strategyId',
            loadChildren: () => import('./pages/admin/strategyId/strategy.module').then(m => m.StrategyModule),
          },
          {
            path: 'strategy',
            loadChildren: () => import('./pages/admin/strategy/strategy.module').then(m => m.StrategyModule),
          },
          {
            path: 'invoice',
            loadChildren: () => import('./pages/admin/invoice/invoice.module').then(m => m.InvoiceModule),
          },
          {
            path: 'generalSettings',
            loadChildren: () => import('./pages/admin/general-settings/general-settings.module').then(m => m.GeneralSettingsModule),
          },
        ]
      },
      {
        path: 'pages',
        children: [
          {
            path: 'pricing',
            loadChildren: () => import('./pages/pages/pricing/pricing.module').then(m => m.PricingModule)
          },
          {
            path: 'faq',
            loadChildren: () => import('./pages/pages/faq/faq.module').then(m => m.FaqModule)
          },
          {
            path: 'guides',
            loadChildren: () => import('./pages/pages/guides/guides.module').then(m => m.GuidesModule)
          },
          {
            path: 'invoice1',
            loadChildren: () => import('./pages/pages/invoice/invoice.module').then(m => m.InvoiceModule)
          },
          {
            path: 'error-404',
            loadChildren: () => import('./pages/pages/errors/error-404/error-404.module').then(m => m.Error404Module)
          },
          {
            path: 'error-500',
            loadChildren: () => import('./pages/pages/errors/error-500/error-500.module').then(m => m.Error500Module)
          }
        ]
      },
      {
        path: 'ui',
        children: [
          {
            path: 'components',
            loadChildren: () => import('./pages/ui/components/components.module').then(m => m.ComponentsModule),
          },
          {
            path: 'forms/form-elements',
            loadChildren: () => import('./pages/ui/forms/form-elements/form-elements.module').then(m => m.FormElementsModule),
            data: {
              containerEnabled: true
            }
          },
          {
            path: 'forms/form-wizard',
            loadChildren: () => import('./pages/ui/forms/form-wizard/form-wizard.module').then(m => m.FormWizardModule),
            data: {
              containerEnabled: true
            }
          },
          {
            path: 'icons',
            loadChildren: () => import('./pages/ui/icons/icons.module').then(m => m.IconsModule)
          },
          {
            path: 'page-layouts',
            loadChildren: () => import('./pages/ui/page-layouts/page-layouts.module').then(m => m.PageLayoutsModule),
          },
        ]
      },
      {
        path: 'documentation',
        loadChildren: () => import('./pages/documentation/documentation.module').then(m => m.DocumentationModule),
      },
      {
        path: '**',
        loadChildren: () => import('./pages/pages/errors/error-404/error-404.module').then(m => m.Error404Module)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
