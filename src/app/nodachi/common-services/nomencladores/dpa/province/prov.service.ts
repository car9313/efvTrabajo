import {Injectable} from '@angular/core';
import {CoreService} from '../../../../utils/core-service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class ProvService extends CoreService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/dpa/provinces');
    console.log(this.url());
  }

  getCategorias(): Observable<any> {
    return this.httpClient.get(this.url() + '/categorias')
      .pipe(catchError(CoreService.handleError));
  }
}
