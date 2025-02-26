import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {equalsPasswordValidator, StrengthValidator} from './strength-validation';

@Directive({
  selector: '[passwordStrength][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordStrengthDirective, multi: true}]
})
export class PasswordStrengthDirective implements Validator {
  validator: ValidatorFn;
  @Input() passwordStrength;
  constructor() {
    this.passwordStrength = {
      valid_days: 90,
      history_min_count: 24,
      password_default_value: '',
      min_length: 8,
      requires_uppercase: true,
      requires_lowercase: true,
      requires_digits: true,
      requires_special_chars: true
    };
  }
  validate(control: AbstractControl) {
    this.validator = StrengthValidator(this.passwordStrength);
    return this.validator(control);
  }

}


@Directive({
  selector: '[equalsPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EqualsPasswordValidatorDirective, multi: true }]
})
export class EqualsPasswordValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return equalsPasswordValidator(control);
  }
}
