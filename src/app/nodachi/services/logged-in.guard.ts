import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginService } from '../../admin/login/login.service';
import { isNullOrUndefined, Utility } from '../utils/utility';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LoggedInGuard implements CanActivate, CanActivateChild {
  constructor(
    private login: LoginService,
    private router: Router,
    private utilityService: Utility
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const auth_route = route.data[0];
    const url: string = state.url;
    return this.checkLogin(url, auth_route);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }
  // chequea si el usuario esta logueado
  checkLogin(url: string, auth_route: any): Observable<boolean> {
    return this.login.isLoggedIn(true).pipe(
      switchMap((logged) => {
        if (logged) {
          if (
            // pregunta si el usuario es administrador
            this.utilityService.isAdmin() &&
            !isNullOrUndefined(auth_route) &&
            // devuelve un booleano indicando si el objeto tiene la propiedad especificada.
            auth_route.hasOwnProperty('resource') &&
            auth_route.resource === 'admin'
          ) {
            return of(true);
          }
          // chequea los permisos
          if (!this.checkPermissions(auth_route)) {
            this.router.navigate(['/no_access_page']).then();
            return of(false);
          }
          return of(true);
        }
        return this.login.logout();
      })
    );
  }

  checkPermissions(data: any): boolean {
    if (isNullOrUndefined(data)) {
      return true;
    }
    return this.utilityService.hasPermission(data.resource, data.permission);
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private login: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (this.login.getAuthorizationHeader()) {
      return this.login.isLoggedIn().pipe(
        switchMap((logged) => {
          if (logged) {
            this.router.navigate(['/']).then();
          }
          return of(!logged);
        })
      );
    } else {
      return of(true);
    }
  }
}
