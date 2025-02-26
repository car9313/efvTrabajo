import {Component, OnInit} from '@angular/core';
import {animations, IComponentList} from '@app/nodachi';
import {HistorialService} from '@app/efv/historial/historial.service';
import {Router} from '@angular/router';
import {Status} from '@app/efv/historial/historial-list/status';

@Component({
  selector: 'app-historial-list',
  templateUrl: './historial-list.component.html',
  animations: animations,
})
export class HistorialListComponent extends IComponentList implements OnInit {
  public efv: string;

  constructor(public historialService: HistorialService, public router: Router) {
    super(historialService, 'EFv', 'Historial', router);
    this.headers = {numero_fv: '#Efv', passaporte: 'Pasaporte', id_solicitud: 'Id Solicitud'};
  }

  ngOnInit() {
    super.ngOnInit(false);
  }

  view(object: any): void {
    const viewUrl: string =
      this.router.url.replace(/\/list$/, '/view') + '/' + object.numero_fv;
    this.router.navigateByUrl(viewUrl).then();
  }

  getColor(internal_status, border) {
    if (internal_status === Status.Received) {
      return border ? 'border-color-blue' : 'color-blue-hist';
    } else if (internal_status === Status.Accepted) {
      return border ? 'border-color-green' : 'color-green';
    } else if (internal_status === Status.Rejected) {
      return border ? 'border-color-red' : 'color-red';
    }
  }

  getFecha(status): string {
   return
  }
}
