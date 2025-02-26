import {Component} from '@angular/core';
import {MotiveService} from '@app/nodachi/common-services/nomencladores/motive/motive.service';
import {ActivatedRoute, Router} from '@angular/router';
import {animations, IComponentView} from '@app/nodachi';
import {Motive} from '../motive';

@Component({
  selector: 'app-motive-view',
  templateUrl: './motive-view.component.html',
  animations: animations,
})
export class MotiveViewComponent extends IComponentView<Motive> {

  constructor(private motiveService: MotiveService,
              public router: Router,
              public route: ActivatedRoute) {
    super(motiveService, route, router, 'Motivo de Rechazo', new Motive());
  }
}
