import {Component, OnInit} from '@angular/core';
import {animations, IComponentView} from '@app/nodachi';
import {ActivatedRoute, Router} from '@angular/router';
import {Map} from 'ol';
import {Point} from 'ol/geom';
import {WKT} from 'ol/format';
import {Vector} from 'ol/layer';
import {NoticicationsConfig} from '@app/admin/noticications-config/noticications-config';
import {NotificationsConfigService} from '@app/nodachi/common-services/admin/notifications_config.service';

@Component({
  selector: 'app-water-source-view',
  templateUrl: './noticications-config-view.component.html',
  animations: animations,
})
export class NoticicationsConfigViewComponent extends IComponentView<NoticicationsConfig> implements OnInit {
  constructor(public router: Router,
              private notificationConfigService: NotificationsConfigService,
              public route: ActivatedRoute) {
    super(notificationConfigService, route, router, 'Configurar Notificación', new NoticicationsConfig());
  }
  ngOnInit() {
    super.ngOnInitObservable().subscribe(model => {
    this.model = model;
    });
  }
}
