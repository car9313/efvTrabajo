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
  headers: any;
  headersExcel: ICustomHeader[];

  constructor(
    public alertService: AlertService,
    public solicitudService: SolicitudService,
    public efvService: EfvListService,
    private utilityService: Utility,
    public adminService: SaicoLayoutService,
    private spin: SpinService
  ) {
    (this.chartEfvXEstados = {}),
      (this.charSegmentoXEstado = {}),
      (this.chartSolicitudXEstados = {});
    this.chartColors = ReportesService.getChartColors();

      this.headers = {};
    this.headersExcel = [];
  }
  ngOnInit(): void {
    this.adminService.setTitle('Bienvenido');
    if (this.utilityService.hasPermission('Request')) {
    }
   this.getSolicitudXEstadosCart();
    this.getEfvXEstadosCart();
    this.getSegmentoXEstadoCart();
  }

  getEfvXEstadosCart() {

    this.spin.startLoading();
    this.alertService.getRequestEfvXEstados().subscribe(
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

    this.spin.startLoading();
    this.alertService.getRequestSolicitudXEstados().subscribe(
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
  }


   getSegmentoXEstadoCart() {
    /*const accessLevel = this.accessLevel;*/
    this.spin.startLoading();
    this.alertService.getRequestSegmentoXEstado().subscribe(
      (data) => {
        this.charSegmentoXEstado = data;
        this.spin.stopLoading();
      },
      () => {
        this.charSegmentoXEstado = {};
        this.spin.stopLoading();
      }
    );
  }
}
