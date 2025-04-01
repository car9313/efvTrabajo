import { Observable, throwError as observableThrowError } from 'rxjs';
import { isNullOrUndefined } from './utility';
import { Notifications } from '../services/notifications';
import { ConfigService } from '../services/config.services';
import { ServiceLocator } from '../services/locator.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ResponseCoreService<T> {
  objects?: any[];
  meta?: any;
  total?: any;
}

export interface ISearchParams {
  per?: number;
  page?: number;
  search?: string;
  other_params?: { [param: string]: any };
  url?: string;
}

// @Injectable()
export class CoreService {
  /**
   * Servicio base para las peticiones de la api rest en rails.
   * @constructor
   * @param {HttpClient} httpClient - Helper para peticiones http.
   * @param {string} urlResource - Direccion relativa del recurso, sin el host ni la version, ej: users.
   * @param {string} searchFields - Campos a utilizar en el search, ej: name,description.
   */

  constructor(
    protected httpClient: HttpClient,
    public urlResource: string,
    public searchFields: string[] = []
  ) {}

  protected static handleError(error: any) {

    return observableThrowError(error);
  }

  buildUrl(url?: string): string {
    return ServiceLocator.get<ConfigService>(ConfigService).url() + url;
  }

  url() {
    return (
      ServiceLocator.get<ConfigService>(ConfigService).url() + this.urlResource
    );
  }

  create(object: any): Observable<any> {
    // Verificar que la prop id se encuentre el create y eliminarla para que funcione con .net.
    if (object.id === null) {
      delete object.id;
    }
    return this.httpClient
      .post(this.url(), JSON.stringify(object), {
        observe: 'response',
        headers: {
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1;mode=block',
          'X-Content-Type-Options': 'nosniff',
        },
      })
      .pipe(catchError(CoreService.handleError));
  }

  remove(
    id: any,
    other_ids?: Array<any>,
    other_params?: { [param: string]: any }
  ): Observable<any> {
    console.log(id);
    console.log(other_params);

    let url_part = '';
    if (other_ids) {
      other_ids.forEach((value) => {
        url_part += `/${value}`;
      });
    }
    const params = {};
    if (other_params) {
      for (const key in other_params) {
        if (!isNullOrUndefined(other_params[key]) && other_params[key] !== '') {
          params[key] = other_params[key].toString();
        }
      }
    }
    return this.httpClient
      .delete(`${this.url()}/${id}${url_part}`, {
        observe: 'response',
        params: params,
      })
      .pipe(
        catchError(CoreService.handleError),
        catchError((err): Observable<any> => {
          ServiceLocator.get(Notifications).verification(err);
          return observableThrowError(err);
        })
      );
  }

  update(object: any): Observable<any> {
    return this.httpClient
      .put(`${this.url()}/${object.id}`, JSON.stringify(object), {
        observe: 'response',
        headers: {
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1;mode=block',
          'X-Content-Type-Options': 'nosniff',
        },
      })
      .pipe(catchError(CoreService.handleError));
  }

  getAll<T>(obj?: ISearchParams): Observable<ResponseCoreService<T>>;
  getAll(obj?: ISearchParams): Observable<any> {
    const params = {};
    let url = this.url();

    if (!isNullOrUndefined(obj)) {
      url = obj.url || url;
      if (obj.page) {
        params['page'] = obj.page.toString();
      }
      if (obj.per) {
        params['per'] = obj.per.toString();
      }
      params['search'] = obj.search ? obj.search : '';
    }
    if (!isNullOrUndefined(obj) && !isNullOrUndefined(obj.other_params)) {
      for (const key in obj.other_params) {
        if (
          !isNullOrUndefined(obj.other_params[key]) &&
          obj.other_params[key] !== ''
        ) {
          params[key] = obj.other_params[key].toString();
        }
      }
    }

    if (this.searchFields.length > 0) {
      params['searchfields'] = this.searchFields.toString();
    }
    console.log(params);
    return this.httpClient.get(url, { params: params }).pipe(
      map((res) => {
        return this.mapObjects(res);
      }),
      catchError(CoreService.handleError)
    );
  }

  mapObjects(resp: any): ResponseCoreService<any> {
    const response: ResponseCoreService<any> = {};
    response['objects'] = isNullOrUndefined(resp['objects'])
      ? []
      : resp['objects'];
    if (resp['meta']) {
      response['meta'] = resp['meta'];
    }
    if (resp['total']) {
      response['total'] = resp['total'];
    }
    return response;
  }

  getById(id: any): Observable<any>;
  getById<T>(id: any): Observable<T>;
  getById(id: any): Observable<any> {
   console.log(id)
    console.log(`${this.url()}/${id}`)
    return this.httpClient
      .get<any>(`${this.url()}/${id}`)
      .pipe(catchError(CoreService.handleError));
  }

  getNomenclador(opts?: {
    urlPart?: string;
    viewModel?: string;
    other_params?: {};
  }): Observable<any>;
  getNomenclador<T>(opts?: {
    urlPart?: string;
    viewModel?: string;
    other_params?: {};
  }): Observable<Array<T>>;
  getNomenclador(opts?: {
    urlPart?: string;
    viewModel?: string;
    other_params?: {};
  }): Observable<any> {
    const urlPart = opts && opts.urlPart ? opts.urlPart : 'combo';
    const viewModel = opts && opts.viewModel ? opts.viewModel : null;
    const other_params = opts && opts.other_params ? opts.other_params : {};
    return this.httpClient
      .get(`${this.url()}/${urlPart}`, { params: other_params })
      .pipe(
        map((resp) => (viewModel ? resp[viewModel] : resp)),
        catchError(CoreService.handleError)
      );
  }

  printList(
    obj?: ISearchParams,
    title?: string,
    headers?: string,
    serviceUrl?: string
  ): Observable<string> {
    const params = {};
    let url = serviceUrl || this.url();

    if (!isNullOrUndefined(obj)) {
      url = obj.url || url;
      if (obj.page) {
        params['page'] = obj.page.toString();
      }
      params['search'] = obj.search ? obj.search : '';
    }
    params['per'] = 10000000;

    if (!isNullOrUndefined(obj) && !isNullOrUndefined(obj.other_params)) {
      for (const key in obj.other_params) {
        if (
          !isNullOrUndefined(obj.other_params[key]) &&
          obj.other_params[key] !== ''
        ) {
          params[key] = obj.other_params[key].toString();
        }
      }
    }

    if (this.searchFields.length > 0) {
      params['searchfields'] = this.searchFields.toString();
    }

    url += '?' + new HttpParams({ fromObject: params }).toString();
    const printUrl =
      ServiceLocator.get<ConfigService>(ConfigService).url() +
      '/reports/general/GeneralListReport';

    const body = new HttpParams({
      fromObject: {
        ListUrl: url,
        Title: title || '',
        Columns: JSON.stringify(headers || {}),
      },
    });

    return this.httpClient
      .post(printUrl, body, { responseType: 'blob' })
      .pipe(map((m) => URL.createObjectURL(m)));
  }

  generatePdfUI(encabezado: any, cuerpo: Array<any>, titulo: string) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'letter',
    });
    const logo = new Image();
    logo.src = 'assets/logoPDF.png';
    doc.addImage(
      logo,
      'JPEG',
      doc.internal.pageSize.getWidth() / 2.45,
      20,
      75,
      50
    );
    doc.setFontSize(12);
    doc.text(
      'Dirección de Identificación, Inmigración y Extranjería',
      doc.internal.pageSize.width / 2,
      80,
      { align: 'center' }
    );
    doc.setFontSize(20);
    doc.text(titulo, doc.internal.pageSize.width / 2, 100, { align: 'center' });
    autoTable(doc, {
      startY: 110,
      theme: 'plain',
      // pageBreak : 'avoid',
      styles: {
        overflow: 'linebreak',
        fontSize: 12,
        font: 'arial',
        halign: 'center', // left, center, right
        valign: 'middle', // top, middle, bott
        // lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      headStyles: {
        fontSize: 12,
        valign: 'middle',
        halign: 'center',
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        fontSize: 12,
      },
      head: [encabezado],
      body: cuerpo,
    });
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        'Página ' + i + ' de ' + totalPages,
        doc.internal.pageSize.getWidth() / 2.3,
        doc.internal.pageSize.getHeight() - 10
      );
    }
    // Guardar automaticamente el PDF
    doc.save(titulo + '.pdf');
    /* doc.setProperties({
       title: titulo
     });
     doc.output('dataurlnewwindow');*/
  }

  generateExcelUI(encabezado: any, cuerpo: Array<any>, titulo: string) {
    const worksheetData: any[] = [];
    cuerpo.forEach((item: any) => {
      const worksheetItem = Object();
      encabezado.forEach((header) => {
        worksheetItem[header.key] = item[header.name];
      });
      worksheetData.push(worksheetItem);
    });
    // excel file
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');
    XLSX.writeFileXLSX(workbook, `${titulo}.xlsx`, {});
  }
}
