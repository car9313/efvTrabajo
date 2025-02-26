import {Component} from '@angular/core';
import {animations, IComponentView} from '@app/nodachi';
import {Solicitud} from '@app/efv/solicitudes/solicitud';
import {ActivatedRoute, Router} from '@angular/router';
import {SolicitudService} from '@app/efv/solicitudes/solicitud.service';

@Component({
  selector: 'app-solicitudes-view',
  templateUrl: './solicitudes-view.component.html',
  animations: animations,
})
export class SolicitudesViewComponent extends IComponentView<Solicitud> {

  constructor(public solicitudService: SolicitudService, public router: Router, public route: ActivatedRoute) {
    super(solicitudService, route, router, 'Solicitud', new Solicitud());
  }

}
