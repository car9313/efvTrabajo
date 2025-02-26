import {Component, OnInit} from '@angular/core';
import {animations, ConfigService, IComponentList, isNullOrUndefined, Utility} from '@app/nodachi/index';
import {Router} from '@angular/router';
import {NotificationsConfigService} from '@app/nodachi/common-services/admin/notifications_config.service';

@Component({
  selector: 'app-notification-config-list',
  templateUrl: '../../../system/list.component.html',
  animations: animations,
})
export class NoticicationsConfigListComponent extends IComponentList implements OnInit {

  constructor(private notificacionConfigService: NotificationsConfigService,
              public utility: Utility,
              public configService: ConfigService,
              public router: Router) {
    super(notificacionConfigService, 'NotificationConfig', 'Configuración de Notificaciones', router);
    this.showPrint = false;
    this.headers = {
      type: 'Tipo',
      description: 'Descripción',
      url_pattern: 'URL',
    };
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public removeConfirm(object: any): void {
    const id = isNullOrUndefined(object.type) ? object.item.type : object.type;
    this.notification.removeConfirm(() => this.remove(id));
  }

  public update(object: any): void {
    const updateUrl: string = this.router.url.replace(/\/list$/, '/edit') + '/' + object.type.toString();
    this.router.navigateByUrl(updateUrl).then();
  }

  public view(object: any): void {
    const viewUrl: string = this.router.url.replace(/\/list$/, '/view') + '/' + object.type.toString();
    this.router.navigateByUrl(viewUrl).then();
  }
}
