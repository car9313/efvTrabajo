import {Component, OnInit} from '@angular/core';
import {animations, IComponentView} from '@app/nodachi';
import {Segmento} from '@app/efv/segmento/segmento';
import {SegmentoService} from '@app/efv/segmento/segmento.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-segmento-view',
  templateUrl: './segmento-view.component.html',
  animations: animations,
})
export class SegmentoViewComponent extends IComponentView<Segmento> {

  constructor(protected segmentoService: SegmentoService, public route: ActivatedRoute, public router: Router) {
    super(segmentoService, route, router, 'Segmento', new Segmento());
  }
}
