import {Injectable} from '@angular/core';
import {CoreService} from '../../../utils/core-service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class ThemedService extends CoreService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/codificadores/tematicas');
  }

  getAllPeson(): Observable<any> {
    return this.httpClient.get(this.url() + '/comboNP')
      .pipe(catchError(CoreService.handleError));
  }
}
