import { Component, OnInit, ViewChild } from '@angular/core';
import { animations } from '@app/nodachi/utils/animations';
import { UserService } from '../user.service';
import { IPasswordSettings, PasswordSettings } from '../../security-settings/security.settings';
import { SecuritySettingsService } from '../../security-settings/security-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notifications } from '@app/nodachi';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../../login/login.service';
import { SaicoLayoutService } from '../../saico-layout/saico-layout.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  animations: animations,
})
export class UserPasswordComponent implements OnInit {

  @ViewChild('userForm', { static: true }) form: FormControl;
  model: { old_password?: string, password: string, password_confirm: string, token?: string };
  settings: IPasswordSettings;

  constructor(private userService: UserService,
    private loginService: LoginService,
    private securitySettingsService: SecuritySettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: Notifications,
    private adminService: SaicoLayoutService) {
  }

  ngOnInit() {
    this.adminService.setTitle('Cambiar Contraseña');
    this.model = { old_password: '', password: '', password_confirm: '' };
    this.settings = new PasswordSettings();
    this.securitySettingsService.getSettings().subscribe(settings => {
      this.settings = settings.password_settings;
    });
  }

  save() {
    this.userService.changePassword(this.model).subscribe(() => {
      this.notification.success('Se ha cambiado su contraseña');
      this.form.reset();
      this.router.navigateByUrl('/').then();
    }, (error1: HttpErrorResponse) => {
      this.notification.verification(error1);
    });
  }
  goList(): void {
    this.router.navigateByUrl('/').then();
  }

}
