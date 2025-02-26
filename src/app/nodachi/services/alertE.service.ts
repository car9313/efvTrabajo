import {ConfigService} from '@app/nodachi';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertEService {
  base_url: string;

  constructor(public httpClient: HttpClient, public config: ConfigService) {
    this.base_url = '/api/v1/extincion/alertas';
  }



  private getParams(nivel) {
    let params = {};
    if (nivel.value == null) {
      params = {key: 'nacional'};
    }
    if (nivel.key === 'provincial') {
      params = {key: 'provincial', value: nivel.value};
    }
    if (nivel.key === 'municipal') {
      params = {key: 'municipal', value: nivel.value};
    }
    return params;
  }
}
