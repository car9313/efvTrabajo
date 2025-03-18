import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

import { User } from './user';
import { CoreService } from '@app/nodachi/utils/core-service';
import { ConfigService } from '@app/nodachi/services/config.services';
import { Observable, of } from 'rxjs';
import { isNullOrUndefined } from '@app/nodachi/utils/utility';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable()
export class UserService extends CoreService {

  private readonly secretKey: string;

  constructor(private config: ConfigService, protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/users');
    this.secretKey = config.getSecretKey();
  }

  currentUser(): Observable<any> {
    return this.httpClient.get<User>(`${this.url()}/current`)
      .pipe(catchError(UserService.handleError));
  }

  get currentUserName(): string {
    return localStorage.getItem('user_name');
  }

  setPerms(roles: Array<any>) {
    const aux: Array<any> = [];
    let count = 0;
    let count_actions = 0;
    for (let i = 0; i < roles.length; i++) {
      for (let j = 0; j < roles[i].permissions.length; j++) {
        if (aux.length === 0) {
          aux.push(roles[i].permissions[j]);
          count++;
        } else {
          let new_var = 0;
          count = aux.length;
          for (let k = 0; k < aux.length; k++) {
            if (aux[k].resource === roles[i].permissions[j].resource) {
              for (let z = 0; z < roles[i].permissions[j].actions.length; z++) {
                if (aux[k].actions[count_actions] !== roles[i].permissions[j].actions[z]) {
                  aux[k].actions.push(roles[i].permissions[j].actions[z]);
                  count_actions++;
                }
              }
              break;
            }
            new_var++;
          }

          if (new_var === count) {
            aux.push(roles[i].permissions[j]);
          }
        }
      }
    }
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(aux), this.secretKey);
    localStorage.removeItem('mrep_up');
    localStorage.setItem('mrep_up', encrypted);
  }

  setAccess(item: any) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(item), this.secretKey);
    localStorage.removeItem('access_up');
    localStorage.setItem('access_up', encrypted);
  }

  setAvatar(id: number, file: File): Observable<any> {
    if (!isNullOrUndefined(file)) {
      const formData: FormData = new FormData();
      formData.append('photo', file, file.name);
      return this.httpClient.post(`${this.url()}/${id}/avatar`, formData, {
        observe: 'response',
        headers: {
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1;mode=block',
          'X-Content-Type-Options': 'nosniff'
        },
      });
    }
    return of(false);
  }

  changePassword(data): Observable<any> {
    console.log(data)
    return this.httpClient.post(`${this.url()}/change_password`, data, {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    })
  }

  resetPassword(id: any) {
    return this.httpClient.post(`${this.url()}/${id}/reset_password`, null, {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    });
  }

  killSession(id: any) {
    return this.httpClient.post(`${this.url()}/${id}/kill_session`, null, {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    });
  }

  getUserTypes(): Observable<any> {
    return this.httpClient.get(this.url() + '/user_type')
      .pipe(catchError(CoreService.handleError));
  }
  changeWorkStation(data): Observable<any> {
    return this.httpClient.post(`${this.url()}/change_workstation`, data, {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1;mode=block',
        'X-Content-Type-Options': 'nosniff'
      },
    });
  }
}
