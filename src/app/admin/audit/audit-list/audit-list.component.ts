import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IComponentList } from '@app/nodachi/utils/icomponent_list';
import { Router } from '@angular/router';
import { AuditService } from '../audit.service';
import { animations } from '@app/nodachi/utils/animations';
import { NgChoosenOpts } from '@app/nodachi/components/ng-choosen/ng-choosen-opts';
import { IsFilter } from '@app/nodachi/decorators/is-filter.decorator';
import { SolicitudService } from '@app/efv/solicitudes/solicitud.service';

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss'],
  animations: animations,
  encapsulation: ViewEncapsulation.None,
})
export class AuditListComponent extends IComponentList implements OnInit {
  public actionTypes: any;
  public choosenActionTypes: NgChoosenOpts;
  @IsFilter() public actionTypeFilter: any;
  @IsFilter() public fechaDesdeFilter: string;
  @IsFilter() public fechaHastaFilter: string;

  public errorschoosenOpts: NgChoosenOpts;
  public errors: String[] = [
    'Servidor fuera de Servicio',
    'Porblemas de conexión',
    'Base de datos llena',
  ];
  @IsFilter() public actionErrorFilter: string;

  constructor(
    private auditService: AuditService,
    public solicitudService: SolicitudService,
    public router: Router
  ) {
    super(auditService, 'Audit', 'Registro de eventos', router);

    this.choosenActionTypes = {
      textField: 'value',
      valueField: 'key',
      placeHolder: 'Tipo de acción',
    };

    this.headers = {
      date_time: 'Fecha',
      user_name: 'Usuario',
      action_type: 'Acción',
      entity_type_friendly_name: 'Entidad afectada',
      user_host_address: 'IP',
    };
    this.headersExcel = [
      { name: 'id', key: 'Id' },
      { name: 'entity_type', key: 'Tipo de Entidad' },
      { name: 'date_time', key: 'Fecha' },
      { name: 'user_host_address', key: 'IP' },
      { name: 'user_name', key: 'Usuario' },
      { name: 'entity_type_friendly_name', key: 'Entidad afectada' },
      { name: 'action_type_description', key: 'Acción' },
    ];
    this.itemPerPage = 20;

    this.errorschoosenOpts = { textField: 'name', closeOnSelect: false };
    console.log(this.objects);
  }

  ngOnInit() {
    super.ngOnInit();
    this.auditService.getActionTypes().subscribe((resp) => {
      this.actionTypes = resp;
    });
  }

  preSearch() {
    console.log(this.fechaDesdeFilter);
    this.searchParams.other_params = {
      ActionType: this.actionTypeFilter,
      FechaDesde: this.fechaDesdeFilter,
      FechaHasta: this.fechaHastaFilter,
    };
    this.saveState({
      actionTypeFilter: this.actionTypeFilter,
      fechaDesdeFilter: this.fechaDesdeFilter,
      fechaHastaFilter: this.fechaHastaFilter,
    });
  }
  restaurar() {
    this.solicitudService.restaurarSistema().subscribe((res) => {
      if (res != null) {
        this.spin.stopLoading();
        this.notification.error(res);
      } else {
        this.spin.stopLoading();
        this.notification.success('El sistema ha sido restablecido');
      }
    });
  }
}
