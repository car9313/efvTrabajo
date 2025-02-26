import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CoreService} from '@app/nodachi';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ViajerosService extends CoreService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/gestion/viajero');
  }
 /* getVisas(): Observable<any> {
    return this.httpClient.get(this.url() + '/visas')
      .pipe(catchError(CoreService.handleError));
  }*/
}
