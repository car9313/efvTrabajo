import {NgModule} from '@angular/core';
// Routes
import {NomencladorRoutingModule} from './nomenclature-routing.module';
// Modules
import {SystemModule} from '../system/system.module';
// tslint:disable:max-line-length
// Components
import {ProvinceListComponent} from './dpa/province/province-list/province-list.component';
import {ProvinceEditComponent} from './dpa/province/province-edit/province-edit.component';
import {ProvinceAddComponent} from './dpa/province/province-add/province-add.component';
import {ProvinceViewComponent} from './dpa/province/province-view/province-view.component';
import {MunicipalityListComponent} from './dpa/municipality/municipality-list/municipality-list.component';
import {MunicipalityEditComponent} from './dpa/municipality/municipality-edit/municipality-edit.component';
import {MunicipalityAddComponent} from './dpa/municipality/municipality-add/municipality-add.component';
import {MunicipalityViewComponent} from './dpa/municipality/municipality-view/municipality-view.component';
import { MotiveListComponent } from './motive/motive-list/motive-list.component';
import { MotiveAddComponent } from './motive/motive-add/motive-add.component';
import { MotiveEditComponent } from './motive/motive-edit/motive-edit.component';
import { MotiveViewComponent } from './motive/motive-view/motive-view.component';

// Services
// tslint:enable:max-line-length

@NgModule({
  declarations: [
    ProvinceListComponent,
    ProvinceEditComponent,
    ProvinceAddComponent,
    ProvinceViewComponent,
    MunicipalityListComponent,
    MunicipalityEditComponent,
    MunicipalityAddComponent,
    MunicipalityViewComponent,
    MotiveListComponent,
    MotiveAddComponent,
    MotiveEditComponent,
    MotiveViewComponent,
  ],
  imports: [
    SystemModule,
    NomencladorRoutingModule,
  ],
  providers: [],
})

export class NomencladorModule {
}
