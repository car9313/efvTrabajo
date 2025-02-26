import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {animations} from '@app/nodachi/utils/animations.js';
import {NotificationService} from '@app/nodachi/services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IComponentList} from '@app/nodachi/utils/icomponent_list.js';
import {NoticicationsConfig} from '@app/admin/noticications-config/noticications-config';
import {NotificationsConfigService} from '@app/nodachi/common-services/admin/notifications_config.service';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {RowConfig} from '@app/nodachi';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  animations: animations,
  encapsulation: ViewEncapsulation.None
})
export class ListNotificationComponent extends IComponentList implements OnInit {

  configs: Array<NoticicationsConfig>;
  rowConfig: RowConfig;

  constructor(public notificationService: NotificationService,
              public notificationConfigServ: NotificationsConfigService,
              public router: Router,
              public route: ActivatedRoute) {
    super(notificationService, '', 'Notificaciones', router);
    this.configs = [];
    this.redirectToAdd = false;
    this.headers = {created_at: 'Fecha', message: 'Notificación'};
    this.extraHeaders = [
      {
        tooltip: 'Ver',
        icon: 'fa fa-share',
        class: 'btn-link',
        clickAction: this.goTo.bind(this),
      },
      {
        tooltip: 'Marcar como leído',
        icon: (row) => ({'fa fa-eye-slash': !row.read, 'far fa-eye': row.read}),
        class: 'btn-link',
        clickAction: this.markAsRead.bind(this),
      },
      {
        tooltip: 'Eliminar',
        icon: 'fa fa-trash-alt',
        class: 'btn-link text-danger',
        clickAction: this.removeNotification.bind(this),
      },
    ];
    this.rowConfig = {
      class: (row) => ({'table-success font-weight-bold': !row.read}),
    };
  }

  goTo(row) {
    if (!isNullOrUndefined(row.data)) {
      this.spin.startLoading();
      const base = this.getUrl(row);
      this.router.navigate(base).then(() => this.spin.stopLoading());
    }
  }

  getUrl(row): Array<any> {
    const config = this.configs.find(item => item.type === row.type);
    if (!isNullOrUndefined(config)) {
      const regex = /^\${([\w|.]+)}$/;
      const base = config.url_pattern.split('/');
      base.forEach((item, index, array) => {
          const variable = regex.exec(item);
          if (!isNullOrUndefined(variable)) {
            if (row.data.hasOwnProperty(variable[1])) {
              array[index] = row.data[variable[1]];
            }
          }
          if (item === '') {
            array[index] = '/';
          }
        },
      );
      return base;
    }
    return [];
  }

  markAsRead(row) {
    if (!row.read) {
      this.notificationService.markAsRead(row.id)
        .subscribe(resp => {
          row.read = true;
          // this.search();
          // this.notification.success('Notificación marcada como leída');
        }, error => this.notification.verification(error));
    }
  }

  removeNotification(row) {
    this.removeConfirm(row);
  }

  markAsReadAll() {
    this.notificationService.markAsReadAll()
      .subscribe(resp => {
        this.search();
        this.notification.success('Notificaciones marcadas como leídas');
      }, error => this.notification.verification(error));
  }

  ngOnInit() {
    this.notificationConfigServ.getAll()
      .subscribe(resp => this.configs = resp.objects, error => this.configs = []);
    super.ngOnInit();
  }
}
