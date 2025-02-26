import {Injectable} from '@angular/core';
import {CoreService} from '../../../../utils/core-service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MunicipalityService extends CoreService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/dpa/municipalities');
  }
}
