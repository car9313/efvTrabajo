import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators} from '@angular/forms';
import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[max]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NgMaxDirective,
      multi: true
    }
  ]
})
export class NgMaxDirective implements Validator {

  @Input() max: number;

  constructor() {
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return (Validators.max(this.max))(c);
  }
}
