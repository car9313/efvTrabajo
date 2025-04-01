import { Component, OnInit, Inject } from '@angular/core';
import {
  animations,
  IComponentList,
  NgChoosenOpts,
  ScDialogService,
  ServiceLocator,
} from '../../nodachi/index';
import { Router } from '@angular/router';
import { EfvListService } from 'src/app/efv/efv-list.service';
import { IsFilter } from '@app/nodachi/decorators/is-filter.decorator';
import { filter, map, switchMap } from 'rxjs/operators';
import { PrintComponent } from '@app/nodachi/components/print/print.component';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarComponent } from '@app/efv/toolbar/toolbar.component';

@Component({
  selector: 'app-efv-list',
  templateUrl: './efv-list.component.html',
  styleUrls: ['./efv-list.component.scss'],
  animations: animations,
})
export class EfvListComponent extends IComponentList implements OnInit {
  public pendientes: any = null;
  public estadoschoosenOpts: NgChoosenOpts;
  public estados: any;
  @IsFilter() public actionEstadoFilter: number;
  @IsFilter() public id_segmento: number;
  @IsFilter() public id_solicitud: number;
  public titlePdfUI = 'Listado eFV';
  public pendiente: any[];

  constructor(
    private efvListService: EfvListService,
    public router: Router /* public dialog: MatDialog */
  ) {
    super(efvListService, 'EFv', 'Formas valiosas', router);
    this.pendientes = [];
    this.headers = {
      numero_fv: '#eFV',
      estado: 'Estado',
      id_segmento: 'Id segmento',
      id_solicitud: 'Id Solicitud',
     /* tipo_visa: 'Tipo Visa',
      entidad: 'Entidad',*/
    };
    this.headersExcel = [
      { name: 'numero_fv', key: 'Numero Efv' },
      { name: 'estado_fv', key: 'Estado Efv' },
      { name: 'id_segmento', key: 'Id Segmento' },
      { name: 'id_solicitud', key: 'Id Solicitud' },
   /*   { name: 'tipo_visa', key: 'Tipo Visa' },
      { name: 'entidad', key: 'Entidad' },*/
      { name: 'modalidad', key: 'Modalidad' },
      { name: 'eticket_id', key: 'Eticket Id' },
      { name: 'chk_frontera', key: 'Chk Frontera' },
      { name: 'fecha_cruce', key: 'Fecha Cruce' },
      { name: 'fecha_envio_cruce', key: 'Fecha Envio Cruce' },
      { name: 'fc_e_stado', key: 'Fecha Estado' },
      { name: 'modalidad', key: 'Modalidad' },
    ];

    this.estadoschoosenOpts = {
      textField: 'value',
      valueField: 'key',
      placeHolder: 'Estados',
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.listEstados();
  }

  listEstados(): void {
    this.efvListService.getEstados().subscribe((res) => {
      this.estados = res;
    });
  }

  preSearch() {
    this.searchParams.other_params = {
      estado_efv: this.actionEstadoFilter,
      id_segmento: this.id_segmento,
      id_solicitud: this.id_solicitud,
    };
  }

  generate() {
    const createUrl: string = this.router.url.replace(
      /\/list$/,
      '/efv_generar'
    );
    this.router.navigateByUrl(createUrl).then();
  }

  view(object: any): void {
    const viewUrl: string =
      this.router.url.replace(/\/list$/, '/view') + '/' + object.numero_fv;
    this.router.navigateByUrl(viewUrl).then();
  }
}
