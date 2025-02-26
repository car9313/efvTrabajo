import { Router } from '@angular/router';
import { IComponent } from './icomponent';
import { CoreService, ISearchParams } from './core-service';
import { Input, OnInit } from '@angular/core';
import { isNullOrUndefined } from '@app/nodachi/utils/utility';
import { isEmptyObject } from 'jquery';

/** Listado genérico con crud sin modal */
export class IComponentList extends IComponent implements OnInit {
  redirectToAdd: boolean;
  showPrint: boolean;
  hideSearch: boolean;
  @Input() hideCreate: boolean;

  /**
   * @constructor
   * @params {CoreService} servicio- servicios que realiza las peticiones
   * @params {string} permissionKey - llave de los permisos para el macheo
   * @params {string} title - titulo del componente
   * @params {Router} router - ruta para ir al componente update y create
   */
  constructor(
    public servicio: CoreService,
    public permissionKey: string,
    public title: string,
    public router: Router
  ) {
    super(servicio, permissionKey, title);
    this.redirectToAdd = true;
    this.hideCreate = false;
    this.showPrint = true;
    this.hideSearch = false;
  }

  /**
   * @param {boolean} [search=true] Hacer la busqueda o no en el init (en el momento de invocar super.onInit)
   *
   * @memberOf IComponentList
   */
  ngOnInit(search = true) {
    super.ngOnInit();
    this.loadState();

    this.$searchFilter.subscribe(
      (resp) => {
        if (
          this.redirectToAdd &&
          !isNullOrUndefined(this.permissions.create) &&
          this.permissions.create &&
          !isNullOrUndefined(resp.objects) &&
          resp.objects.length === 0 &&
          isNullOrUndefined(this.searchParams.search) &&
          (isNullOrUndefined(this.searchParams.other_params) ||
            isEmptyObject(this.searchParams.other_params))
        ) {
          this.create();
        }
      },
      () => { }
    );

    if (search) {
      this.search(false, true);
    }
  }

  /**
   *  Ir al componente de crear nuevo objeto
   */
  public create(): void {
    const createUrl: string = this.router.url.replace(/\/list$/, '/add');
    this.router.navigateByUrl(createUrl).then();
  }

  /** Ir al componente de actualizar objeto
   * @param {any} object - Instancia del objeto que se actualiza.
   */
  public update(object: any): void {
    const updateUrl: string =
      this.router.url.replace(/\/list$/, '/edit') + '/' + object.id.toString();
    this.router.navigateByUrl(updateUrl).then();
  }

  public view(object: any): void {
    const viewUrl: string =
      this.router.url.replace(/\/list$/, '/view') + '/' + object.id.toString();
    this.router.navigateByUrl(viewUrl).then();
  }
}
