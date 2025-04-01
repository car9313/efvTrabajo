import { Component, OnInit } from '@angular/core';
import { animations, IComponentList, NgChoosenOpts } from '@app/nodachi';
import { SolicitudesPendientesService } from '@app/efv/solicitudes/solicitudesPendientes.service';
import { Router } from '@angular/router';
import { IsFilter } from '@app/nodachi/decorators/is-filter.decorator';
import { SolicitudService } from '@app/efv/solicitudes/solicitud.service';
import { Solicitud } from '../solicitud';

@Component({
  selector: 'app-solicitudes-list',
  templateUrl: './solicitudes-list.component.html',
  styleUrls: ['./solicitudes-list.component.scss'],
  animations: animations,
})
export class SolicitudesListComponent extends IComponentList implements OnInit {
  //public estados_solicitudchoosenOpts: NgChoosenOpts;
  //public estados_procesochoosenOpts: NgChoosenOpts;

  //public estados_solicitud: any;
  //public estados_proceso: any;

  //@IsFilter() public estadosSolicitudFilter: number;
  //@IsFilter() public estadosProcesoFilter: number;

  @IsFilter() public id_solicitud: number;
  @IsFilter() public fechaFilter: string;
  @IsFilter() public fechaFinFilter: string;
  public today = new Date();

  public estadoschoosenOpts: NgChoosenOpts;
  public estados: String[] = [
    'PENDIENTE_DE_COMPROBACION',
    'LISTA_PARA_ENTREGAR',
    'PENDIENTE_ DE_CONFIRMACION',
    'ENTREGADA',
    'DISPONIBLE',
  ];
  @IsFilter() public actionEstadoFilter: string;

/*  public tiposVisachoosenOpts: NgChoosenOpts;
  public tiposVisa: any;
  @IsFilter() public actionTiposVisaFilter: string;*/

 /* public entidadeschoosenOpts: NgChoosenOpts;
  public entidades: any;
  @IsFilter() public actionEntidadesFilter: string;
*/
  public isDisableButtonProcesarPendiente: boolean;
  public isDisableButtonRestaurarSolicitud: boolean;
  constructor(
    public solicitudService: SolicitudService,
    public solicitudesPendientes: SolicitudesPendientesService,
    public router: Router
  ) {
    super(solicitudService, 'Solicitud', 'Solicitudes', router);
    //this.estadosProcesoFilter = null;
    //this.estadosSolicitudFilter = null;
    this.headers = {
      id_solicitud: 'Id Solicitud',
      fecha_solicitud: 'Fecha solicitud',
      // usuario: 'Usuario',
      status_solicitud: 'Estado solicitud',
      cantidad: 'Cantidad',
      tipo_visa: 'Tipo Visa',
      entidad: 'Entidad',
      // status_proceso: 'Estado Proceso'
    };
    this.headersExcel = [
      { name: 'id_solicitud', key: 'Id Solicitud' },
      { name: 'cantidad', key: 'Cantidad' },
      { name: 'fecha_solicitud', key: 'Fecha Solicitud' },
      { name: 'status_solicitud', key: 'Estado Solicitud' },
     /* { name: 'tipo_visa', key: 'Tipo Visa' },
      { name: 'entidad', key: 'Entidad' },*/
    ];
    this.estadoschoosenOpts = {
      textField: 'value',
      valueField: 'key',
      placeHolder: 'Estados',
    };
   /* this.tiposVisachoosenOpts = {
      textField: 'description',
      valueField: 'code',
      placeHolder: 'Tipos de Visa',
    };*/
   /* this.entidadeschoosenOpts = {
      textField: 'name',
      valueField: 'description',
      placeHolder: 'Entidades',
    };*/
    this.isDisableButtonProcesarPendiente = true;
    this.isDisableButtonRestaurarSolicitud = true;

    this.extraHeaders = [
      {
        title: 'Buscar eFV',
        tooltip: 'Buscar eFV',
        icon: 'fa fa-search',
        condition: (request: any) => {
          return request.status_solicitud == 'NUEVA' ? false : true;
        },
        url: ['', '/efv/efv_buscar/solicitud/', '${id_solicitud}'],
        //class: 'btn btn-primary',
      },
    ];
    this.redirectToAdd = false;
  }

  ngOnInit() {
    super.ngOnInit();
    this.permissions.delete = false;
    this.permissions.update = false;
    this.permissions.create = false;
    this.permissions.read = false;
    this.solicitudService.getCantExecuteProcesarPendiente().subscribe((res) => {
      this.isDisableButtonProcesarPendiente = res;
    });
    this.solicitudService
      .getCantExecuteRestaurarSolicitud()
      .subscribe((res) => {
        this.isDisableButtonRestaurarSolicitud = res;
      });
  /*  this.listTipoVisa();
    this.listEntidades();*/
  }
/*  listTipoVisa(): void {
    this.solicitudService.getTipoVisaSolicitudes().subscribe((res) => {
      this.tiposVisa = res;
    });
  }*/
  /*listEntidades(): void {
    this.solicitudService.getEntidades().subscribe((res) => {
      this.entidades = res;
    });
  }*/

  preSearch() {
    this.searchParams.other_params = {
      fechadesde: this.fechaFilter ? this.fechaFilter : null,
      fechahasta: this.fechaFinFilter ? this.fechaFinFilter : null,
      id_solicitud: this.id_solicitud,
      estado: this.actionEstadoFilter,
      /*tipovisa: this.actionTiposVisaFilter,
      entidad: this.actionEntidadesFilter,*/
    };
  }

  procesar() {
    this.isDisableButtonProcesarPendiente = false;
    this.solicitudesPendientes.pendiente().subscribe((res) => {
      if (res != null) {
        this.spin.stopLoading();
        this.notification.error(res);
        this.solicitudService
          .getCantExecuteProcesarPendiente()
          .subscribe((res) => {
            this.isDisableButtonProcesarPendiente = res;
          });
        this.solicitudService
          .getCantExecuteRestaurarSolicitud()
          .subscribe((res) => {
            this.isDisableButtonRestaurarSolicitud = res;
          });
      } else {
        this.spin.stopLoading();
        this.notification.success('La solicitud fue procesada correctamete');
        this.solicitudService
          .getCantExecuteProcesarPendiente()
          .subscribe((res) => {
            this.isDisableButtonProcesarPendiente = res;
          });
        this.solicitudService
          .getCantExecuteRestaurarSolicitud()
          .subscribe((res) => {
            this.isDisableButtonRestaurarSolicitud = res;
          });
      }
    });
  }
  restaurar() {
    this.isDisableButtonRestaurarSolicitud = false;
    this.solicitudService.restaurarSolicitudError().subscribe((res) => {
      if (res != null) {
        this.spin.stopLoading();
        this.notification.error(res);
        this.solicitudService
          .getCantExecuteProcesarPendiente()
          .subscribe((res) => {
            this.isDisableButtonProcesarPendiente = res;
          });
        this.solicitudService
          .getCantExecuteRestaurarSolicitud()
          .subscribe((res) => {
            this.isDisableButtonRestaurarSolicitud = res;
          });
      } else {
        this.spin.stopLoading();
        this.notification.success('La solicitud fue restaurada correctamete');
        this.solicitudService
          .getCantExecuteProcesarPendiente()
          .subscribe((res) => {
            this.isDisableButtonProcesarPendiente = res;
          });
        this.solicitudService
          .getCantExecuteRestaurarSolicitud()
          .subscribe((res) => {
            this.isDisableButtonRestaurarSolicitud = res;
          });
      }
    });
  }

  view(object: any): void {
    const viewUrl: string =
      this.router.url.replace(/\/list$/, '/view') +
      '/' +
      object.id_solicitud.toString();
    this.router.navigateByUrl(viewUrl).then();
  }

  public pendientes(): void {
    // const id = isNullOrUndefined(object.id) ? object.item.id : object.id;
    let isConfirm: boolean = this.notification.confirm1(
      'Atención!',
      'Seguro que desea procesar Pendientes',
      () => this.procesar()
    );
    // location.reload();
  }

  public solicitudError(): void {
    // const id = isNullOrUndefined(object.id) ? object.item.id : object.id;
    this.notification.confirm(
      'Atención!',
      'Seguro que desea Restaurar Solicitudes',
      () => this.restaurar()
    );
    // location.reload();
  }
}
