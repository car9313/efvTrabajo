// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoComponentsModule } from '@app/nodachi/components/no-components.module';

// Services
import { RoleService } from './roles/roles.service';
// Routes
import { AdminRoutingModule } from './admin-routing.module';

// Components
import { UserListComponent } from './user/user-list/user-list.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { RoleComponent } from './roles/roles.component';
import { PermissionComponent } from './permissions/permissions.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { UserPasswordComponent } from './user/user-password/user-password.component';
import { AuditService } from './audit/audit.service';
import { AuditListComponent } from './audit/audit-list/audit-list.component';
import { AuditViewComponent } from './audit/audit-view/audit-view.component';
import { UserViewComponent } from './user/user-view/user-view.component';
import { GridsterModule } from 'angular-gridster2';
import { ImportDataComponent } from './import-data/import-data.component';
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

@NgModule({
  declarations: [
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    UserPasswordComponent,
    RoleComponent,
    PermissionComponent,
    SecuritySettingsComponent,
    AuditListComponent,
    AuditViewComponent,
    UserViewComponent,
    ImportDataComponent,
    NoticicationsConfigListComponent,
    NoticicationsConfigAddComponent,
    NoticicationsConfigEditComponent,
    NoticicationsConfigViewComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    NoComponentsModule,
    GridsterModule
  ],
  providers: [
    RoleService,
    AuditService
  ]
})
export class AdminModule {
}
