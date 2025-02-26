import {Injectable} from '@angular/core';
import {CoreService} from '@app/nodachi';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistorialService extends CoreService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/gestion/efv');
  }
}
