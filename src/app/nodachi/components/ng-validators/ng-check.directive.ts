import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';


@Directive({
  selector: '[check]',
  providers: [{provide: NG_VALIDATORS, useExisting: NgCheckValidatorDirective, multi: true}]
})
export class NgCheckValidatorDirective implements Validator {
  @Input() check: string;

  validate(control: AbstractControl): any {
    return !this.check ? {wrong: this.check} : null;
  }
}

