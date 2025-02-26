import {Injectable} from '@angular/core';
import {CoreService} from '@app/nodachi/utils/core-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuditService extends  CoreService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/audits');
  }

  getActionTypes(): Observable<any> {
    return this.httpClient.get(this.url() + '/action_types')
      .pipe(catchError(CoreService.handleError));
  }
}
