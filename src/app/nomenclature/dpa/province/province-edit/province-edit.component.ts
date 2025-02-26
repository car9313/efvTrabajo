import {Component, OnInit} from '@angular/core';
import {animations, Enumerative, IComponentUpdate, INgChoosenOpts, NgChoosenOpts, SelectItem} from '@app/nodachi';
import {ProvService} from '@app/nodachi/common-services';
import {ActivatedRoute, Router} from '@angular/router';
import {Province} from '@app/nomenclature/dpa/province/prov';

@Component({
  selector: 'app-province-edit',
  templateUrl: './province-edit.component.html',
  animations: animations,
})
export class ProvinceEditComponent extends IComponentUpdate<Province> implements OnInit {

  categories: Array<Enumerative>;
  categoriesOpt: NgChoosenOpts;
  adjacents: Array<SelectItem>;
  adjacentsOpt: INgChoosenOpts;

  constructor(public provService: ProvService, public router: Router, public route: ActivatedRoute) {
    super(provService, route, router, 'Editar Provincia', new Province());
    this.categoriesOpt = {textField: 'value', valueField: 'key'};
    this.categories = [];
    this.adjacentsOpt = {selectionLimit: 0, closeOnSelect: false};
  }

  ngOnInit() {
    this.provService.getCategorias().subscribe((item) => this.categories = item);
    this.provService.getNomenclador({other_params: {'id__notequal': this.route.snapshot.paramMap.get('id')}})
      .subscribe(resp => this.adjacents = resp);
    super.ngOnInit();
  }

}
