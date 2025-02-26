import { isNullOrUndefined } from '@app/nodachi/utils/utility';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ScDialogService } from '@app/nodachi/components/ng-dialog/sc-dialog.service';
import { PromptComponent } from '@app/nodachi/components/prompt/prompt.component';
import { IndividualConfig } from 'ngx-toastr/toastr/toastr-config';

@Injectable({
  providedIn: 'root',
})
export class Notifications {
  constructor(
    private toasrtService: ToastrService,
    private scDialogService: ScDialogService
  ) {}

  verification(res) {
    switch (res.status) {
      case 201:
        this.success(
          '<span class="far fa-check-circle"></span> Datos guardados correctamente.'
        );
        break;
      case 204:
        this.success(
          '<span class="far fa-check-circle"></span> Eliminado correctamente.'
        );
        break;
      case 200:
        this.success(
          '<span class="far fa-check-circle"></span> Sus datos han sido guardados satisfactoriamente.'
        );
        break;
      case 401:
        let msj = 'No tiene acceso a esta funcionalidad.';
        if (res.error) {
          msj = res.error.error_description;
        }
        this.error('<span class="fas fa-exclamation-triangle"></span>' + msj);
        break;
      case 0:
        this.error(
          '<span class="fas fa-exclamation-triangle"></span> No existe conexión con el servidor.'
        );
        break;
      case 400:
        const error =
          !isNullOrUndefined(res) && !isNullOrUndefined(res.error)
            ? res.error
            : {};

        if (!isNullOrUndefined(error)) {
          let valuesErrors = null;
          if (error.errors) {
            valuesErrors = Object.values(error.errors);
          } else {
            valuesErrors = Object.values(error);
          }
          if (valuesErrors != null) {
            const errors = valuesErrors.map((value: any) => value.map(v => v));
            this.error(
              `<span class="fas fa-exclamation-triangle"></span> ${errors.join(', ')}.`
            );
          } else {
            this.error(
              '<span class="fas fa-exclamation-triangle"></span> Error en el envío de datos.'
            );
          }
          break;
        }
      case 403:
        this.error(
          '<span class="fas fa-exclamation-triangle"></span> No tiene permisos suficientes.'
        );
        break;
      case 404:
        this.error(
          '<span class="fas fa-exclamation-triangle"></span> No se encuentra el elemento solicitado.'
        );
        break;
      case 409:
      case 503:
      case 504:
        this.error(
          `<span class="fas fa-exclamation-triangle"></span> ${res.error.Message}`
        );
        break;
      case 500:
      default:
        this.error(
          '<span class="fas fa-exclamation-triangle"></span> Error en el servidor.'
        );
        break;
    }
  }

  public removeConfirm(onConfirmed: () => void = null): void {
    this.confirm(
      'Atención!',
      'Desea eliminar el registro seleccionado',
      onConfirmed
    );
  }

  public confirm(
    title: string = '',
    message: string = '',
    onConfirmed: () => void = null,
    onCancel: () => void = null
  ): void {
    const dialogRef = this.scDialogService.open(PromptComponent, {
      width: '600px',
      hasBackdrop: true,
      panelClass: ['modal-content', 'rounded-2'],
      data: { title: title, message: message },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (typeof onConfirmed === 'function') {
          onConfirmed();
        }
      } else {
        if (typeof onCancel === 'function') {
          onCancel();
        }
      }
    });
  }

  public confirm1(
    title: string = '',
    message: string = '',
    onConfirmed: () => void = null,
    onCancel: () => void = null
  ): boolean {
    const dialogRef = this.scDialogService.open(PromptComponent, {
      width: '600px',
      hasBackdrop: true,
      panelClass: ['modal-content', 'rounded-2'],
      data: { title: title, message: message },
    });
    let isConfirm = false;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (typeof onConfirmed === 'function') {
          onConfirmed();
          isConfirm = true;
        }
      } else {
        if (typeof onCancel === 'function') {
          onCancel();
          isConfirm = false;
        }
      }
    });
    return isConfirm;
  }

  public confirmObservable(): Observable<boolean> {
    const dialogRef = this.scDialogService.open(PromptComponent, {
      width: '600px',
      hasBackdrop: true,
      panelClass: ['modal-content', 'rounded-2'],
      data: { title: 'Aviso', message: 'Desea salir sin guardar' },
    });
    return dialogRef.afterClosed();
  }

  public error(msg: string, wait?: number, callback?) {
    this.toasrtService.error(msg, '', {
      timeOut: isNullOrUndefined(wait) ? 5000 : wait,
    });
  }

  public success(msg: string, wait?: number, callback?) {
    this.toasrtService.success(msg, '', {
      timeOut: isNullOrUndefined(wait) ? 5000 : wait,
    });
  }

  public warning(msg: string, wait?: number, callback?) {
    this.toasrtService.warning(msg, '', {
      timeOut: isNullOrUndefined(wait) ? 5000 : wait,
    });
  }

  public info(
    msg: string,
    wait?: number,
    override?: Partial<IndividualConfig>,
    callback?
  ) {
    override = override || {};
    override.timeOut = isNullOrUndefined(wait) ? 5000 : wait;
    this.toasrtService.info(msg, '', override);
  }
}
