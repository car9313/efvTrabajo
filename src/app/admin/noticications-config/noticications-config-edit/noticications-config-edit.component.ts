import {Component, OnInit} from '@angular/core';
import {animations, IComponentUpdate} from '@app/nodachi/index';
import {NoticicationsConfig} from '../noticications-config';
import {ActivatedRoute, Router} from '@angular/router';
import {Map} from 'ol';
import {Point} from 'ol/geom';
import {WKT} from 'ol/format';
import {NotificationsConfigService} from '@app/nodachi/common-services/admin/notifications_config.service';


@Component({
  selector: 'app-notification-config-edit',
  templateUrl: './noticications-config-edit.component.html',
  animations,
})
export class NoticicationsConfigEditComponent extends IComponentUpdate<NoticicationsConfig> implements OnInit {
  constructor(private  notificacionConfigService: NotificationsConfigService,
              public router: Router,
              public route: ActivatedRoute) {
    super(notificacionConfigService, route, router, 'Editar Configuración de Notificacion', new NoticicationsConfig());
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  goList(): void {
    this.cancelingComponent = true;
    const listUrl: string = this.router.url.replace(/\/edit\/\w+$/, '/list');
    this.router.navigateByUrl(listUrl).then(
      () => {
        this.cancelingComponent = false;
      },
    );
  }
}
