import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Notifications } from '../services/notifications';
import {
  CoreService,
  ISearchParams,
  ResponseCoreService,
} from './core-service';
import { isNullOrUndefined, Utility } from './utility';
import { ServiceLocator } from '../services/locator.service';
import { SaicoLayoutService } from '../../admin/saico-layout/saico-layout.service';
import { SpinService } from '../components/ng-spin/spin.service';
import { IExtraHeader } from '../components/ng-table/ng-table.component';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ScDialogService } from '@app/nodachi/components/ng-dialog/sc-dialog.service';
import { PrintComponent } from '@app/nodachi/components/print/print.component';
import { of, Subject } from 'rxjs';
import { CurrentUser } from '../models/current-user';
import { AccessLevelType } from '../enum/access-level-type.enum';
import { DecoratorsUtility } from '../decorators/decorators-utility';
import { IsFilter } from '../decorators/is-filter.decorator';
import { ICustomHeader } from '@app/nodachi/interfaces/icustom-header';

/**
 * Clase base de los listados genéricos
 */

export abstract class IComponent implements OnInit, AfterViewInit, OnDestroy {
  param_search: string;
  notification: Notifications;
  spin: SpinService;
  public permissions: {
    create?: boolean;
    delete?: boolean;
    update?: boolean;
    read?: boolean;
  };
  public totalItems: number;
  public currentpage: number;
  public currentItems: number;
  public itemPerPage: number;
  public totalPage: number;
  public objects: any[];
  public body: any[];
  public headers: any;
  public headersExcel: ICustomHeader[];
  public headerView: any;
  public selector;
  public extraHeaders: IExtraHeader[];
  public searchParams: ISearchParams;

  private printTitle: string;
  @IsFilter() province_filter: any;
  @IsFilter() municipality_filter: number;
  currentUser: CurrentUser;
  disable_prov: boolean;
  disable_mun: boolean;
  province_location: Array<number>;
  private _$search: Subject<ResponseCoreService<any>>;
  private _$searchFilter: Subject<ResponseCoreService<any>>;
  private _$remove: Subject<any>;
  private readonly _destroyed$: Subject<any>;
  cancelingComponent: boolean;
  viewState: {
    currentpage: number;
    itemPerPage: number;
    param_search: string;
    filters: any;
  };
  savedState: boolean;

  get $searchFilter() {
    return this._$searchFilter.asObservable();
  }

  get $search() {
    return this._$search.asObservable();
  }

  get $remove() {
    return this._$remove.asObservable();
  }

  get destroyed$() {
    return this._destroyed$;
  }

  get otherParams() {
    return this.searchParams ? this.searchParams.other_params : {};
  }

  /**
   * @constructor
   * @params {CoreService} servicio- servicios que realiza las peticiones
   * @params {string} permissionKey - llave de los permisos para el macheo
   * @params {string} title - titulo del componente
   */
  protected constructor(
    public servicio: CoreService,
    public permissionKey: string,
    public title: string = 'Administrar'
  ) {
    this.notification = ServiceLocator.get(Notifications);
    this.spin = ServiceLocator.get(SpinService);
    this.permissions = {};
    this.param_search = '';

    this.totalItems = 0;
    this.currentpage = 1;
    this.currentItems = 0;
    this.itemPerPage = 10;
    this.totalPage = 0;

    this.headers = {};
    this.headersExcel = [];
    this.headerView = {};

    this.province_filter = null;
    this.municipality_filter = null;
    this.currentUser = null;

    this.objects = [];
    this.body = [];
    this.extraHeaders = [];

    this.searchParams = {
      page: this.currentpage,
      per: this.itemPerPage,
      search: this.param_search,
      other_params: {},
    };

    this._$search = new Subject<ResponseCoreService<any>>();
    this._$searchFilter = new Subject<ResponseCoreService<any>>();
    this._$remove = new Subject<any>();
    this._destroyed$ = new Subject<any>();

    this.viewState = {
      currentpage: this.currentpage,
      itemPerPage: this.itemPerPage,
      param_search: this.param_search,
      filters: {},
    };

    this.savedState = false;
  }

  /** Obtener los datos desde la API y establecer los permisos */
  ngOnInit(): void {
    this.setPerm(this.permissionKey);
  }

  ngAfterViewInit(): void {
    ServiceLocator.get(SaicoLayoutService).setTitle(this.title);
  }

  /** Elimina un objeto en la API
   * @param {number} id - id del objeto que se manda a eliminar a la API.
   */
  public remove(id: number): void {
    this.servicio
      .remove(id)
      .pipe(takeUntil(this._destroyed$))
      .subscribe(
        (response) => {
          this._$remove.next(response);
          this.notification.verification(response);
          this.search();
        },
        (error1) => {
          this._$remove.next(error1);
        }
      );
  }

  /**
   * Mostrar la ventana para verificar si se elimina el objeto
   * @param {any} object - Instancia del objeto que se va a eliminar.
   *  @param {string} title - Nombre del objeto qe se mostrar en el mensaje.
   */
  public removeConfirm(object: any): void {
    const id = isNullOrUndefined(object.id) ? object.item.id : object.id;
    this.notification.removeConfirm(() => this.remove(id));
  }

  preSearch(): void {}

  /**
   * Obtiene los listados de objetos desde la API con paginado y parámetros, guardándolo en el atributo objects.
   * @param {boolean} reset - define si el *currentpage* empieza en 1, usado para ir a la primera pagina.
   * @param redirect
   */
  public search(reset: boolean = false, redirect: boolean = false): void {
    this.spin.startLoading();
    if (reset) {
      this.currentpage = 1;
    }
    this.searchParams.page = this.currentpage;
    this.searchParams.per = this.itemPerPage;
    this.searchParams.search = this.param_search;
    this.preSearch();
    if (!this.savedState) {
      this.saveState();
      this.savedState = false;
    }
    this.servicio
      .getAll(this.searchParams)
      .pipe(takeUntil(this._destroyed$))
      .subscribe(
        (objects) => {
          console.log(objects.objects);
          this.searchResult(objects);
          this._$search.next(objects);
          if (redirect) {
            this._$searchFilter.next(objects);
          }
        },
        (error) => {
          this._$search.error(error);
          this.currentItems = 0;
          this.totalPage = 0;
          this.totalItems = 0;
          this.objects = [];
          this.spin.stopLoading();
        }
      );
  }

  public searchResult<T>(objects: ResponseCoreService<T>) {
    this.currentItems = objects.objects.length;
    this.totalPage =
      objects.meta && !isNaN(objects.meta.total_pages)
        ? objects.meta.total_pages
        : 1;
    this.totalItems =
      objects.meta && !isNaN(objects.meta.total_count)
        ? objects.meta.total_count
        : this.currentItems;
    ({ objects: this.objects } = objects);
    this.spin.stopLoading();
  }

  /**
   * Establecer los permisos que tiene el usuario, segun la llave que se pasa por parametros
   */
  setPerm(perm): void {
    const utility = ServiceLocator.get(Utility);
    this.permissions = utility.getPermissions(perm);
    this.currentUser = utility.getCurrentUser();

    const accessLevel = utility.getCurrentAccessLevel();

    // Nivel de acceso Provincial o Municipal
    if (accessLevel.accessType < AccessLevelType.Nacional) {
      this.province_filter = this.currentUser.province;
      this.disable_prov = true;

      // Nivel de acceso Municipal
      if (accessLevel.accessType < AccessLevelType.Provincial) {
        this.municipality_filter = this.currentUser.municipality;
        this.disable_prov = true;
      }
    }

    this.province_location = this.currentUser.province_location;
  }

  /**
   * Abrir el modal para insertar o actualizar un objeto
   * @param {string} action clase csss para abrir el modal
   */
  public showModal(action: string): void {
    this.manageModal(action, 'show');
  }

  /**
   * Cerrar modal
   */
  public hideModal(action: string = 'show'): void {
    this.manageModal(action, 'hide');
  }

  public manageModal(
    modal: string,
    action: 'toggle' | 'show' | 'hide' | 'handleUpdate' | 'dispose'
  ) {
    setTimeout(() => {

      $(`.modal.${modal}`).modal(action);
    }, 0);
  }

  ngOnDestroy(): void {
    this._$search.unsubscribe();
    this._$searchFilter.unsubscribe();
    this._$remove.unsubscribe();
    this._destroyed$.next();
    ServiceLocator.get(SaicoLayoutService).setHelp('');
  }

  get printUrl(): string {
    return null;
  }

  print() {
    this.printTitle = this.printTitle || this.title;
    const dialogRef = ServiceLocator.get<ScDialogService>(ScDialogService).open(
      PrintComponent,
      {
        width: '600px',
        hasBackdrop: true,
        panelClass: ['modal-content', 'rounded-2'],
        data: { title: this.printTitle },
      }
    );
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result.action) {
            this.printTitle = result.title;
            return this.servicio.printList(
              this.searchParams,
              result.title,
              this.headers,
              this.printUrl
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        (objectUrl) => {
          if (objectUrl) {
            window.open(objectUrl);
          }
        },
        (error1) => {
          console.log(error1);
        }
      );
  }

  printUI(formato: string) {
    this.printTitle = this.printTitle || this.title;
    const dialogRef = ServiceLocator.get<ScDialogService>(ScDialogService).open(
      PrintComponent,
      {
        width: '600px',
        hasBackdrop: true,
        panelClass: ['modal-content', 'rounded-2'],
        data: { title: this.printTitle },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result.action) {
        this.searchParams.per = 10000000;
        this.printTitle = result.title;
        this.servicio
          .getAll(this.searchParams)
          .pipe(takeUntil(this._destroyed$))
          .subscribe(
            (objects) => {
              this.body = objects.objects;
              if (formato === 'pdf') {
                this.servicio.generatePdfUI(
                  this.headers,
                  this.body,
                  this.printTitle
                );
              } else {
                this.servicio.generateExcelUI(
                  this.headersExcel,
                  this.body,
                  this.printTitle
                );
              }
            },
            (error) => {
              this._$search.error(error);
              this.currentItems = 0;
              this.totalPage = 0;
              this.totalItems = 0;
              this.objects = [];
              this.spin.stopLoading();
            }
          );
        /*  this.body = this.objects;
          if (formato === 'pdf') {
            this.servicio.generatePdfUI(this.headers, this.body, this.printTitle);
          } else {
            this.servicio.generateExcelUI(this.headersExcel, this.body, this.printTitle);
          }*/
      } else {
        return of(null);
      }
    });
  }

  /**
   * Guarda el estado de filtros, paginado y search del componente e session
   * @param searchParams Opcional para indicar de donde tomar los parametros a guardar, en caso de ser nulos guarda los actuales
   */
  public saveState(filters?: any): void {
    this.savedState = true;

    filters = filters || {};

    filters.province_filter = this.province_filter;
    filters.municipality_filter = this.municipality_filter;

    this.viewState = {
      currentpage: this.currentpage,
      itemPerPage: this.itemPerPage,
      param_search: this.param_search,
      filters: DecoratorsUtility.getDecoratedProperties(this, IsFilter),
    };
    sessionStorage.setItem(
      'viewState_' + location.pathname,
      JSON.stringify(this.viewState)
    );
  }

  /**
   * Carga el estad de filtros, paginado y search del componente desde session
   *
   * @returns {(ISearchParams | null)}
   *
   * @memberOf IComponentList
   */
  public loadState(): void {
    const state = sessionStorage.getItem('viewState_' + location.pathname);
    if (state) {
      const parsed = JSON.parse(state);
      this.viewState = parsed;
      this.param_search = parsed.param_search;
      this.itemPerPage = parsed.itemPerPage;
      this.currentpage = parsed.currentpage;
      // tslint:disable-next-line:forin
      for (const key in this.viewState.filters) {
        this[key] = this.viewState.filters[key];
      }
    }
  }

  public hasFilters(): boolean {
    if (
      !isNullOrUndefined(this.viewState.param_search) &&
      this.viewState.param_search !== ''
    ) {
      return true;
    }
    for (const key in this.viewState.filters) {
      // si el filtro es provincia o municipio pero tiene restriccion por usuario no se considera como filtro
      if (
        (key === 'province_filter' && this.disable_prov) ||
        (key === 'municipality_filter' && this.disable_mun)
      ) {
        continue;
      }

      if (!isNullOrUndefined(this.viewState.filters[key])) {
        this.viewState.filters[key];
        return true;
      }
    }
  }

  public resetFilters(search = true): void {
    this.viewState.param_search = this.param_search = '';

    for (const key in this.viewState.filters) {
      // si el filtro es provincia o municipio pero tiene restriccion por usuario no se considera como filtro
      if (
        (key === 'province_filter' && this.disable_prov) ||
        (key === 'municipality_filter' && this.disable_mun)
      ) {
        continue;
      }
      this[key] = null;
    }

    if (search) {
      this.search(true);
    }
  }
}
