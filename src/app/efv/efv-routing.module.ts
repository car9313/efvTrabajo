import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteParent } from '../nodachi/utils/route-parent';
import { BreadcrumbService } from '../nodachi/components/ng-breadcrumb/breadcrumb.service';
import { EfvListComponent } from '@app/efv/efv-list/efv-list.component';
import { SolicitudesListComponent } from '@app/efv/solicitudes/solicitudes-list/solicitudes-list.component';
import { SolicitudesViewComponent } from '@app/efv/solicitudes/solicitudes-view/solicitudes-view.component';
import { EfvGenerarComponent } from '@app/efv/efv-generar/efv-generar.component';
import { EfvViewComponent } from '@app/efv/efv-view/efv-view.component';
import { HistorialListComponent } from '@app/efv/historial/historial-list/historial-list.component';
import { ViajeroListComponent } from '@app/efv/viajero/viajero-list/viajero-list.component';
import { HistorialViewComponent } from '@app/efv/historial/historial-view/historial-view.component';
import { ViajeroViewComponent } from '@app/efv/viajero/viajero-view/viajero-view.component';
import { SegmentoListComponent } from '@app/efv/segmento/segmento-list/segmento-list.component';
import { SegmentoViewComponent } from '@app/efv/segmento/segmento-view/segmento-view.component';
import { ToolbarComponent } from '@app/efv/toolbar/toolbar.component';
import { EfvSearchComponent } from './efv-search/efv-search.component';

const APP_ROUTES: Routes = [
  {
    path: 'list',
    component: EfvListComponent,
    data: [
      {},
      { breadcrumb: 'Formas valiosas', navigation: 'Formas valiosas' },
    ],
  },
  {
    path: 'efv_buscar',
    component: EfvSearchComponent,
    data: [
      {},
      { breadcrumb: 'Buscar eFV', navigation: 'Buscar Formas Valiosas' },
    ],
  },
  {
    path: 'efv_buscar/solicitud/:id_solicitud/:id',
    component: EfvViewComponent,
    data: [{}, { breadcrumb: 'Detalles', navigation: 'Efv' }],
  },
  {
    path: 'efv_buscar/solicitud/:id_solicitud',
    component: EfvSearchComponent,
    data: [
      {},
      { breadcrumb: 'Buscar eFV', navigation: 'Buscar Formas Valiosas' },
    ],
  },
  {
    path: 'efv_buscar/segmento/:id_segmento',
    component: EfvSearchComponent,
    data: [
      {},
      { breadcrumb: 'Buscar eFV', navigation: 'Buscar Formas Valiosas' },
    ],
  },
  {
    path: 'efv_generar',
    component: EfvGenerarComponent,
    data: [
      {},
      {
        breadcrumb: 'Generar Formas Valiosas',
        navigation: 'Generar Formas Valiosas',
      },
    ],
  },
  {
    //solicitud/1/fsfggerg
    path: 'view/:id',
    component: EfvViewComponent,
    data: [{}, { breadcrumb: 'Detalles', navigation: 'Efv' }],
  },

  {
    path: 'historial',
    data: [
      { resource: 'Solicitud', permission: ['read'] },
      { breadcrumb: 'Solicitudes' },
    ],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: HistorialListComponent,
        data: [{}, { breadcrumb: 'Historial', navigation: 'Historial' }],
      },
      {
        path: 'view/:id',
        component: HistorialViewComponent,
        data: [{}, { breadcrumb: 'Detalles', navigation: 'Detalles' }],
      },
    ],
  },
  {
    path: 'solicitudes',
    data: [
      { resource: 'Solicitud', permission: ['read'] },
      { breadcrumb: 'Solicitudes' },
    ],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: SolicitudesListComponent,
        data: [
          { resource: 'Solicitud', permission: ['read'] },
          {
            breadcrumb: 'Listar',
            navigation: 'Lista de solicitudes',
          },
        ],
      },
      /*   {
          path: 'view/:id',
          component: SolicitudesViewComponent,
          data: [{ resource: 'Solicitud', permission: ['read'] }, {
            breadcrumb: 'Detalle',
            navigation: 'Solicitud',
          }],
        }, */
    ],
  },
  {
    path: 'segmentos',
    data: [
      { resource: 'Paquete', permission: ['read'] },
      { breadcrumb: 'Segmentos' },
    ],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: SegmentoListComponent,
        data: [
          { resource: 'Paquete', permission: ['read'] },
          {
            breadcrumb: 'Listar',
            navigation: 'Lista de segmentos',
          },
        ],
      },
      {
        path: 'view/:id',
        component: SegmentoViewComponent,
        data: [
          { resource: 'Paquete', permission: ['read'] },
          {
            breadcrumb: 'Detalle',
            navigation: 'Segmento',
          },
        ],
      },
    ],
  },
  {
    path: 'errores',
    data: [
      { resource: 'Transmision', permission: ['read'] },
      { breadcrumb: 'Errores', navigation: 'Errores' },
    ],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'prueba',
    data: [{ breadcrumb: 'Prueba', navigation: 'Prueba' }],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ToolbarComponent,
        data: [
          {
            breadcrumb: 'Prueba',
            navigation: 'Prueba',
          },
        ],
      },
    ],
  },
  {
    path: 'viajeros',
    data: [
      { resource: 'Viajero', permission: ['read'] },
      { breadcrumb: 'Viajeros' },
    ],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ViajeroListComponent,
        data: [{}, { breadcrumb: 'Listar', navigation: 'Lista de viajeros' }],
      },
      {
        path: 'view/:id',
        component: ViajeroViewComponent,
        data: [
          { resource: 'Viajero', permission: ['read'] },
          {
            breadcrumb: 'Detalle',
            navigation: 'Viajero',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(APP_ROUTES)],
  exports: [RouterModule],
})
export class EfvRoutingModule extends RouteParent {
  constructor(public breadcrumbService: BreadcrumbService) {
    super(breadcrumbService, '/efv', 'eFV', APP_ROUTES);
  }
}
