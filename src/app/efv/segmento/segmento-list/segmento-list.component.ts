import { Component, OnInit } from '@angular/core';
import { animations, IComponentList, NgChoosenOpts } from '@app/nodachi';
import { SegmentoService } from '@app/efv/segmento/segmento.service';
import { Router } from '@angular/router';
import { IsFilter } from '@app/nodachi/decorators/is-filter.decorator';
import { SolicitudService } from '@app/efv/solicitudes/solicitud.service';

@Component({
  selector: 'app-segmento-list',
  templateUrl: './segmento-list.component.html',
  animations: animations,
})
export class SegmentoListComponent extends IComponentList implements OnInit {
  @IsFilter() public id_solicitud: number;
  @IsFilter() public id_segmento: number;
  public estadoschoosenOpts: NgChoosenOpts;
  public estados: String[] = [
    'NUEVO',
    'PRODUCIDO',
    'ERROR_EN_PRODUCCION',
    'LISTO_PARA_ENTREGA',
    'PENDIENTE_DE_CONFIRMACION',
    'ERROR',
    'ENTREGADO',
    'DISPONIBLE',
  ];
  @IsFilter() public actionEstadoFilter: string;

  public tiposVisachoosenOpts: NgChoosenOpts;
  public tiposVisa: any;
  @IsFilter() public actionTiposVisaFilter: string;

  public entidadeschoosenOpts: NgChoosenOpts;
  public entidades: any;
  @IsFilter() public actionEntidadesFilter: string;

  constructor(
    protected segmetoServices: SegmentoService,
    public router: Router,
    public solicitudService: SolicitudService
  ) {
    super(segmetoServices, 'Paquete', 'Lista de Segmentos', router);

    this.headers = {
      id_solicitud: 'Id solicitud',
      id_segmento: 'Id segmento',
      //  fecha_creado: 'Fecha Creación',
      cantidad_fv: 'Cantidad eFV',
      estado: 'Estado',
      tipo_visa: 'Tipo Visa',
      entidad: 'Entidad',
      /* fecha_reenvio: 'Fecha Reenvio',
      comprobacion: 'Comprobación',
      fecha_udp: 'Fecha de Actualización',*/
    };
    this.headersExcel = [
      { name: 'id_solicitud', key: 'Id Solicitud' },
      { name: 'id_segmento', key: 'Id Segmento' },
      //  {name: 'fecha_creado', key: 'Fecha Creado'},
      { name: 'cantidad_fv', key: 'Cantidad Efv' },
      { name: 'estado', key: 'Estado' },
      { name: 'tipo_visa', key: 'Tipo Visa' },
      { name: 'entidad', key: 'Entidad' },
      /* {name: 'fecha_reenvio', key: 'Fecha Reenvio'},
       {name: 'Fecha_udp', key: 'Fecha Actualización'},
       {name: 'comprobacion', key: 'Comprobación'},*/
    ];
    this.extraHeaders = [
      {
        title: 'Buscar eFV',
        tooltip: 'Buscar eFV',
        icon: 'fa fa-search',
        url: ['', '/efv/efv_buscar/segmento/', '${id_segmento}'],
        condition: (segmento: any) => {
          return segmento.estado == 'NUEVO' ? false : true;
        },
      },
    ];
    this.redirectToAdd = false;

    this.tiposVisachoosenOpts = {
      textField: 'description',
      valueField: 'code',
      placeHolder: 'Tipos de Visa',
    };
    this.entidadeschoosenOpts = {
      textField: 'name',
      valueField: 'description',
      placeHolder: 'Entidades',
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.permissions.delete = false;
    this.permissions.update = false;
    this.permissions.create = false;
    this.permissions.read = false;
    this.listTipoVisa();
    this.listEntidades();
  }

  listTipoVisa(): void {
    this.solicitudService.getTipoVisaSolicitudes().subscribe((res) => {
      console.log(res);
      this.tiposVisa = res;
    });
  }
  listEntidades(): void {
    this.solicitudService.getEntidades().subscribe((res) => {
      console.log(res);
      this.entidades = res;
    });
  }
  preSearch() {
    this.searchParams.other_params = {
      id_solicitud: this.id_solicitud,
      id_segmento: this.id_segmento,
      estado: this.actionEstadoFilter,
      tipovisa: this.actionTiposVisaFilter,
      entidad: this.actionEntidadesFilter,
    };
  }
  view(object: any): void {
    const viewUrl: string =
      this.router.url.replace(/\/list$/, '/view') + '/' + object.id_segmento;
    this.router.navigateByUrl(viewUrl).then();
  }
}
