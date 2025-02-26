import { Component, OnInit } from '@angular/core';
import {
  animations,
  ChartItem,
  IComponentList,
  SpinService,
  Utility,
} from '../nodachi';
import { SaicoLayoutService } from '../admin';
import { AlertService } from '@app/nodachi/services/alert.service';
import { AlertEService } from '@app/nodachi/services/alertE.service';
import { SolicitudService } from '@app/efv/solicitudes/solicitud.service';
import { EfvListService } from '@app/efv/efv-list.service';
import { ReportesService } from '@app/nodachi/services/reportes.service';
import { ICustomHeader } from '@app/nodachi/interfaces/icustom-header';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: animations,
})
export class HomeComponent implements OnInit {
  public estados: any;
  chartEfvXEstados: ChartItem;
  charSegmentoXEstado: ChartItem;
  chartSolicitudXEstados: ChartItem;
  chartsFF: ChartItem;
  chartColors: Array<{}>;
  /*   accessLevel: { key: string; value: string };
  accessLevelDetails: {
    national: boolean;
    province: number;
    municipality: number;
  }; */
  /*   reportType: string;
  reportTypeInv: string;
 */
  solicitudesXestadosolicitud: any;
  solicitudesXestadoproceso: any;
  efvXestado: any;
  headers: any;
  headersExcel: ICustomHeader[];

  constructor(
    public alertService: AlertService,
    public solicitudService: SolicitudService,
    public efvService: EfvListService,
    /*  private alertEService: AlertEService,
     */ private utilityService: Utility,
    public adminService: SaicoLayoutService,
    private spin: SpinService
  ) {
    (this.chartEfvXEstados = {}),
      (this.charSegmentoXEstado = {}),
      (this.chartSolicitudXEstados = {});
    this.chartColors = ReportesService.getChartColors();

    /*  this.accessLevelDetails = this.utilityService.getCurrentUser();

    const access = JSON.parse(localStorage.getItem('user_loggued'));
    this.accessLevel = {
      key: access['municipality_work_id']
        ? 'municipio'
        : access['province_work_id']
        ? 'provincia'
        : 'nacional',
      value: access['municipality_work_id']
        ? access['municipality_work_id']
        : access['province_work_id']
        ? access['province_work_id']
        : null,
    }; */
    /* this.reportType = this.accessLevel.key;
    this.reportTypeInv = this.accessLevel.key;
     */ this.headers = {};
    this.headersExcel = [];
  }
  ngOnInit(): void {
    this.adminService.setTitle('Bienvenido');
    if (this.utilityService.hasPermission('Request')) {
    }
    /* this.getSolicitudXEstadosCart();
    this.getEfvXEstadosCart();
    this.getSegmentoXEstadoCart(); */
  }

  /* getCantSolicitudXEstadoSolicitud() {
    this.solicitudService.getAll().subscribe((data) => {
      this.solicitudesXestadosolicitud = data.objects.reduce((arrayCantEstado, elemento) => {
        const yaEnArray = arrayCantEstado.find(({ status_solicitud }) =>
          status_solicitud === elemento.status_solicitud);
        if (yaEnArray) {
          yaEnArray.quantity++;
        } else {
          arrayCantEstado.push({ status_solicitud: elemento.status_solicitud, quantity: 1 });
        }
        return arrayCantEstado;
      }, []);
    });
  } */
  /* getEfvXEstadosCart() {
    const accessLevel = this.accessLevel;
    this.spin.startLoading();
    this.alertService.getRequestEfvXEstados(accessLevel).subscribe(
      (data) => {
        this.chartEfvXEstados = data;
        //  this.chartEfvXEstados.graficos[0].ejeY[0].backgroundColor = 'rgba(255, 99, 132, 0.2)';
        this.spin.stopLoading();
      },
      () => {
        this.chartEfvXEstados = {};
        this.spin.stopLoading();
      }
    );
  }
  getSolicitudXEstadosCart() {
    const accessLevel = this.accessLevel;
    this.spin.startLoading();
    this.alertService.getRequestSolicitudXEstados(accessLevel).subscribe(
      (data) => {
        data.graficos[0].ejeY[0].backgroundColor = this.chartColors;
        this.chartSolicitudXEstados = data;
        this.spin.stopLoading();
      },
      () => {
        this.chartSolicitudXEstados = {};
        this.spin.stopLoading();
      }
    );
  } */

  /* generateHeaders(number: number) {
    switch (number) {
      case 1:
        this.headers = {
          status_solicitud: 'Estado Solicitud',
          quantity: 'Cantidad',
        };
        this.headersExcel = [
          { name: 'status_solicitud', key: 'Estado Solicitud' },
          { name: 'quantity', key: 'Cantidad' },
        ];
        break;
      case 2:
        this.headers = { estado: 'Estado', quantity: 'Cantidad' };
        this.headersExcel = [
          { name: 'estado', key: 'Estado' },
          { name: 'quantity', key: 'Cantidad' },
        ];
        break;
      case 3:
        this.headers = {
          status_proceso: 'Estado Proceso',
          quantity: 'Cantidad',
        };
        this.headersExcel = [
          { name: 'status_proceso', key: 'Estado Proceso' },
          { name: 'quantity', key: 'Cantidad' },
        ];

        break;
    }
  } */

  /* getSegmentoXEstadoCart() {
    const accessLevel = this.accessLevel;
    this.spin.startLoading();
    this.alertService.getRequestSegmentoXEstado(accessLevel).subscribe(
      (data) => {
        this.charSegmentoXEstado = data;
        this.spin.stopLoading();
      },
      () => {
        this.charSegmentoXEstado = {};
        this.spin.stopLoading();
      }
    );
  } */
}
