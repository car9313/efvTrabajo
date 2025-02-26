import {Component} from '@angular/core';
import {MunicipalityService} from '@app/nodachi/common-services';
import {ActivatedRoute, Router} from '@angular/router';
import {animations, IComponentView} from '@app/nodachi';
import {Municipality} from '@app/nomenclature/dpa/municipality/muni';

@Component({
  selector: 'app-municipality-view',
  templateUrl: './municipality-view.component.html',
  animations: animations,
})
export class MunicipalityViewComponent extends IComponentView<Municipality> {

  constructor(private municipalityService: MunicipalityService,
              public router: Router,
              public route: ActivatedRoute) {
    super(municipalityService, route, router, 'Municipio', new Municipality());
  }
}
