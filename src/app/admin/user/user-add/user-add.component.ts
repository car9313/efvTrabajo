import { Component, OnInit } from '@angular/core';
import { IComponentCreate } from '@app/nodachi/utils/icreate.component';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { Role } from '../../roles/roles';
import { RoleService } from '../../roles/roles.service';
import { animations } from '@app/nodachi/utils/animations';
import {
  IPasswordSettings,
  PasswordSettings,
} from '../../security-settings/security.settings';
import { SecuritySettingsService } from '../../security-settings/security-settings.service';
import { NgChoosenOpts } from '@app/nodachi/components/ng-choosen/ng-choosen-opts';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  animations: animations,
})
export class UserAddComponent extends IComponentCreate<User> implements OnInit {
  roles: Array<Role>;
  settings: IPasswordSettings;
  avatarFile: File;
  opt_rol: NgChoosenOpts;
  photo: any;
  user_types: any;

  constructor(
    public userService: UserService,
    public router: Router,
    private roleService: RoleService,
    public securitySettingsService: SecuritySettingsService
  ) {
    super(userService, router, 'Agregar Usuario', new User());
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
      this.settings = settings.password_settings;
    });

    this.userService.getUserTypes().subscribe((resp) => {
      this.user_types = resp;
    });
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
