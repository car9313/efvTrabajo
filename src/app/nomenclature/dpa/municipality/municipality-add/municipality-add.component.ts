import {Component, OnInit} from '@angular/core';
import {MunicipalityService, ProvService} from '@app/nodachi/common-services';
import {ActivatedRoute, Router} from '@angular/router';
import {animations, IComponentCreate, SelectItem} from '@app/nodachi';
import {Municipality} from '@app/nomenclature/dpa/municipality/muni';

@Component({
  selector: 'app-municipality-add',
  templateUrl: './municipality-add.component.html',
  animations: animations,
})
export class MunicipalityAddComponent extends IComponentCreate<Municipality> implements OnInit {

  provinces: Array<SelectItem>;

  constructor(private municipalityService: MunicipalityService,
              private provService: ProvService,
              public router: Router,
              public route: ActivatedRoute) {
    super(municipalityService, router, 'Agregar Municipio', new Municipality());
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
