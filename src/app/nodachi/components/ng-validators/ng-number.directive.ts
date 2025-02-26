import {Directive, ElementRef, Input} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';

@Directive({
  selector: '[number]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NgNumberDirective,
      multi: true,
    },
  ],
})
export class NgNumberDirective implements Validator {
  numberRegex: RegExp = new RegExp(`^\\d+$`);

  @Input()
  number: any;

  constructor(private el: ElementRef) {
    this.numberRegex = new RegExp(`^\\d+$`);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    const valid =
      isNullOrUndefined(c.value) ||
      c.value === '' ||
      this.numberRegex.test(c.value);
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
