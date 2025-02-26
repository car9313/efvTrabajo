import { Component, OnInit } from '@angular/core';
import { IComponentList } from '@app/nodachi/utils/icomponent_list';
import { animations } from '@app/nodachi/utils/animations';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Municipality, Province } from '../../../nomenclature';
import { isNullOrUndefined } from '@app/nodachi/utils/utility';
import { MunicipalityService, ProvService } from '@app/nodachi/common-services';
import { ServiceLocator } from '@app/nodachi/services/locator.service';
import { Utility } from '@app/nodachi/utils/utility';
import { Notifications } from '@app/nodachi/services/notifications';
import { SpinService } from '@app/nodachi/components/ng-spin/spin.service';
import { NgChoosenOpts } from '@app/nodachi/components/ng-choosen/ng-choosen-opts';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  animations: animations,
})
export class UserListComponent extends IComponentList implements OnInit {
  provincias: Province[];
  munis_filter: Municipality[];
  choosenOpts: NgChoosenOpts;
  choosenOptsMuni: NgChoosenOpts;

  static resetPassword(row) {
    const notification = ServiceLocator.get(Notifications);

    notification.confirm(
      'Atención!',
      `Desea restablecer la contraseña del usuario "${row.username}"`,
      () => {
        const spin = ServiceLocator.get(SpinService);
        const userService = ServiceLocator.get(UserService);
        spin.startLoading();

        userService.resetPassword(row.id).subscribe(
          () => {
            spin.stopLoading();
            notification.success(
              '<span class="far fa-check-circle"></span> Contraseña restablecida correctamente.'
            );
          },
          (error) => {
            spin.stopLoading();
            notification.verification(error);
          }
        );
      }
    );
  }

  static killSession(row) {
    const notification = ServiceLocator.get(Notifications);

    notification.confirm(
      'Atención!',
      `Desea forzar el cierre de sesión del usuario "${row.username}"`,
      () => {
        const spin = ServiceLocator.get(SpinService);
        const userService = ServiceLocator.get(UserService);
        spin.startLoading();

        userService.killSession(row.id).subscribe(
          () => {
            spin.stopLoading();
            notification.success(
              '<span class="far fa-check-circle"></span> Sesión cerrada correctamente.'
            );
          },
          (error) => {
            spin.stopLoading();
            notification.verification(error);
          }
        );
      }
    );
  }

  constructor(
    private userService: UserService,
    public router: Router,
    public provService: ProvService,
    public municipalityService: MunicipalityService,
    private utility: Utility
  ) {
    super(userService, 'User', 'Administrar Usuarios', router);
    this.headers = {
      username: 'Nombre de Usuario',
      name: 'Nombre y Apellidos',
      // province: 'Provincia',
      // municipality: 'Municipio',
    };
    this.headersExcel = [
      { name: 'username', key: 'Nombre de Usuario' },
      { name: 'name', key: 'Nombre' },
      { name: 'roles', key: 'Roles' },
      { name: 'province', key: 'Provincia' },
      { name: 'municipality', key: 'Municipio' },
      { name: 'province_work', key: 'Province Work' },
      { name: 'municipality_work', key: 'Municipality Work' },
    ];

    this.choosenOpts = { placeHolder: 'Provincia' };
    this.choosenOptsMuni = { placeHolder: 'Municipio' };

    this.extraHeaders = [];
  }

  ngOnInit() {
    super.ngOnInit(false);

    this.setPerm(this.permissionKey);

    this.listProv();

    if (!isNullOrUndefined(this.province_filter)) {
      this.loadMunFilter(this.province_filter, this.municipality_filter);
    }

    const permissionsResetPassword =
      this.utility.getPermissions('ResetPassword');

    if (permissionsResetPassword.update) {
      this.extraHeaders = [
        {
          title: '',
          tooltip: 'Restablecer contraseña',
          icon: 'fa fa-key',
          clickAction: UserListComponent.resetPassword,
        },
        // {
        //   title: '',
        //   tooltip: 'Cerrar Sesión',
        //   icon: 'fa fa-door-open',
        //   clickAction: UserListComponent.killSession,
        // },
      ];
    }

    this.search();

    this.spin.startLoading();
  }

  listProv(): void {
    this.munis_filter = [];
    this.municipality_filter = null;
    this.provService.getNomenclador<Province>().subscribe(
      (resp) => {
        this.provincias = resp;
      },
      () => {
        this.provincias = [];
      }
    );
  }

  loadMunFilter(province, newVal = null): void {
    this.municipality_filter = newVal;
    const params = { dpa_provinces_id: province };
    this.municipalityService
      .getNomenclador<Municipality>({ other_params: params })
      .subscribe(
        (resp) => {
          this.munis_filter = resp;
        },
        () => {
          this.munis_filter = [];
        }
      );
  }

  preSearch() {
    this.searchParams.other_params = {
      province_id: this.province_filter,
      municipality_id: this.municipality_filter,
    };
  }
}
