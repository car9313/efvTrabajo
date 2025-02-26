import { Injectable } from '@angular/core';
import { CoreService, Enumerative } from '@app/nodachi';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService extends CoreService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/gestion/requests');
  }
  /*getEstadosSolicitud(): Observable<any> {
    return this.httpClient.get(this.url() + '/estadossolicitud')
      .pipe(catchError(CoreService.handleError));
} getEstadosProceso(): Observable<any> {
    return this.httpClient.get(this.url() + '/estadosproceso')
      .pipe(catchError(CoreService.handleError));
}
  getVisas(): Observable<any> {
    return this.httpClient.get(this.url() + '/visas')
      .pipe(catchError(CoreService.handleError));
}*/
  restaurarSistema(): Observable<any> {
    return this.httpClient
      .post(`${this.url()}/restaurarSistema`, {
        /*observe: 'response',*/
        headers: {
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1;mode=block',
          'X-Content-Type-Options': 'nosniff',
        },
      })
      .pipe(catchError(CoreService.handleError));
  }
  restaurarSolicitudError(): Observable<any> {
    return this.httpClient
      .post(`${this.url()}/restaurarSolicitud`, {
        /*observe: 'response',*/
        headers: {
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1;mode=block',
          'X-Content-Type-Options': 'nosniff',
        },
      })
      .pipe(catchError(CoreService.handleError));
  }
  getEstadosSolicitud() {
    return this.getNomenclador<Enumerative>({ urlPart: 'estadossolicitud' });
  }
  getEstadosProceso() {
    return this.getNomenclador<Enumerative>({ urlPart: 'estadosproceso' });
  }
  getCantExecuteProcesarPendiente(): Observable<any> {
    return this.httpClient
      .get(this.url() + '/can_execute_solicitudes_pendientes')
      .pipe(catchError(CoreService.handleError));
  }
  /*  getCantExecuteRestaurarSistema(): Observable<any> {
     return this.httpClient.get(this.url() + '/can_execute_restaurar_sistema')
       .pipe(catchError(CoreService.handleError));
   } */
  getCantExecuteRestaurarSolicitud(): Observable<any> {
    return this.httpClient
      .get(this.url() + '/can_execute_restaurar_solicitudes')
      .pipe(catchError(CoreService.handleError));
  }
  envioTipoError(object: any): Observable<any> {
    return this.httpClient
      .post(this.url() + '/' + object + '/enviar', object)
      .pipe(catchError(CoreService.handleError));
  }
  getTipoVisaSolicitudes(): Observable<any> {
    return this.httpClient
      .get(this.url() + '/tiposvisa')
      .pipe(catchError(CoreService.handleError));
  }
  getEntidades(): Observable<any> {
    return this.httpClient
      .get(this.url() + '/entidades')
      .pipe(catchError(CoreService.handleError));
  }
}
