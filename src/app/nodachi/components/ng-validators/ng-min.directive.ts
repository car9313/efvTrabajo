import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators} from '@angular/forms';
import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[min]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NgMinDirective,
      multi: true
    }
  ]
})
export class NgMinDirective implements Validator {

  @Input() min: number;

  constructor() {
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return (Validators.min(this.min))(c);
  }
}
