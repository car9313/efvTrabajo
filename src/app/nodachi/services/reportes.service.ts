import { Injectable } from '@angular/core';
import { ChartItem, LabelChart } from '../models/chart-item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService, CoreService } from '@app/nodachi';



@Injectable({ providedIn: 'root' })
export class ReportesService extends CoreService {

  constructor(public httpClient: HttpClient, public config: ConfigService) {
    super(httpClient, 'api/v1/alertas');
  }

  static getChartColors(): Array<{ backgroundColor: string }> {
    return [
      {
        backgroundColor: '#66AF94'
      },
      {
        backgroundColor: '#dc3545',
      },
      {
        backgroundColor: '#007bff',
      },
      {
        backgroundColor: '#28a745',
      },
      {
        backgroundColor: '#000',
      },
      {
        backgroundColor: '#17a2b8',
      },
      {
        backgroundColor: '#ffc107',
      },
      {
        backgroundColor: '#5cb85c',
      },
      {
        backgroundColor: '#0275d8',
      },
      {
        backgroundColor: '#ffab40',
      },
      {
        backgroundColor: '#d9534f',
      },
      {
        backgroundColor: '#6f42c1',
      },
      {
        backgroundColor: '#3fa2c1',
      },
      {
        backgroundColor: '#b9c142',
      },
      {
        backgroundColor: '#2010c1',
      },
      {
        backgroundColor: '#4ac1ad',
      },
      {
        backgroundColor: '#c16427',
      },
      {
        backgroundColor: '#c14455',
      },
      {
        backgroundColor: '#9438c1',
      },
      {
        backgroundColor: '#3315c1',
      },
      {
        backgroundColor: '#1bc19c',
      },
      {
        backgroundColor: '#bec166',
      },
      {
        backgroundColor: '#132ac1',
      },
      {
        backgroundColor: '#bc72c1',
      },
    ];
  }

  static generateColor(): string {
    const color = Math.floor(Math.random() * 16777216).toString(16);
    return '#000000'.slice(0, -color.length) + color;
  }

  static mapChart(data: ChartItem) {
    const chart = data;
    chart.graficos.forEach((value, index) => {
      value.ejeX.data = value.ejeX.data.map(value2 => {
        return typeof value2 === 'string' ?
          new LabelChart(0, value2) : new LabelChart(value2.id, value2.label);
      });

      if (value.chartType === 'bar') {
        value.chartOptions = {
          scaleShowVerticalLines: false,
          responsive: true,
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            xAxes: [
              {
                stacked: value.options.stacked || false,
                type: 'category',
                scaleLabel: {
                  display: true,
                  labelString: Array.isArray(value.ejeX) ? '' : value.ejeX.label,
                  fontStyle: '600'
                },
              }],
            yAxes: [{
              stacked: value.options.stacked || false,
              ticks: {
                precision: 0,
                beginAtZero: true,
              },
            }],
          },
        };
      } else if (value.chartType === 'pie') {
        value.chartOptions = {
          responsive: true, title: {
            display: true,
          }, legend: {
            display: true, position: 'bottom',
          },
        };
      } else {
        value.chartOptions = {};
      }
      if (value.ejeY && value.ejeY.length <= 0) {
        chart.graficos[index] = null;
      }
    });
    return chart;
  }

  getRequest(nivel): Observable<any> {
    if (nivel.value === null) {
      return this.httpClient.get(`${this.config.url()}${this.url()}/solicitudes`)
        .pipe(
          map(chart => ReportesService.mapChart(chart)),
        );
    }
    if (nivel.key === 'provincia') {
      return this.httpClient.get(`${this.config.url()}${this.url()}/solicitudes/provincia?provincia=${nivel.value}`)
        .pipe(
          map(chart => ReportesService.mapChart(chart)),
        );
    }
    if (nivel.key === 'municipio') {
      return this.httpClient.get(`${this.config.url()}${this.url()}/solicitudes/municipio?municipio=${nivel.value}`)
        .pipe(
          map(chart => ReportesService.mapChart(chart)),
        );
    }
  }

  getTypeReportCombo(): any {
    return this.httpClient.get(`${this.url()}/type_report/combo`)
      .pipe(catchError(CoreService.handleError));
  }

  getReportRequest(object): any {
    return this.httpClient.get(`${this.url()}/request`, { params: object })
      .pipe(catchError(CoreService.handleError));
  }
}
