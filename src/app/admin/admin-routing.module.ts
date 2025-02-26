import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { PermissionComponent } from './permissions/permissions.component';
import { RoleComponent } from './roles/roles.component';
import { RouteParent } from '../nodachi/utils/route-parent';
import { BreadcrumbService } from '../nodachi/components/ng-breadcrumb/breadcrumb.service';

import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { UserPasswordComponent } from './user/user-password/user-password.component';
import { AuditListComponent } from '@app/admin/audit/audit-list/audit-list.component';
import { AuditViewComponent } from '@app/admin/audit/audit-view/audit-view.component';

import { UserViewComponent } from '@app/admin/user/user-view/user-view.component';
import { ImportDataComponent } from '@app/admin/import-data/import-data.component';
import { NoticicationsConfigAddComponent } from '@app/admin/noticications-config/noticications-config-add/noticications-config-add.component';
import {
  NoticicationsConfigListComponent
} from '@app/admin/noticications-config/noticications-config-list/noticications-config-list.component';
import {
  NoticicationsConfigEditComponent
} from '@app/admin/noticications-config/noticications-config-edit/noticications-config-edit.component';
import {
  NoticicationsConfigViewComponent
} from '@app/admin/noticications-config/noticications-config-view/noticications-config-view.component';


const APP_ROUTES_NODACHI: Routes = [
  {
    path: 'notifications_config',
    data: [{}, { breadcrumb: 'Listar', navigation: 'Configurar Notificacion' }],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: NoticicationsConfigListComponent,
        data: [{ resource: 'NotificationConfig', permission: ['read'] },
        { breadcrumb: 'Listar', navigation: 'Configurar Notificacion' }]
      },
      {
        path: 'add',
        component: NoticicationsConfigAddComponent,
        data: [{ resource: 'NotificationConfig', permission: ['create'] },
        { breadcrumb: 'Agregar', navigation: 'Agregar Configuración' }],
      },
      {
        path: 'edit/:id',
        component: NoticicationsConfigEditComponent,
        data: [{ resource: 'NotificationConfig', permission: ['update'] },
        { breadcrumb: 'Editar', navigation: 'Editar Configuración' }]
      },
      {
        path: 'view/:id',
        component: NoticicationsConfigViewComponent,
        data: [{ resource: 'NotificationConfig', permission: ['read'] },
        {
          breadcrumb: 'Detalles', navigation: 'Detalles Configuración de Notificación'
        }]
      }
    ]
  },
  {
    path: 'users',
    data: [{}, { breadcrumb: 'Listar', navigation: 'Usuarios' }],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: UserListComponent,
        data: [{ resource: 'User', permission: ['read'] },
        { breadcrumb: 'Listar', navigation: 'Usuarios' }]
      },
      {
        path: 'add',
        component: UserAddComponent,
        data: [{ resource: 'User', permission: ['create'] },
        { breadcrumb: 'Agregar', navigation: 'Agregar Usuario' }],
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'edit/:id',
        component: UserEditComponent,
        data: [{ resource: 'User', permission: ['update'] },
        { breadcrumb: 'Editar', navigation: 'Editar Usuario' }]
      },
      {
        path: 'view/:id',
        component: UserViewComponent,
        data: [{ resource: 'User', permission: ['read'] },
        { breadcrumb: 'Detalles', navigation: 'Detalles Usuario' }]
      },
      {
        path: 'change_password',
        component: UserPasswordComponent,
        data: [{}, { breadcrumb: 'Editar', navigation: 'Cambiar Contraseña' }]
      }
    ]
  },
  {
    path: 'permisos',
    component: PermissionComponent,
    data: [{ resource: 'Role', permission: ['read'] }, { breadcrumb: 'Permisos' }]
  },
  {
    path: 'permisos/:id',
    component: PermissionComponent,
    data: [{ resource: 'Role', permission: ['read'] }, { breadcrumb: 'Permisos' }]
  },
  {
    path: 'roles',
    component: RoleComponent,
    data: [{ resource: 'Role', permission: ['read'] }, { breadcrumb: 'Roles' }]
  },
  {
    path: 'security_settings',
    component: SecuritySettingsComponent,
    data: [{ resource: 'SecuritySettings', permission: ['update'] },
    { breadcrumb: 'Configuración de seguridad' }]
  },
  {
    path: 'audits',
    data: [{}, { breadcrumb: 'Registro de eventos', navigation: 'Registro de eventos' }],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: AuditListComponent,
        data: [{ resource: 'Audit', permission: ['read'] }, {
          breadcrumb: 'Listar',
          navigation: 'Registro de eventos'
        }]
      },
      {
        path: 'view/:id',
        component: AuditViewComponent,
        data: [{ resource: 'Audit', permission: ['read'] },
        { breadcrumb: 'Detalles', navigation: 'Detalles de evento' }]
      }]
  },
  {
    path: 'import',
    component: ImportDataComponent,
    data: [{ resource: 'Codif', permission: ['update'] }, { breadcrumb: 'Importación' }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(APP_ROUTES_NODACHI)],
  exports: [RouterModule]
})

export class AdminRoutingModule extends RouteParent {
  constructor(public breadcrumbService: BreadcrumbService) {
    super(breadcrumbService, '/admin', 'Administración', APP_ROUTES_NODACHI);
    this.breadcrumbService.hideRouteRegex('dashboard/edit/[0-9]+$');
    this.breadcrumbService.hideRouteRegex('dashboard/edit$');
  }
}
