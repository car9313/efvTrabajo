import { Injectable } from '@angular/core';
import { CoreService } from '@app/nodachi/utils/core-service';
import { HttpClient } from '@angular/common/http';
import { SecuritySettings } from './security.settings';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SecuritySettingsService extends CoreService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/security/settings');
  }

  public getSettings(): Observable<SecuritySettings> {
    return this.httpClient.get<SecuritySettings>(this.url()).pipe(
      map((resp) => {
          return resp;
        }
      ),
      catchError(CoreService.handleError)
    );
  }
}
