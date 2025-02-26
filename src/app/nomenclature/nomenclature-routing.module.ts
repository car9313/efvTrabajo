import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RouteParent} from '../nodachi';
// tslint:disable:max-line-length

import {BreadcrumbService} from '../nodachi/components/ng-breadcrumb/breadcrumb.service';

import {ProvinceListComponent} from '@app/nomenclature/dpa/province/province-list/province-list.component';
import {ProvinceAddComponent} from '@app/nomenclature/dpa/province/province-add/province-add.component';
import {ProvinceEditComponent} from '@app/nomenclature/dpa/province/province-edit/province-edit.component';
import {ProvinceViewComponent} from '@app/nomenclature/dpa/province/province-view/province-view.component';
import {MunicipalityListComponent} from '@app/nomenclature/dpa/municipality/municipality-list/municipality-list.component';
import {MunicipalityViewComponent} from '@app/nomenclature/dpa/municipality/municipality-view/municipality-view.component';
import {MunicipalityEditComponent} from '@app/nomenclature/dpa/municipality/municipality-edit/municipality-edit.component';
import {MunicipalityAddComponent} from '@app/nomenclature/dpa/municipality/municipality-add/municipality-add.component';
import { MotiveListComponent } from './motive/motive-list/motive-list.component';
import { MotiveAddComponent } from './motive/motive-add/motive-add.component';
import { MotiveEditComponent } from './motive/motive-edit/motive-edit.component';
import { MotiveViewComponent } from './motive/motive-view/motive-view.component';

// tslint:enable:max-line-length
const APP_ROUTES: Routes = [
  {
    path: 'provinces',
    data: [{resource: 'Provinces', permission: ['read']}, {breadcrumb: 'Provincias'}],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ProvinceListComponent,
        data: [{resource: 'Provinces', permission: ['read']}, {
          breadcrumb: 'Listar',
          navigation: 'Lista de Provincias',
        }],
      },
      {
        path: 'add',
        component: ProvinceAddComponent,
        data: [{resource: 'Provinces', permission: ['create']}, {
          breadcrumb: 'Agregar',
          navigation: 'Agregar Provincia',
        }],
      },
      {
        path: 'edit/:id',
        component: ProvinceEditComponent,
        data: [{resource: 'Provinces', permission: ['update']}, {
          breadcrumb: 'Editar',
          navigation: 'Editar Provincia',
        }],
      },
      {
        path: 'view/:id',
        component: ProvinceViewComponent,
        data: [{resource: 'Provinces', permission: ['read']}, {
          breadcrumb: 'Detalle',
          navigation: 'Provincia',
        }],
      },
    ],
  },
  {
    path: 'municipalities',
    data: [{resource: 'Municipalities', permission: ['read']}, {breadcrumb: 'Municipios'}],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: MunicipalityListComponent,
        data: [{resource: 'Municipalities', permission: ['read']}, {
          breadcrumb: 'Listar',
          navigation: 'Lista de Municipios',
        }],
      },
      {
        path: 'add',
        component: MunicipalityAddComponent,
        data: [{resource: 'Municipalities', permission: ['create']}, {
          breadcrumb: 'Agregar',
          navigation: 'Agregar Municipio',
        }],
      },
      {
        path: 'edit/:id',
        component: MunicipalityEditComponent,
        data: [{resource: 'Municipalities', permission: ['update']}, {
          breadcrumb: 'Editar',
          navigation: 'Editar Municipio',
        }],
      },
      {
        path: 'view/:id',
        component: MunicipalityViewComponent,
        data: [{resource: 'Municipalities', permission: ['read']}, {
          breadcrumb: 'Detalle',
          navigation: 'Municipio',
        }],
      },
    ],
  },
  {
    path: 'motive',
    data: [{resource: 'CauseRejection', permission: ['read']}, {breadcrumb: 'Motivos de Rechazo'}],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: MotiveListComponent,
        data: [{resource: 'CauseRejection', permission: ['read']}, {
          breadcrumb: 'Listar',
          navigation: 'Lista de Motivos de Rechazo',
        }],
      },
      {
        path: 'add',
        component: MotiveAddComponent,
        data: [{resource: 'CauseRejection', permission: ['create']}, {
          breadcrumb: 'Agregar',
          navigation: 'Agregar Motivos de Rechazo',
        }],
      },
      {
        path: 'edit/:id',
        component: MotiveEditComponent,
        data: [{resource: 'CauseRejection', permission: ['update']}, {
          breadcrumb: 'Editar',
          navigation: 'Editar Motivos de Rechazo',
        }],
      },
      {
        path: 'view/:id',
        component: MotiveViewComponent,
        data: [{resource: 'CauseRejection', permission: ['read']}, {
          breadcrumb: 'Detalle',
          navigation: 'Motivos de Rechazo',
        }],
      },
    ],
  },
 /* {
    path: 'councils',
    data: [{resource: 'Councils', permission: ['read']}, {breadcrumb: 'Consejos Populares'}],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CouncilListComponent,
        data: [{resource: 'Councils', permission: ['read']}, {
          breadcrumb: 'Listar',
          navigation: 'Lista de Consejos Populares',
        }],
      },
      {
        path: 'add',
        component: CouncilAddComponent,
        data: [{resource: 'Councils', permission: ['create']}, {
          breadcrumb: 'Agregar',
          navigation: 'Agregar Consejo Popular',
        }],
      },
      {
        path: 'edit/:id',
        component: CouncilEditComponent,
        data: [{resource: 'Councils', permission: ['update']}, {
          breadcrumb: 'Editar',
          navigation: 'Editar Consejo Populare',
        }],
      },
      {
        path: 'view/:id',
        component: CouncilViewComponent,
        data: [{resource: 'Councils', permission: ['read']}, {
          breadcrumb: 'Detalle',
          navigation: 'Consejo Populare',
        }],
      },
    ],
  },*/
];


@NgModule({
  imports: [
    RouterModule.forChild(APP_ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class NomencladorRoutingModule extends RouteParent {
  constructor(public breadcrumbService: BreadcrumbService) {
    super(breadcrumbService, '/nomencladores', 'Codificadores', APP_ROUTES);
  }
}


