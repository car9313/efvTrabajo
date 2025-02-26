import { Router } from '@angular/router';
import { CoreService } from './core-service';
import { AfterViewInit, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgForm } from '@angular/forms';
import { IComponent } from './icomponent';


/**
 * Componente genérico para crear un objeto en la Api
 */
export class IComponentCreate<T> extends IComponent implements OnInit, AfterViewInit {

  @ViewChildren(NgForm) forms: QueryList<NgForm>;

  emptyModal: any;

  /**
   * @params {CoreService} servicio- servicios que realiza las peticiones
   * @params {Router} router - ruta para ir al componente update y create
   * @params {string} title - titulo del componente
   * @params {any} model - clase con los atributos del objeto que se inserta
   */
  constructor(private service: CoreService, public router: Router, public title: string, public model: T) {
    super(service, 'None', title);
    this.emptyModal = Object.assign({}, model);
  }

  ngOnInit(): void {
    this.ngOnInitObservable().subscribe();
  }

  ngOnInitObservable(): Observable<any> {
    this.setPerm(this.permissionKey);
    return of(true);
  }

  /**
   * Salvar el objeto cuando se envia le formulario
   */
  onSubmit(): void {
    this.save();
  }

  /**
   * Salvar el objeto y crear uno nuevo
   */
  saveNew() {
    this.save(true);
  }

  /**
   * Función para manupilar el objeto antes de ser salvado
   */
  preSave(): void {
  }

  /**
   *  Función para manipular el objeto siguiente después de haber salvado
   */
  postSave(resp = null): void {
  }

  /**Enviar los datos a la Api para insertar
   * @param newElement - define si se crear otro elemento despues de salvar este o se va al listado de elementos
   */
  save(newElement: boolean = false): void {
    this.spin.startLoading();
    this.preSave();
    this.service.create(this.model)
      .subscribe(res => {
        this.spin.stopLoading();
        this.notification.verification(res);
        this.model = Object.assign({}, this.emptyModal);
        this.resetForms();
        this.postSave(res);
        if (newElement) {
          this.goWhenSave(res);
        } else {
          this.goList();
        }
      },
        error2 => {
          this.spin.stopLoading();
          this.notification.verification(error2);
        });
  }

  resetForms() {
    this.forms.forEach(item => {
      item.reset();
    });
  }

  /**
   * Retorna al listado de elementos correspondiente
   */
  goWhenSave(res) {
  }

  /**
   * Retorna al listado de elementos correspondiente
   */
  goList(): void {
    const listUrl: string = this.router.url.replace(/\/add$/, '/list');
    this.router.navigateByUrl(listUrl).then();
  }
}
