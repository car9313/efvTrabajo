import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {animations} from '@app/nodachi/utils/animations';
import {IPasswordSettings, PasswordSettings} from '../security-settings/security.settings';
import {UserService} from '../user/user.service';
import {LoginService} from '../login/login.service';
import {SecuritySettingsService} from '../security-settings/security-settings.service';
import {Notifications} from '@app/nodachi/services/notifications';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: animations,
})
export class ChangePasswordComponent implements OnInit {

  model: { old_password?: string, password: string, password_confirm: string, token?: string };
  settings: IPasswordSettings;

  constructor(private userService: UserService,
              private loginService: LoginService,
              private securitySettingsService: SecuritySettingsService,
              private router: Router,
              private route: ActivatedRoute,
              private notification: Notifications) {
  }

  ngOnInit() {
    this.model = {password: '', password_confirm: ''};
    this.settings = new PasswordSettings();
    this.securitySettingsService.getSettings().subscribe(settings => {
      this.settings = settings.password_settings;
    });
  }

  save() {

    this.model.token = this.route.snapshot.paramMap.get('token');
    this.userService.changePassword(this.model).subscribe((resp) => {
      this.notification.verification(resp);
      this.router.navigate(['/login']).then();
    }, (error: HttpErrorResponse) => {
     console.log(error)
      /*if (error.status === 400 && error.error.ModelState.hasOwnProperty('token')) {
        this.router.navigate(['/login']).then();
      } else {
        this.notification.verification(error);
      }*/
      if(error.status === 400){
        this.notification.verification(error);
      }
      else if(error.status===401){
        this.notification.verification(error);
         this.router.navigate(['/login']).then();
      }
    });
  }

}
