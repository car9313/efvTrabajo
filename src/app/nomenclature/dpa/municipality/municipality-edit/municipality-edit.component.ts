import {Component, OnInit} from '@angular/core';
import {MunicipalityService, ProvService} from '@app/nodachi/common-services';
import {ActivatedRoute, Router} from '@angular/router';
import {animations, IComponentUpdate, SelectItem} from '@app/nodachi';
import {Municipality} from '@app/nomenclature/dpa/municipality/muni';

@Component({
  selector: 'app-municipality-edit',
  templateUrl: './municipality-edit.component.html',
  animations: animations,
})
export class MunicipalityEditComponent extends IComponentUpdate<Municipality> implements OnInit {

  provinces: Array<SelectItem>;

  constructor(private municipalityService: MunicipalityService,
              private provService: ProvService,
              public router: Router,
              public route: ActivatedRoute) {
    super(municipalityService, route, router, 'Editar Municipio', new Municipality());
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.listProv();
  }

  listProv(): void {
    this.provService
      .getNomenclador()
      .subscribe(provinces => {
        this.provinces = provinces;
      }, error2 => {
      });
  }

}
