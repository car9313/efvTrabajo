import { Component, OnInit } from '@angular/core';
import {animations, IComponentView} from '@app/nodachi';
import {Viajero} from '@app/efv/viajero/viajero';
import {ViajerosService} from '@app/efv/viajero/viajeros.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-viajero-view',
  templateUrl: './viajero-view.component.html',
  animations: animations,
})
export class ViajeroViewComponent extends IComponentView<Viajero> {

  constructor(protected viajeroServices: ViajerosService, public router: Router, public route: ActivatedRoute) {
    super(viajeroServices, route, router, 'Viajero', new Viajero());
  }
  goList(): void {
    // const listUrl: string = this.router.url.replace(/\/view\/\d+$/, '/list');
    const listUrl = '/efv/viajeros/list';
    this.router.navigateByUrl(listUrl).then();
  }
}
