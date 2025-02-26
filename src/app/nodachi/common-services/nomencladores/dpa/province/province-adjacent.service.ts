import { Injectable } from '@angular/core';
import {CoreService} from '@app/nodachi/utils/core-service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvinceAdjacentService extends CoreService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, '/api/v1/dpa/provinces_adjacent');
  }
}
