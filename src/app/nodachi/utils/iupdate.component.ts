import { Observable, throwError as observableThrowError } from 'rxjs';
import { AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from './core-service';
import { catchError, tap } from 'rxjs/operators';
import { IComponent } from './icomponent';

/*Componente genérico para actualizar un objeto en la Api*/
export class IComponentUpdate<T>
  extends IComponent
  implements OnInit, AfterViewInit
{
  /**
   * @constructor
   * @params {CoreService} servicio- servicios que realiza las peticiones
   * @params {ActivatedRoute} route - ruta para obtener el id desde la ruta
   * @params {Router} router - ruta para ir al componente update y create
   * @params {string} title - titulo del componente
   * @params {any} model - clase con los atributos del objeto que se inserta
   */
  constructor(
    private service: CoreService,
    public route: ActivatedRoute,
    public router: Router,
    public title: string,
    public model: T
  ) {
    super(service, 'None', title);
  }

  ngOnInit(): void {
    this.ngOnInitObservable().subscribe();
  }

  /**
   * Obtener los datos del objeto que se actualiza desde la Api obteniendo el id desde la ruta activa
   */
  ngOnInitObservable(id?): Observable<any> {
    this.setPerm(this.permissionKey);

    this.spin.startLoading();

    return this.getById(id ? id : this.route.snapshot.paramMap.get('id')).pipe(
      tap((model) => {
        this.model = model;
        this.spin.stopLoading();
      }),
      catchError((error2) => {
        this.notification.verification(error2);
        this.spin.stopLoading();
        this.goList();
        return observableThrowError(error2);
      })
    );
  }

  /**
   * Obtener los datos del objeto desde la Api dado un id
   * @param id
   * @returns {Observable<any>}
   */
  getById(id: number) {
    return this.service.getById(id);
  }

  /*Salvar el objeto cuando se envia le formulario*/
  onSubmit(): void {
    this.save();
  }

  /*Salvar el objeto y crear uno nuevo*/
  saveNew() {
    this.save(true);
  }

  /* Función para manupilar el objeto antes de ser salvado*/
  preSave(): void {}

  /* Función para manipular el objeto siguiente después de haber salvado*/
  postSave(): void {}
  /**
   * Enviar los datos a la Api para insertar
   * @param {boolean} newElement - define si se crear otro elemento despues de salvar este o se va al listado de elementos
   */
  save(newElement: boolean = false): void {
    this.spin.startLoading();
    this.preSave();
    this.service.update(this.model).subscribe(
      (res) => {
        this.spin.stopLoading();
        this.notification.verification(res);
        this.postSave();
        if (newElement) {
          this.goNew();
        } else {
          this.goList();
        }
      },
      (error2) => {
        this.spin.stopLoading();
        this.notification.verification(error2);
      }
    );
  }

  savePost(newElement: boolean = false): void {
    this.spin.startLoading();
    this.preSave();
    this.service.create(this.model).subscribe(
      (res) => {
        this.spin.stopLoading();
        if (res.status === 201) {
          res.status = 200;
        }
        this.notification.verification(res);
        this.postSave();
        if (newElement) {
          this.goNew();
        } else {
          this.goList();
        }
      },
      (error2) => {
        this.spin.stopLoading();
        this.notification.verification(error2);
      }
    );
  }

  /**
   * Navegacion hacia el form de crear.
   */
  goNew() {
    const listUrl: string = this.router.url.replace(/\/edit\/\d+$/, '/add');
    this.router.navigateByUrl(listUrl).then();
  }

  /**
   * Retorna al listado de elementos correspondiente
   */
  goList(): void {
    this.cancelingComponent = true;
    const listUrl: string = this.router.url.replace(/\/edit\/\d+$/, '/list');
    this.router.navigateByUrl(listUrl).then(() => {
      this.cancelingComponent = false;
    });
  }
}
