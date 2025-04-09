import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreService } from '@app/nodachi';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesPendientesService extends CoreService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/gestion/requests');
  }

  pendiente(): Observable<any> {
    console.log(this.url())
    return this.httpClient.post(`${this.url()}/pendiente`, {
      /*observe: 'response',*/
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    })
      .pipe(catchError(CoreService.handleError));
  }

}

