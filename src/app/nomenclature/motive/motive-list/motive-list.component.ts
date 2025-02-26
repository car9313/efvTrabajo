import { Component, OnInit } from '@angular/core';
import {animations, IComponentList, NgChoosenOpts} from '@app/nodachi';
import { ActivatedRoute, Router } from '@angular/router';
import {MotiveService} from '@app/nodachi/common-services/nomencladores/motive/motive.service';

@Component({
  selector: 'app-motive-list',
  templateUrl: './motive-list.component.html',
  animations: animations
})
export class MotiveListComponent extends IComponentList implements OnInit {

  constructor(
    private municipalityService: MotiveService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(
      municipalityService,
      'CauseRejection',
      'Motivos de Rechazo',
      router
    );
    this.headers = {
      description: 'Motivo',
      tipo_descrip: 'Tipo de Solicitud'
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }


}
