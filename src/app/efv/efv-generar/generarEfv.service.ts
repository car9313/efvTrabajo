import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreService } from '../../nodachi/index';
import { Observable } from 'rxjs';


import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenerarEfvService extends CoreService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/gestion/efv');
  }

  generar(object: any): Observable<any> {
    // Verificar que la prop id se encuentre el create y eliminarla para que funcione con .net.
    return this.httpClient.post(this.url(), JSON.stringify(object), {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    }).pipe(catchError(CoreService.handleError));
  }
  createEfv(object: any): Observable<any> {
    // Verificar que la prop id se encuentre el create y eliminarla para que funcione con .net.
    return this.httpClient.post(this.url(), JSON.stringify(object), {
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    }).pipe(catchError(CoreService.handleError));
  }

}
