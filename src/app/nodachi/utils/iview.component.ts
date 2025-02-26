import { Observable, throwError as observableThrowError } from 'rxjs';
import { AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from './core-service';
import { catchError, tap } from 'rxjs/operators';
import { IComponent } from './icomponent';
import { EMPTY } from 'rxjs';

/**
 * Componente genérico para visualizar un objeto
 */
export class IComponentView<T>
  extends IComponent
  implements OnInit, AfterViewInit
{
  list_items: Array<any>;

  /**
   * @constructor
   * @params {CoreService} servicio- servicios que realiza las peticiones
   * @params {ActivatedRoute} route - ruta para obtener el id desde la ruta
   * @params {Router} router - ruta para ir al componente del listado de todos los objetos
   * @params {string} title - titulo del componente.
   */
  constructor(
    private service: CoreService,
    public route: ActivatedRoute,
    public router: Router,
    public title: string = 'Detalles',
    public model: T
  ) {
    super(service, '', title);
    this.list_items = [];
  }

  /**
   * Obtener los datos del objeto que se visualiza desde la Api obteniendo el id desde la ruta activa
   */
  ngOnInit(search = true): void {
    this.ngOnInitObservable(null, search).subscribe();
  }

  ngOnInitObservable(id?, search = true): Observable<any> {
    this.loadState();
    this.setPerm(null);
    this.spin.startLoading();

    if (search) {
      return this.getById(
        id ? id : this.route.snapshot.paramMap.get('id')
      ).pipe(
        tap((model) => {
          this.model = model;
          this.spin.stopLoading();
        }),
        catchError((error2) => {
          this.spin.stopLoading();
          this.notification.verification(error2);
          this.goList();
          return observableThrowError(error2);
        })
      );
    }

    return EMPTY;
  }

  /**
   * Obtener los datos del objeto desde la Api dado un id
   * @param id
   * @returns {Observable<any>}
   */
  getById(id: number) {
    return this.service.getById(id);
  }

  /**
   * Retorna al listado de elementos correspondiente
   */
  goList(): void {
    const listUrl: string = this.router.url.replace(/\/view\/\d+$/, '/list');
    this.router.navigateByUrl(listUrl).then();
  }
}
