import { Action } from '../roles/actions';
import { RoleService } from '../roles/roles.service';
import { Component, OnInit } from '@angular/core';
import { Role } from '../roles/roles';
import { Permissions } from './permissions';
import { PermissionsCategory } from './permissions-category';
import { ConfigService } from '@app/nodachi/services/config.services';
import { UserService } from '../user/user.service';
import { animations } from '@app/nodachi/utils/animations';
import { Notifications } from '@app/nodachi/services/notifications';
import { Utility } from '@app/nodachi/utils/utility';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinService } from '@app/nodachi/components/ng-spin/spin.service';
import { ServiceLocator } from '@app/nodachi/services/locator.service';
import { SaicoLayoutService } from '../saico-layout/saico-layout.service';
import {
  INgChoosenOpts,
  NgChoosenOpts,
} from '@app/nodachi/components/ng-choosen/ng-choosen-opts';
import { IsFilter } from '@app/nodachi/decorators/is-filter.decorator';
import {User} from "@app/admin";

class PermissionAction {
  private constructor(
    public name: string = '',
    public description: string = ''
  ) {}

  public static actions = [
    new PermissionAction('create', 'Crear'),
    new PermissionAction('read', 'Leer'),
    new PermissionAction('update', 'Actualizar'),
    new PermissionAction('delete', 'Eliminar'),
  ];
}

@Component({
  selector: 'app-permisisons',
  templateUrl: './permissions.component.html',
  animations: animations,
})
export class PermissionComponent implements OnInit {
  title = 'Administrar Permisos';
  roles: Role[];
  roleId: number;
  permissions: Permissions[];
  permissions_categories: PermissionsCategory[];
  permissions_save: any[];
  perm;
  submitted: boolean;
  choosenOpts: NgChoosenOpts;
  myUser: User;

  public estados: any;
  public estadoschoosenOpts: NgChoosenOpts;
  @IsFilter() public actionEstadoFilter: number;
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private config: ConfigService,
    public router: Router,
    private route: ActivatedRoute,
    private notification: Notifications,
    private utility: Utility,
    private spin: SpinService
  ) {
    this.roles = [];
    this.perm = [];
    this.permissions = [];
    this.permissions_save = [];
    this.permissions_categories = [];
    this.submitted = false;
    this.choosenOpts = { textField: 'name', placeHolder: 'Seleccione Rol' };

    this.estadoschoosenOpts = {
      textField: 'value',
      valueField: 'key',
      placeHolder: 'Estados',
    };
  }

  getAllActionsDesc(): string[] {
    return PermissionAction.actions.map((action) => action.description);
  }

  getAllActions(): string[] {
    return PermissionAction.actions.map((action) => action.name);
  }

  ngOnInit(): void {
    ServiceLocator.get(SaicoLayoutService).setTitle(this.title);
    this.LoadData();
    this.perm = this.utility.getPermissions('Role');
    this.route.paramMap.subscribe((params) => {
      this.roleId = parseInt(params.get('id'), 10);
      /*    this.actionEstadoFilter = parseInt(params.get('id'), 10)
           console.log(this.roleId) */
    });
  }

    mySave(): void {
      this.userService.currentUser().subscribe((resp:User)=>{
        console.log(resp)
        this.myUser=resp;
      })
    console.log(this.myUser)
      const listRolCurrentUser=this.currentUser
      if ( this.utility.getCurrentUser) {
      const isConfirm: boolean = this.notification.confirm1(
        'Atención!',
        'Si  modifica su propios datos de usuario  la sesión se cierra una ves que los datos son guardados',
        () => {
          this.addPermission();
        }
      );
    } else {
      this.addPermission();
    }
  }

  /**
   * Envia los permisos
   *
   * @memberOf PermissionComponent
   */
  addPermission(): void {
    this.spin.startLoading();
    this.roleService
      .createPermissions(
        this.permissions_save.filter((perm) => perm.status !== Action.unchanged)
      )
      .subscribe(
        (res) => {
          this.currentUser();
          this.spin.stopLoading();
          if (res) {
            this.notification.verification(res);
          }
        },
        (error) => {
          this.spin.stopLoading();
          this.notification.verification(error);
        }
      );
  }

  /**
   * Accion de asignar un permiso a un recurso
   *
   * @param {any} element
   *
   * @memberOf PermissionComponent
   */
  public selectCheckbox(element): void {
    const element_value = element.target.attributes.value.value.split('__');

    this.setPermission(
      element_value[0],
      element_value[1],
      element.target.checked
    );
  }

  public setPermission(resource, action, checked): void {
    const permission: any = this.permissions_save.find(
      (perm) =>
        perm.resource === resource &&
        perm.role === this.roleId &&
        perm.action === action
    );
    if (checked) {
      if (!permission) {
        this.permissions_save.push({
          role: this.roleId,
          resource: resource,
          action: action,
          status: Action.added,
        });
      } else {
        permission.status = Action.added;
      }
    } else {
      if (permission) {
        permission.status = Action.deleted;
      } else {
        this.permissions_save.push({
          role: this.roleId,
          resource: resource,
          action: action,
          status: Action.deleted,
        });
      }
    }
  }

  /**
   * Carga los datos
   *
   * @memberOf PermissionComponent
   */
  LoadData(): void {
    this.spin.startLoading();
    this.roleService.getPermissions().subscribe((permissions_categories) => {
      const permissions_categories_aux = permissions_categories.filter(
        (item) => {
          if (item.name != 'Codificadores') {
            return item;
          }
          return item;
        }
      );
      this.permissions_categories = permissions_categories_aux;

      this.permissions = this.roleService.getPermissionsFromCategories(
        permissions_categories_aux
      );
    });
    this.roleService.getAll().subscribe((roles) => {
      this.roles = (roles.objects as Role[]).filter((item) => item.editable);
      this.LoadAllPermissionSaveData();
      this.spin.stopLoading();
    });
  }

  LoadAllPermissionSaveData(): void {
    this.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permission.actions.forEach((action) => {
          this.permissions_save.push({
            role: role.id,
            resource: permission.resource,
            action: action,
            status: Action.unchanged,
          });
        });
      });
    });
  }

  /**
   * Collapse de los modulos
   *
   * @param {*} category
   * @param event
   *
   * @memberOf PermissionComponent
   */
  collapse(category: any, event: any): void {
    if (event.target.type !== 'checkbox') {
      category.expanded = !category.expanded;
    }
  }

  /**
   * Para mostrar la marca en el seleccionar all de la categoria
   * @param category
   * @param {string} action
   * @returns {boolean}
   */
  isCheckedAll(category: PermissionsCategory, action: string): boolean {
    const permissions = this.getCategoryPermissionsAvailable(category, action);

    if (this.permissions.length === 0) {
      return false;
    }

    let checked = true;
    permissions.forEach((perm: Permissions) => {
      if (
        this.permissions_save.find(
          (p) =>
            p.resource === perm.resource &&
            p.action === action &&
            p.role === this.roleId &&
            p.status !== Action.deleted
        ) == null
      ) {
        checked = false;
        return;
      }
    });
    return checked;
  }

  getCategoryPermissionsAvailable(
    category: PermissionsCategory,
    action: string
  ): Permissions[] {
    console.log(this.permissions);
    console.log(category);
    return category.permissions.filter((perm: Permissions) => {
      return perm.actions.indexOf(action) >= 0;
    });
  }

  checkAll(category: PermissionsCategory, action: string, event): void {
    const permissions = this.getCategoryPermissionsAvailable(category, action);

    permissions.forEach((perm: Permissions) => {
      this.setPermission(perm.resource, action, event.target.checked);
    });
  }

  /**
   * Para mostrar la marca en el checkbox
   *
   * @param {any} res
   * @param {any} rol
   * @param {any} action
   * @returns {boolean}
   *
   * @memberOf PermissionComponent
   */
  ispermission(res, rol, action): boolean {
    return (
      this.permissions_save.find((perm) => {
        return (
          perm.resource === res &&
          perm.role === this.roleId &&
          perm.action === action &&
          perm.status !== Action.deleted
        );
      }) != null
    );
  }

  /**
   * Refrescar los permisos recien creados al usuario actual
   *
   * @private
   *
   * @memberOf PermissionComponent
   */
  private currentUser() {
    // const _key = this.config.getSecretKey();
    this.userService.currentUser().subscribe((res) => {
      if (res.roles) {
        this.userService.setPerms(res.roles);
        this.router.navigate(['/admin/permisos']).then();
      }
    });
  }

  /**
   * Obtiene un arreglo indicando que acciones estan y cuales no en el orden
   * create, read, update, delete
   *
   * @returns {any[]}
   *
   * @memberOf Permissions
   */
  getDefinedActions(permission: Permissions): any[] {
    const result: any[] = [];
    PermissionAction.actions.forEach((action) => {
      result.push({
        name: action.name,
        value: permission.actions.includes(action.name),
      });
    });
    return result;
  }
}
