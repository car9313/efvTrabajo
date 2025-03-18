import {
  Observable,
  Observer,
  of,
  throwError as observableThrowError,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { UserLogin } from './login';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ConfigService } from '@app/nodachi/services/config.services';
import { UserService } from '../user/user.service';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { SignalRService } from '@app/nodachi/services/signal-r.service';
import { TokenStorageService } from './token-storage.service';
import { User } from '../user/user';

interface AuthResponseBody {
  access_token: string;
  token_type: string;
  expires_in: string;
  refresh_token: string;
  client_id: string;
  userName: string;
  issued: string;
  expires: string;
}

type AuthHttpResponse = HttpResponse<AuthResponseBody>;

@Injectable()
export class LoginService {
  private static observers: Observer<any>[] = [];

  private static renewRequested = false;

  private url: string;

  private refreshUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private userService: UserService,
    private tokenStorageService: TokenStorageService
  ) {
    this.url = this.config.url() + this.config.getConst('loginURL');
    this.refreshUrl =
      this.config.url() + this.config.getConst('refreshTokenURL');
  }
  login(user: UserLogin): Observable<boolean> {
    const httpParams = this.getHttpParamsLogin(user);
    return this.http
      .post<AuthResponseBody>(this.url, httpParams, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        map((res: AuthHttpResponse) => {
          if (res.body) {
            this.tokenStorageService.setLocalStorage(res.body);
            return true;
          }
          return false;
        }),
        switchMap((login: boolean) => {
          if (login) {
            return this.userService.currentUser().pipe(
              map((resp: User) => {
                if (resp.roles) {
                  this.userService.setPerms(resp.roles);
                  localStorage.removeItem('user_loggued');
                  this.userService.setAccess({
                    user_type: resp.user_type,
                  });
                }
                return true;
              })
            );
          }
          return of(false);
        }),
        catchError((err: Error) => {
          this.tokenStorageService.clearLocalStorage();
          return observableThrowError(err);
        })
      );
  }

  logout(): Observable<boolean> {

  console.log('Entro Logout')
    SignalRService.disconnect();
  const prueba= localStorage.getItem('refresh_token');
    return this.http
      .post(this.config.url() + '/api/v1/users/logout', {
        refresh_token: prueba,
      })
      .pipe(
        catchError(() => {

          console.log('Error al hacer logout')
          return of({});
        }),
        map(() => {

          console.log('Peticion exitosa Logout')
          this.tokenStorageService.clearLocalStorage();
          window.location.href = '/login';
          return false;
        })

      );
  }

  renewAccessToken(): Observable<boolean> {

   console.log('Renovando el token')
    const refreshToken = localStorage.getItem('refresh_token');
    console.log(refreshToken)
    if (!refreshToken) {
      console.log('No hay refresh token el el local storage')
      return of(false);
    }
    // si no es la primera solicitud al token renew
    if (LoginService.renewRequested) {
      console.log('renewRequested',LoginService.renewRequested)
      console.log(' Hay refresh token el el local storage')
      return new Observable<boolean>((observer) => {
        LoginService.observers.push(observer);
      });
    }
    // si es la primera solicitud al token renew
    LoginService.renewRequested = true;

    console.log('renewRequested',LoginService.renewRequested)


    const httpParams = this.getHttpParamsRenewToken(refreshToken);
    return this.http
      .post<AuthResponseBody>(this.refreshUrl, httpParams, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        catchError(() => {
          console.log('renewRequested',LoginService.renewRequested)
          console.log('Error en la peticion de refrescar el token')
          return of({});
        }),
        map((res: AuthHttpResponse) => {
          LoginService.renewRequested = false;

          console.log('renewRequested',LoginService.renewRequested)
          console.log('Body',res.body)
          console.log('OK en la peticion de refrescar el token')

          if (res.body) {
            this.tokenStorageService.setLocalStorage(res.body);
            console.log('LocalStorage',res.body)
            console.log('renewRequested',LoginService.renewRequested)
            return true;
          }
          return false;
        }),
        map((renew: boolean) => {
          console.log(' resolver todos los demas observers a la espera')
          // resolver todos los demas observers a la espera
          while (LoginService.observers.length > 0) {
            const observer = LoginService.observers.shift();
            observer.next(renew);
          }
          console.log('renew',renew)
          return renew;
        }),
        finalize(() => {
          LoginService.renewRequested = false;
        })
      );
  }
  getVersion(): Observable<any> {
    return this.http.get(this.config.url() + '/api/v1/users/version');
  }

  isLoggedIn(renew = false): Observable<boolean> {
    if (!this.tokenStorageService.hasExpiredToken()) {
      return of(true);
    }
    return renew ? this.renewAccessToken() : of(false);
  }

  getAuthorizationHeader(): string {
    return sessionStorage.getItem('access_token') || '';
  }
  getHttpParamsLogin(user: UserLogin) {
    return {
      username: user.username,
      grant_type: 'password',
      password: user.password,
      source: 'saipci-ui',
      client_id: this.config.getClientId(),
      fingerprint: this.tokenStorageService.getFingerprint(),
    };
  }
  getHttpParamsRenewToken(refreshToken: string) {
    return {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.getClientId(),
    };
  }
}
