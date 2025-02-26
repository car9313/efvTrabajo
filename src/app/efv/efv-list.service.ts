import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CoreService, ResponseCoreService} from '../nodachi/index';
import {Observable} from 'rxjs';
import {catchError, filter, map, takeUntil} from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class EfvListService extends CoreService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/gestion/efv');
  }

  getEstados(): Observable<any> {
    return this.httpClient.get(this.url() + '/estadosefv')
      .pipe(catchError(CoreService.handleError));
  }

  getPendiente(): Observable<any> {
    return this.httpClient.get(this.url()).pipe(map(this.transformPendientes), catchError(CoreService.handleError));
  }

  private transformPendientes(resp) {
    return resp.objects.filter((resp) => resp.estado === 'Pendiente');
  }
  
  imprimir(encabezado: any, cuerpo: any, titulo: string, guardar?: boolean) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'letter'
    });
    doc.text(titulo, doc.internal.pageSize.width / 2, 25, {align: 'center'});
    autoTable(doc, {
      head: [encabezado],
      body: cuerpo,
    });
    if (guardar) {
      const hoy = new Date();
      doc.save(hoy.getDate() + hoy.getMonth() + hoy.getFullYear() + hoy.getTime() + '.pdf');
    } else {

    }
  }
}
