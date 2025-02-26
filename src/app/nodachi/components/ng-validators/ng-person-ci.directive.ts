import {Directive, ElementRef, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';

@Directive({
  selector: '[validateCi]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NgPersonCiDirective,
      multi: true
    }
  ]
})
export class NgPersonCiDirective implements Validator {

  numberRegex: RegExp;

  @Input()
  public set validateCi(value: number) {
    this.numberRegex = new RegExp(`^\\d{${value},11}$`);
  }

  constructor(private el: ElementRef) {
    this.numberRegex = new RegExp('^\\d{2,11}$');
  }

  validate(c: AbstractControl): ValidationErrors | null {
    const valid = isNullOrUndefined(c.value) || c.value === '' || this.numberRegex.test(c.value);
    if (c.dirty) {
      if (valid) {
        this.el.nativeElement.classList.remove('is-invalid');
      } else {
        this.el.nativeElement.classList.add('is-invalid');
      }
    }
    return valid ? null : {'invalid-ci': {value: c.value}};
  }

  registerOnValidatorChange(fn: () => void): void {
  }
}
