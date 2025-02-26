import {Component, ViewEncapsulation} from '@angular/core';
import {IComponentView} from '@app/nodachi';
import {EfvHistorial} from '@app/efv/historial/efvHistorial';
import {HistorialService} from '@app/efv/historial/historial.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-historial-view',
  templateUrl: './historial-view.component.html',
  styleUrls: ['./historial-view.component.scss'],
  encapsulation: ViewEncapsulation.None,


})
export class HistorialViewComponent extends IComponentView<EfvHistorial> {
  public show_score: boolean;

  constructor(public historialService: HistorialService, router: Router, route: ActivatedRoute) {
    super(historialService, route, router, 'Historial', new EfvHistorial());
    this.show_score = false;
  }

  changeTab(event) {
    if (event.index === 1) {
      this.show_score = true;
    }
  }
}
