import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'ng-fbutton',
  templateUrl: './ng-fbutton.component.html',
  styleUrls: ['./ng-fbutton.component.scss'],
})
/**
 * Componente para los botones genéricos del formulario.
 */
export class NgFbuttonComponent {

  @Input() disabled: boolean;
  @Input() textSave = 'Guardar';
  @Input() textSaveAndNew = 'Guardar y Agregar Nuevo';
  @Input() textRemove = 'Eliminar';
  @Input() textCancel = 'Cancelar';
  @Input() textOptional1 = '';
  @Input() showSaveNew = true;
  @Input() showSave = true;
  @Input() showRemove = false;
  @Input() showCancel = true;
  @Input() showOptional1 = false;
  @Output() save = new EventEmitter();
  @Output() saveNew = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() optional1 = new EventEmitter();

  /**
   * Emitir el evento save del formulario
   */
  clickSave() {
    this.save.emit();
  }

  /**
   * Emitir el evento saveNew del formulario
   */
  clickSaveNew() {
    this.saveNew.emit();
  }

  /**
   * Emitir el evento cancel del formulario
   */
  clickCancel() {
    this.cancel.emit();
  }

  /**
   * Emitir el evento cancel del formulario
   */
  clickRemove() {
    this.remove.emit();
  }

  /**
   * Emitir el evento optional1 del formulario
   */
  clickOptional1() {
    this.optional1.emit();
  }
}
