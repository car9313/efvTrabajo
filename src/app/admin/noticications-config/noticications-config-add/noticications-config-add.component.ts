import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {animations, IChangedResponse, IComponentCreate, isNullOrUndefined, NgChoosenOpts} from '@app/nodachi/index';
import {Map} from 'ol';
import {Point} from 'ol/geom';
import {WKT} from 'ol/format';
import {NoticicationsConfig} from '@app/admin/noticications-config/noticications-config';
import {NotificationsConfigService} from '@app/nodachi/common-services/admin/notifications_config.service';


@Component( {
  selector: 'app-notification-config-add', templateUrl: './noticications-config-add.component.html', animations,
} )
export class NoticicationsConfigAddComponent extends IComponentCreate<NoticicationsConfig> implements OnInit {
    constructor(private notificacionConfigService: NotificationsConfigService,
                public router: Router
              ) {
    super( notificacionConfigService, router, 'Agregar Configuración', new NoticicationsConfig() );
  }

  ngOnInit(): void {
  }
}
