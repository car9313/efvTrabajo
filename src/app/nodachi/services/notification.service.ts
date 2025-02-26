import { Injectable } from '@angular/core';
import { CoreService, ISearchParams } from '@app/nodachi/utils/core-service';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends CoreService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, '/api/v1/notifications');
  }

  create(object: any): Observable<any> {
    return EMPTY;
  }

  update(object: any): Observable<any> {
    return EMPTY;
  }

  getById(id: any): Observable<any> {
    return EMPTY;
  }

  getNomenclador(opts?: { urlPart?: string; viewModel?: string; other_params?: {} }): Observable<any> {
    return EMPTY;
  }

  printList(obj?: ISearchParams, title?: string, headers?: string): Observable<string> {
    return EMPTY;
  }

  markAsRead(id: any): Observable<any> {
    return this.httpClient.put(`${this.url()}/mark-as-read/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1;mode=block',
          'X-Content-Type-Options': 'nosniff'
        },
      }
    )
      .pipe(catchError(CoreService.handleError));
  }

  markAsReadAll(): Observable<any> {
    return this.httpClient.put(`${this.url()}/mark-as-read`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    }).pipe(catchError(CoreService.handleError));
  }

  getCount(): Observable<any> {
    return this.httpClient.get(`${this.url()}/count`).pipe(catchError(CoreService.handleError));
  }
}
