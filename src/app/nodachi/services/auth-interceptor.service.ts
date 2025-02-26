import { Observable, throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { LoginService } from '../../admin/login/login.service';
import { ServiceLocator } from './locator.service';
import { isNullOrUndefined } from '@app/nodachi/utils/utility';
import { ConfigService } from './config.services';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public static whitelist: any[] = [
    /\/authenticate$/,
    /\.\/assets\/config\..+\.json/,
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const whitelist = AuthInterceptor.whitelist.concat(ConfigService.whitelist);

    for (let i = 0; i < whitelist.length; i++) {
      if (whitelist[i] instanceof RegExp) {
        if (whitelist[i].test(req.url)) {
          return next.handle(req);
        }
      } else {
        if (req.url.startsWith(whitelist[i])) {
          return next.handle(req);
        }
      }
    }

    const login: LoginService = ServiceLocator.get(LoginService);

    let params = req.params;
    params.keys().forEach((value) => {
      if (isNullOrUndefined(params.get(value))) {
        params = params.delete(value);
      }
    });

    // Clone the request to add the new header.
    req = req.clone({
      setHeaders: {
        Authorization: login.getAuthorizationHeader(),
      },
      params: params,
    });
    const errorHandler = (err: any,  restart: Observable<any>) => {
     console.log(err);
     if (err.status === 401) {
        return login.renewAccessToken().pipe(
          switchMap((renew) => {
              if (renew) {
                req = req.clone({
                setHeaders: {
                  Authorization: login.getAuthorizationHeader(),
                },
              });
                return next.handle(req).pipe(catchError(errorHandler));
            }
              return login.logout();
          })
        );
      } else {
        return observableThrowError(err);
      }
    };

    // Pass on the cloned request instead of the original request.
    return next.handle(req).pipe(catchError(errorHandler));
  }
}
