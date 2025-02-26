import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportesService } from '@app/nodachi/services/reportes.service';
import { ConfigService } from '@app/nodachi';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  base_url: string;

  constructor(public httpClient: HttpClient, public config: ConfigService) {
    this.base_url = '/api/v1/alertas';
  }
  getRequestSolicitudXEstados(nivel): Observable<any> {
    if (nivel.value === null) {
      return this.httpClient.get(`${this.config.url()}${this.base_url}/solicitudesxestados`)
        .pipe(
          map(chart => ReportesService.mapChart(chart)),
        );
    }
  }
  getRequestEfvXEstados(nivel): Observable<any> {
    if (nivel.value === null) {
      return this.httpClient.get(`${this.config.url()}${this.base_url}/efvxestados`)
        .pipe(
          map(chart => ReportesService.mapChart(chart)),
        );
    }
  }
  getRequestSegmentoXEstado(nivel): Observable<any> {
    if (nivel.value === null) {
      return this.httpClient.get(`${this.config.url()}${this.base_url}/segmentoxestado`)
        .pipe(
          map(chart => ReportesService.mapChart(chart)),
        );
    }
  }

}
