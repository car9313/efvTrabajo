import { Component, OnInit } from '@angular/core';
import { IComponentUpdate } from '@app/nodachi/utils/iupdate.component';
import { animations } from '@app/nodachi/utils/animations';
import { UserService } from '../user.service';
import { User } from '../user';
import { Role } from '../../roles/roles';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../roles/roles.service';
import { Utility } from '@app/nodachi';
import {
  IPasswordSettings,
  PasswordSettings,
} from '../../security-settings/security.settings';
import { SecuritySettingsService } from '../../security-settings/security-settings.service';
import { NgChoosenOpts } from '@app/nodachi/components/ng-choosen/ng-choosen-opts';
import { LoginService } from '@app/admin/login/login.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  animations: animations,
})
export class UserEditComponent
  extends IComponentUpdate<User>
  implements OnInit
{
  roles: Array<Role>;
  settings: IPasswordSettings;
  opt_rol: NgChoosenOpts;

  constructor(
    private userService: UserService,
    public route: ActivatedRoute,
    public router: Router,
    private roleService: RoleService,
    private utility: Utility,
    public securitySettingsService: SecuritySettingsService,
    public loginService: LoginService
  ) {
    super(userService, route, router, 'Editar Usuario', new User());
    this.opt_rol = {
      textField: 'name',
      selectionLimit: 0,
      closeOnSelect: false,
    };
    this.settings = new PasswordSettings();
  }

  ngOnInit() {
    this.RolAll();
    this.securitySettingsService.getSettings().subscribe((settings) => {
      this.settings = Object.assign(
        { empty: true },
        settings.password_settings
      );
    });
    this.spin.startLoading();
    this.ngOnInitObservable().subscribe(() => {
      this.model.role_ids = this.model.roles.map((value) => {
        return value.id;
      });
    });
  }

  preSave() {
    if (this.model.username === this.utility.getCurrentUserName()) {
    }
    if (this.model.password == '') {
      this.model.password = null;
      this.model.password_confirmation = null;
    }
  }

  postSave(): void {
    if (this.model.username === this.utility.getCurrentUserName()) {
      this.loginService.logout().subscribe();
    }
  }

  mySave(): void {
    if (this.model.username === this.utility.getCurrentUserName()) {
      const isConfirm: boolean = this.notification.confirm1(
        'Atención!',
        'Si  modifica su propios datos de usuario  la sesión se cierra una ves que los datos son guardados',
        () => {
          this.save();
        }
      );
    } else {
      this.save();
    }
  }
  mySaveNew(): void {
    if (this.model.username === this.utility.getCurrentUserName()) {
      const isConfirm: boolean = this.notification.confirm1(
        'Atención!',
        'Si  modifica su propios datos de usuario  la sesión se cierra una ves que los datos son guardados',
        () => {
          this.saveNew();
        }
      );
    } else {
      this.saveNew();
    }
  }

  RolAll(): void {
    this.roleService.getAll().subscribe((roles) => {
      this.roles = (roles.objects as Role[]).filter(
        (item) => item.editable && item.permissions.length !== 0
      );
      this.spin.stopLoading();
    });
  }
}
