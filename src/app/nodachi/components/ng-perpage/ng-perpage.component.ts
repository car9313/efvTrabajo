import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'ng-perpage',
  templateUrl: './ng-perpage.component.html',
  styleUrls: ['./ng-perpage.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgPerPageComponent),
      multi: true
    }
  ]
})
/**
 * Elementos por paginas
 */
export class NgPerPageComponent implements ControlValueAccessor {

  itemPerPage: number;
  private disabled: boolean;

  constructor() {
    this.itemPerPage = 10;
  }

  /**
   * Implementacion de la interfaz ControlValueAccessor
   */
  writeValue(value: any): void {
    if (value !== undefined) {
      this.itemPerPage = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(_: any) {
  }

  onTouched(): void {
  }

  /**
   * Ejecutar el onChange cuando cambi ale valor
   */
  change() {
    this.onChange(this.itemPerPage);
  }
}
