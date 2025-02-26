import { Component, OnInit } from '@angular/core';
import { animations, IComponentCreate } from '@app/nodachi';
import { SecuritySettingsService } from './security-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecuritySettings } from './security.settings';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  animations: animations,
})
export class SecuritySettingsComponent
  extends IComponentCreate<SecuritySettings>
  implements OnInit
{
  numberRegex: any = /^[0-9]+$/;

  constructor(
    public securitySettingsService: SecuritySettingsService,
    public loginService: LoginService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(
      securitySettingsService,
      router,
      'Configuración de seguridad',
      new SecuritySettings()
    );
  }

  ngOnInit() {
    this.spin.startLoading();
    try {
      this.securitySettingsService.getSettings().subscribe(
        (res) => {
          this.model = res;
          this.spin.stopLoading();
        },
        () => {
          this.spin.stopLoading();
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  mySave(): void {
    let isConfirm: boolean = this.notification.confirm1(
      'Atención!',
      'Si  modifica los datos de configuración  la sesión se cierra una ves que los datos son guardados',
      () => {
        this.save();
      }
    );
  }

  save() {
    console.log(this.model);
    this.spin.startLoading();
    this.securitySettingsService.create(this.model).subscribe(
      (res) => {
        this.spin.stopLoading();
        this.notification.verification(res);

        this.model = res.body;
        this.loginService.logout().subscribe();
      },
      (error2) => {
        this.spin.stopLoading();
        this.notification.verification(error2);
      }
    );
  }
}
