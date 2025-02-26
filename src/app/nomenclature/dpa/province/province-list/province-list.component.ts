import { Component, OnInit } from '@angular/core';
import { animations, IComponentList } from '@app/nodachi';
import { ProvService } from '@app/nodachi/common-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-province-list',
  templateUrl: '../../../../system/list.component.html',
  animations: animations
})
export class ProvinceListComponent extends IComponentList implements OnInit {

  constructor(public provService: ProvService, public router: Router) {
    super(provService, 'Provinces', 'Provincias', router);
    this.headers = { code: 'Código', desc_short: 'Acrónimo', desc_long: 'Nombre' };

    this.headersExcel = [
      { name: 'code', key: 'Código' },
      { name: 'desc_short', key: 'Acrónimo' },
      { name: 'desc_long', key: 'Nombre' },
    ];

    this.headersExcel = [
      { name: 'id', key: 'Id' },
      { name: 'code', key: 'Código' },
      { name: 'desc_short', key: 'Acrónimo' },
      { name: 'desc_long', key: 'Nombre' }
    ];
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
