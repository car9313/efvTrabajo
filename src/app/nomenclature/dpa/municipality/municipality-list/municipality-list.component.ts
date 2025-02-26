import {Component, OnInit} from '@angular/core';
import {animations, IComponentList, NgChoosenOpts, RowConfig} from '@app/nodachi';
import {MunicipalityService, ProvService} from '@app/nodachi/common-services';
import {ActivatedRoute, Router} from '@angular/router';
import {Province} from '@app/nomenclature';

@Component({
  selector: 'app-municipality-list',
  templateUrl: './municipality-list.component.html',
  animations: animations,
  styleUrls: ['./municipality-list.component.scss'],
})
export class MunicipalityListComponent
  extends IComponentList
  implements OnInit {
  provinces_filter: Province[];
  choosenOpts: NgChoosenOpts;

  constructor(
    private municipalityService: MunicipalityService,
    private provService: ProvService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(
      municipalityService,
      'Municipalities',
      'Administrar Municipios',
      router
    );
    this.headers = {
      code: 'Código',
      desc_short: 'Acrónimo',
      desc_long: 'Nombre',
      province_descrip: 'Provincia',
    };
    this.headersExcel = [
      {name: 'code', key: 'Código'},
      {name: 'desc_short', key: 'Acrónimo'},
      {name: 'desc_long', key: 'Nombre'},
      {name: 'province_descrip', key: 'Provincia'},
    ];
    this.choosenOpts = {placeHolder: 'Provincia'};
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.listProv();
  }

  listProv(): void {
    this.provService.getNomenclador<Province>().subscribe(
      (provinces) => {
        this.provinces_filter = provinces;
      },
      () => {
      }
    );
  }

  public preSearch(): void {
    this.searchParams.other_params = {province_id: this.province_filter};
  }
}
