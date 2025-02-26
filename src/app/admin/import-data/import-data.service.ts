import { Injectable } from '@angular/core';
import { CoreService } from '@app/nodachi';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportDataService extends CoreService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, '/api/v1/codificadores/import');
  }

  public postFile(model: any): Observable<any> {

    const formData: FormData = new FormData();
    // formData.append(`fields`, JSON.stringify(model.fields));
    formData.append(`fields_obj`, JSON.stringify(model.fields_obj));
    formData.append(`indexes`, JSON.stringify(model.indexes));
    formData.append(`field_key`, JSON.stringify(model.field_key));
    formData.append(`codificador`, JSON.stringify(model.codificador));
    formData.append(`filtro_valor`, JSON.stringify(model.filtro_valor));
    formData.append(`row_start`, JSON.stringify(model.row_start));
    formData.append(`anho_censo`, JSON.stringify(model.anho_censo));
    formData.append(`file_id`, model.file_id, model.file_id.name);


    return this.httpClient.put(`${this.url()}`, formData, {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    });


    // return of(false);
  }

  getFields(field) {
    return this.httpClient.get(`${this.url()}/campos/${field}`);
  }
}
