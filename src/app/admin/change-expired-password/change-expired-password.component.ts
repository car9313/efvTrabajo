import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {animations} from '@app/nodachi/utils/animations';
import {IPasswordSettings, PasswordSettings} from '../security-settings/security.settings';
import {UserService} from '../user/user.service';
import {LoginService} from '../login/login.service';
import {SecuritySettingsService} from '../security-settings/security-settings.service';
import {Notifications} from '@app/nodachi/services/notifications';

@Component({
  selector: 'app-change-expired-password',
  templateUrl: './change-expired-password.component.html',
  styleUrls: ['./change-expired-password.component.scss'],
  animations: animations,
})
export class ChangeExpiredPasswordComponent implements OnInit {

  model: { old_password: string, password: string, password_confirm: string, token?: string };
  settings: IPasswordSettings;

  constructor(private userService: UserService,
              private loginService: LoginService,
              private securitySettingsService: SecuritySettingsService,
              private router: Router,
              private route: ActivatedRoute,
              private notification: Notifications) {
  }

  ngOnInit() {
    this.model = {old_password: '', password: '', password_confirm: ''};
    this.settings = new PasswordSettings();
    this.securitySettingsService.getSettings().subscribe(settings => {
      this.settings = settings.password_settings;
    });
  }

  save() {
    this.model.token = this.route.snapshot.paramMap.get('token');
    this.userService.changePassword(this.model).subscribe(() => {
      this.router.navigate(['/login']).then();
    }, (error1: HttpErrorResponse) => {
      if (error1.status === 400 && error1.error.ModelState.hasOwnProperty('token')) {
        this.router.navigate(['/login']).then();
      } else {
        this.notification.verification(error1);
      }
    });
  }

}
