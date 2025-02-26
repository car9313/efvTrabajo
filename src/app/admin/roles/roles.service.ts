import { Injectable } from '@angular/core';
import { CoreService } from '@app/nodachi/utils/core-service';
import { HttpClient } from '@angular/common/http';
import { PermissionsCategory } from '../permissions/permissions-category';
import { Observable } from 'rxjs';
import { Permissions } from '../permissions/permissions';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleService extends CoreService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/api/v1/roles');
  }

  createPermissions(permisos: any[]): Observable<any> {
    console.log(permisos);
    debugger;
    return this.httpClient
      .put(this.url() + '/permissions', JSON.stringify(
        permisos
      ), {
        observe: 'response',
        headers: { 'Content-Type': 'application/json' }
      })
      .pipe(catchError(RoleService.handleError));
  }

  getPermissions(): Observable<PermissionsCategory[]> {
    return this.httpClient.get(this.url() + '/permissions')
      .pipe(map(response => response as PermissionsCategory[]),
        catchError(RoleService.handleError));
  }

  getPermissionsFromCategories(categories: PermissionsCategory[]): Permissions[] {
    return categories
      .map(c => c.permissions)
      .reduce((a, b) => a.concat(b));
  }
}
