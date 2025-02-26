import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import {
  LoggedInGuard,
  LoginGuard,
  PageNoAcessComponent,
  PageNotFoundComponent,
} from './nodachi';
import { BreadcrumbService } from './nodachi/components/ng-breadcrumb/breadcrumb.service';
import { RouteParent } from './nodachi/utils/route-parent';
import { ChangePasswordComponent } from './admin/change-password/change-password.component';
import { ChangeExpiredPasswordComponent } from './admin/change-expired-password/change-expired-password.component';
import { SaicoLayoutComponent } from '@app/admin/saico-layout/saico-layout.component';
import { LoginFormComponent } from '@app/admin/login/login-form.component';
import { ReloadComponent } from '@app/system/reload.component';
import { ListNotificationComponent } from '@app/nodachi/components/list-notification/list-notification.component';

const APP_ROUTES: Routes = [
  {
    path: '',
    component: SaicoLayoutComponent,
    canActivateChild: [LoggedInGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: HomeComponent,
        data: [
          { resource: null, permission: ['read'] },
          { breadcrumb: 'Inicio', navigation: 'Inicio' },
        ],
      },
      {
        path: 'notifications',
        component: ListNotificationComponent,
        data: [
          { resource: null, permission: ['read'] },
          { breadcrumb: 'Notificaciones', navigation: 'Notificaciones' },
        ],
      },
      {
        path: 'admin',
        canActivateChild: [LoggedInGuard],
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'nomencladores',
        canActivateChild: [LoggedInGuard],
        loadChildren: () =>
          import('./nomenclature/nomenclature.module').then(
            (m) => m.NomencladorModule
          ),
      },
      {
        path: 'efv',
        canActivateChild: [LoggedInGuard],
        loadChildren: () => import('./efv/efv.module').then((m) => m.EfvModule),
      },
    ],
  },
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'change-password/:token',
    component: ChangePasswordComponent,
  },
  {
    path: 'change-expired-password/:token',
    component: ChangeExpiredPasswordComponent,
  },
  {
    path: 'no_access_page',
    component: PageNoAcessComponent,
  },
  {
    path: 'reload',
    component: ReloadComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, {
      // preloadingStrategy: PreloadAllModules
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule extends RouteParent {
  constructor(public breadcrumbService: BreadcrumbService) {
    super(breadcrumbService, '/', 'Inicio', APP_ROUTES);
    this.breadcrumbService.addFriendlyNameForRoute('/notifications', {
      breadcrumb: 'Notificaciones',
      navigation: 'Notificaciones',
    });
  }
}
