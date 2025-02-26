import { Injectable } from '@angular/core';
import { constants } from '../../../environments/constants';
import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscriber } from 'rxjs';
import { isEmpty, map } from 'rxjs/operators';
import { coerceArray } from '@angular/cdk/coercion';
import { CurrentUser } from '@app/nodachi/models/current-user';
import { SpinService } from '@app/nodachi/components/ng-spin/spin.service';
import { isEmptyObject } from 'jquery';
import { AccessLevelType } from '../enum/access-level-type.enum';
import { AccessLevel } from './access-level';

export function isNullOrUndefined(value): boolean {
  return value === null || value === undefined;
}

export function isEmptyObjectProperties(value): boolean {
  for (const key in value) {
    if (!isNullOrUndefined(value[key])) {
      return false;
    }
  }
  return true;
}
/* El decorador @Injectable se utiliza para marcar una clase como un servicio inyectable. Cuando un servicio es inyectable, significa que puede ser incluido en la lista de dependencias y Angular puede proporcionar instancias de ese servicio a otras clases mediante la inyección de dependencias. */
@Injectable({ providedIn: 'root' })
export class Utility {
  constructor(private http: HttpClient, private spinService: SpinService) {}

  static getDocumentTypeRegex(): Array<any> {
    return Utility.getPlanoTypeRegex().concat([
      'application/msword',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
  }

  static getOfficeDocumentTypeRegex(): Array<any> {
    return Utility.getPlanoTypeRegex().concat([
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]);
  }

  static getPlanoTypeRegex(): Array<any> {
    return ['application/vnd.ms-visio.viewer', /image\/(.*)/];
  }

  hasPermission(
    resource: string | string[],
    permissions: string[] = ['read']
  ): boolean {
    if (isNullOrUndefined(resource) || isNullOrUndefined(permissions)) {
      return true;
    }
    const resources = coerceArray(resource);
    return resources.some((resource1) => {
      const perms = this.getPermissions(resource1);
      return permissions.some((perm) => {
        return perms.hasOwnProperty(perm);
      });
    });
  }

  getPermissions(resource: string): { [p: string]: boolean } {
    const res = this.currentUserPerms().find(
      (perm) => perm.resource === resource
    );
    const result = {};
    if (res && res.actions.length > 0) {
      res.actions.forEach((action) => {
        result[action] = true;
      });
    }
    return result;
  }

  currentUserPerms(): Array<any> {
    return this.getLocalStorage('mrep_up') || [];
  }

  getCurrentUser(): CurrentUser {
    return this.getLocalStorage('access_up');
  }

  getCurrentAccessLevel(): AccessLevel {
    const current = this.getLocalStorage('access_up');
    let value = null;
    let access = AccessLevelType.Nacional;
    switch (current.user_type) {
      case AccessLevelType.Municipal:
        value = current.municipality;
        access = AccessLevelType.Municipal;
        break;
      case AccessLevelType.Provincial:
        value = current.province;
        access = AccessLevelType.Provincial;
        break;
    }
    return { accessType: current.user_type, value };
  }

  getAccessLevelTypeStr(type: AccessLevelType) {
    switch (type) {
      case AccessLevelType.Municipal:
        return 'municipal';
      case AccessLevelType.Provincial:
        return 'provincial';
      default:
        return 'nacional';
    }
  }

  getLocalStorage(key: string): any {
   
    try {
      const bytes = CryptoJS.AES.decrypt(
        localStorage.getItem(key),
        constants.secretKey
      );
      const desencrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(desencrypted);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  getSesionStorage(key: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(
        sessionStorage.getItem(key),
        constants.secretKey
      );
      const desencrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(desencrypted);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  getObjectUrl(url): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let objectUrl: string = null;
      this.spinService.startLoading();
      this.http.get(url, { responseType: 'blob' }).subscribe((m) => {
        objectUrl = URL.createObjectURL(m);
        this.spinService.stopLoading();
        observer.next(objectUrl);
      });

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
    });
  }

  getPdfReport(url) {
    this.spinService.startLoading();
    this.http
      .get(url, { responseType: 'blob' })
      .pipe(map((m) => URL.createObjectURL(m)))
      .subscribe(
        (objectUrl) => {
          window.open(objectUrl);
          this.spinService.stopLoading();
        },
        (error1) => {}
      );
  }

  getPdfReportObservable(url): Observable<any> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((m) => {
        window.open(URL.createObjectURL(m));
        return true;
      })
    );
  }

  postFiles(
    id: number,
    url: string,
    files: Array<{ fileName: string; file: File }>
  ): Observable<any> {
    if (id) {
      let count = 0;
      const formData: FormData = new FormData();
      files.forEach((file) => {
        if (!isNullOrUndefined(file.file)) {
          formData.append(file.fileName, file.file, file.file.name);
          count++;
        }
      });
      if (count > 0) {
        return this.http.post(`${url}/${id}/files`, formData, {
          observe: 'response',
        });
      }
    }
    return of(false);
  }

  getCurrentUserName() {
    return localStorage.getItem('user_name');
  }

  isAdmin(): boolean {
    return localStorage.getItem('user_name') === 'admin' || false;
  }
}
