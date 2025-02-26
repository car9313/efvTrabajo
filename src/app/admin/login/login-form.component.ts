import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigService } from '@app/nodachi/services/config.services';
import { LoginService } from './login.service';
import { UserLogin } from './login';
import { Notifications } from '@app/nodachi/services/notifications';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login.scss'],
})
export class LoginFormComponent implements OnInit {
  title: string;
  userLogin: UserLogin;
  authenticating: boolean;
  imgList: Array<string>;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private config: ConfigService,
    private tokenStorageService: TokenStorageService,
    private notification: Notifications
  ) {
    this.userLogin = new UserLogin();
    this.authenticating = false;
    this.imgList = [
      'extincion',
      'prevencion',
      'cuadro',
      'informacion-analisis',
      'puesto-mando',
      'tecnologia',
      'transporte',
      'atm',
    ];
  }

  ngOnInit(): void {
    this.title = this.config.getConst('appName');
    this.tokenStorageService.setFingerprint();
  }

  loginUser() {
    this.authenticating = true;
    this.loginService.login(this.userLogin).subscribe(
      () => {
        this.authenticating = false;
        this.router.navigate(['']).then();
      },
      (error: HttpErrorResponse) => {
        this.authenticating = false;
        console.log(error)
        if (error.status === 400) {
          console.log(error.error.errors)
          console.log(error.error.errors.first_login)
          if(error.error.errors.first_login){
           console.log('change-password')
            this.router
              .navigate([
                '/change-password',
                error.headers.get('X-Change-Password-Token'),
              ])
              .then();
          }
          /*else if (){
            this.router
              .navigate([
                '/change-expired-password',
                error.headers.get('X-Change-Password-Token'),
              ])
              .then();
          }*/
           else {
            this.notification.verification(error);
          }
        } else {
          this.notification.verification(error);
        }
      }
    );
  }
}
/*
if (
  (error.error.error === 'FirstLogin' ||
    error.error.error === 'AdminReset') &&
  error.headers.has('X-Change-Password-Token')
) {
  this.router
    .navigate([
      '/change-password',
      error.headers.get('X-Change-Password-Token'),
    ])
    .then();
} else if (
  error.error.error === 'ExpiredPassword' &&
  error.headers.has('X-Change-Password-Token')
) {
  this.router
    .navigate([
      '/change-expired-password',
      error.headers.get('X-Change-Password-Token'),
    ])
    .then();
} else if (error.error.error === 'LockedUser') {
  console.log(error.error.error);
  this.notification.error(
    'Usuario bloqueado por favor contacte con un administrador'
  );
}*/
