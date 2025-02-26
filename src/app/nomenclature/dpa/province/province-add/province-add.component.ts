import {Component, OnInit} from '@angular/core';
import {animations, IComponentCreate, NgChoosenOpts, SelectItem} from '@app/nodachi';
import {ProvService} from '@app/nodachi/common-services';
import {ActivatedRoute, Router} from '@angular/router';
import {Province} from '@app/nomenclature/dpa/province/prov';

@Component({
  selector: 'app-province-add',
  templateUrl: './province-add.component.html',
  animations: animations,
})
export class ProvinceAddComponent extends IComponentCreate<Province> implements OnInit {
  categories: Array<any>;
  categoriesOpt: NgChoosenOpts;
  adjacents: Array<SelectItem>;
  adjacents_id: any;
  optAdjacents: NgChoosenOpts;


  constructor(public provService: ProvService,
              public router: Router,
              public route: ActivatedRoute) {
    super(provService, router, 'Agregar Provincia', new Province());
    this.categoriesOpt = {textField: 'value', valueField: 'key'};
    this.optAdjacents = {selectionLimit: 0, closeOnSelect: false};
  }

  ngOnInit() {
    this.provService.getNomenclador().subscribe(resp => this.adjacents = resp);
    super.ngOnInit();
  }

}
