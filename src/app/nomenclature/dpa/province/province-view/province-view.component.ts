import {Component, OnInit} from '@angular/core';
import {animations, IComponentView} from '@app/nodachi';
import {Province} from '@app/nomenclature/dpa/province/prov';
import {ProvService} from '@app/nodachi/common-services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-province-view',
  templateUrl: './province-view.component.html',
  animations: animations,
})
export class ProvinceViewComponent extends IComponentView<Province>{

  constructor(public provService: ProvService, public router: Router, public route: ActivatedRoute) {
    super(provService, route, router, 'Provincia', new Province());
  }
}
