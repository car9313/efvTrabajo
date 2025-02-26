import { NgModule } from '@angular/core';
import { EfvRoutingModule } from './efv-routing.module';
import { FormsModule } from '@angular/forms';

// Modules
import { SystemModule } from '../system/system.module';
import { EfvListComponent } from './efv-list/efv-list.component';
import { SolicitudesViewComponent } from './solicitudes/solicitudes-view/solicitudes-view.component';
import { SolicitudesListComponent } from './solicitudes/solicitudes-list/solicitudes-list.component';
import { EfvViewComponent } from './efv-view/efv-view.component';
import { EfvGenerarComponent } from './efv-generar/efv-generar.component';
import { HistorialListComponent } from './historial/historial-list/historial-list.component';
import { HistorialViewComponent } from './historial/historial-view/historial-view.component';
import { ViajeroListComponent } from '@app/efv/viajero/viajero-list/viajero-list.component';
import { ViajeroViewComponent } from './viajero/viajero-view/viajero-view.component';
import {
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatTabsModule
} from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';


import { SegmentoListComponent } from './segmento/segmento-list/segmento-list.component';
import { SegmentoViewComponent } from './segmento/segmento-view/segmento-view.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AppComponent } from '@app/app.component';
import { CustomMatPaginatorIntl } from '@app/efv/paginator.es';
import { EfvSearchComponent } from './efv-search/efv-search.component';


@NgModule({
  declarations: [
    EfvGenerarComponent,
    EfvListComponent,
    ViajeroListComponent,
    SolicitudesViewComponent,
    SolicitudesListComponent,
    EfvViewComponent,
    EfvGenerarComponent,
    HistorialListComponent,
    HistorialViewComponent,
    ViajeroViewComponent,
    SegmentoListComponent,
    SegmentoViewComponent,
    ToolbarComponent,
    EfvSearchComponent,
  ],
  imports: [
    EfvRoutingModule,
    SystemModule,
    FormsModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ]
})
export class EfvModule {
}
