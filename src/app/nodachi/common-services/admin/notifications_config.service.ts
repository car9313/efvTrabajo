import { HttpClient } from '@angular/common/http';
import { CoreService } from '../../utils/core-service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class NotificationsConfigService extends CoreService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, '/api/v1/notifications-config');
  }

  update(object: any): Observable<any> {
    return this.httpClient.put(`${this.url()}/${object.type}`, JSON.stringify(object), {
      observe: 'response',
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
