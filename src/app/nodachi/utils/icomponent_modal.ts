import { IComponent } from './icomponent';
import { CoreService } from './core-service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Listado genérico con crud usando modal */
export class IComponentModal<T> extends IComponent implements OnInit {
  public model: T;
  public modal_title: string;
  public modal_action: string;
  showPrint: boolean;

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
    public modelEmpty: T,
    public title: string = 'Administrar'
  ) {
    super(servicio, permissionKey, title);
    this.modal_title = '';
    this.modal_action = '';
    this.showPrint = true;
  }

  /* Guardar el modal vació para cuando se inserte uno nuevo */
  ngOnInit(search = true): void {
    super.ngOnInit();

    this.loadState();

    if (search) {
      this.search();
    }

    this.model = Object.assign({}, this.modelEmpty);
  }

  /**
   * Enviar los datos a la Api para crear el objeto
   * @param {any} object - Instancia del objeto que se enviar a la API.
   */
  public create(object): void {
    this.servicio.create(object).subscribe(
      (response) => {
        if (response) {
          this.notification.verification(response);
          this.search();
          this.model = Object.assign({}, this.modelEmpty);
          this.closeModal();
        }
      },
      (error2) => {
        this.notification.verification(error2);
      }
    );
  }

  /**
   * Enviar los datos a la Api para crear el objeto
   * @param {any} object - Instancia del objeto que se enviar a la API.
   */
  public updatenew(object): void {
    this.servicio.create(object).subscribe(
      (response) => {
        if (response) {
          if (response.status === 201) {
            response.status = 200;
          }
          this.notification.verification(response);
          this.search();
          this.closeModal();
        }
      },
      (error2) => {
        this.notification.verification(error2);
      }
    );
  }

  /**
   * Enviar los datos a la Api para actualizar el objeto
   * @param {any} object - Instancia del objeto que se enviar a la API.
   */
  public update(object): void {
    this.servicio.update(object).subscribe(
      (response) => {
        this.notification.verification(response);
        this.search();
        this.closeModal();
      },
      (error2) => {
        this.notification.verification(error2);
      }
    );
  }

  onSubmit() {
    if (this.modal_action === 'add') {
      this.create(this.model);
    }
    if (this.modal_action === 'update') {
      this.update(this.model);
    }
  }

  /**
   * Ocultar el modal después de insertado o actualizado un objeto
   */
  public closeModal(): void {
    this.hideModal();
    this.model = Object.assign({}, this.modelEmpty);
  }

  /**
   * Abrir el modal para insertar o actualizar un objeto
   */
  public createModal(modal: string = 'add'): void {
    this.model = Object.assign({}, this.modelEmpty);
    this.modal_action = modal;
    this.modal_title = 'Nuevo';
    this.showModal(modal);
  }

  public updateModal(object: any, modal: string = 'update'): void {
    this.model = Object.assign({}, object);
    this.modal_action = modal;
    this.modal_title = 'Editar';
    this.showModal(modal);
  }

  public viewModal(object: any, modal: string = 'view'): void {
    this.model = Object.assign({}, object);
    this.modal_action = modal;
    this.modal_title = 'Detalles';
    this.showModal(modal);
  }
}
