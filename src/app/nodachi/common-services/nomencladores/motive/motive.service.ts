import { Injectable } from '@angular/core';
import {CoreService} from '../../..';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MotiveService extends CoreService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/cause_of_rejection');
  }

  getEnumTipoMotivo(): Observable<any> {
    return this.httpClient.get(this.url() + '/tipos')
      .pipe(catchError(CoreService.handleError));
  }

  getMotivoByTipo(id: number): Observable<any> {
    return this.httpClient.get(`${this.url()}/combo/${id}`)
      .pipe(catchError(CoreService.handleError));
  }
}
