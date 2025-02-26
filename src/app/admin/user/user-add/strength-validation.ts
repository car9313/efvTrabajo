import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {IPasswordSettings} from '../../security-settings/security.settings';

export interface PasswordStrengthResult {
  messages: string[];
  indicatorText: string;
  strength: number;
  strengthText: string;
}

export function StrengthValidator(passwordSettings: IPasswordSettings): ValidatorFn {
  return (control: AbstractControl) => {

    let password: string = control.value;

    if (isNullOrUndefined(password)) {
      return null;
    }
    if (passwordSettings.empty && password.length === 0) {
      return null;
    }
    const result: PasswordStrengthResult = {indicatorText: '', messages: [], strength: 100, strengthText: ''};
    const mensajes = {
      addLowerCase: 'Tener letras minúsculas',
      addNumbers: 'Tener números',
      addPunctuation: 'Tener signos de puntuación',
      addUpperCase: 'Tener letras mayúsculas',
      sameAsUsername: 'Debe ser diferente de su nombre de usuario',
      tooShort: (length) => `Tener al menos ${length} caracteres`,
      weak: 'Débil',
      fair: 'Razonable',
      good: 'Bueno',
      strong: 'Fuerte',
    };

    password = password.trim();

    let weaknesses = 0;

    const hasLowercase = (passwordSettings.requires_lowercase) ? /[a-z]+/.test(password) : true;
    const hasUppercase = (passwordSettings.requires_uppercase) ? /[A-Z]+/.test(password) : true;
    const hasNumbers = (passwordSettings.requires_digits) ? /[0-9]+/.test(password) : true;
    const hasPunctuation = (passwordSettings.requires_special_chars) ? /[^a-zA-Z0-9]+/.test(password) : true;

    // Lose 5 points for every character less than 6, plus a 30 point penalty.
    if (password.length < passwordSettings.min_length) {
      result.messages.push(mensajes.tooShort(passwordSettings.min_length));
      result.strength -= ((passwordSettings.min_length - password.length) * 5) + 30;
    }

    // Count weaknesses.
    if (!hasLowercase) {
      result.messages.push(mensajes.addLowerCase);
      weaknesses++;
    }
    if (!hasUppercase) {
      result.messages.push(mensajes.addUpperCase);
      weaknesses++;
    }
    if (!hasNumbers) {
      result.messages.push(mensajes.addNumbers);
      weaknesses++;
    }
    if (!hasPunctuation) {
      result.messages.push(mensajes.addPunctuation);
      weaknesses++;
    }

    // Apply penalty for each weakness (balanced against length penalty).
    switch (weaknesses) {
      case 1:
        result.strength -= 12.5;
        break;

      case 2:
        result.strength -= 25;
        break;

      case 3:
        result.strength -= 40;
        break;

      case 4:
        result.strength -= 40;
        break;
    }

    // Based on the this.strength, work out what text should be shown by the password this.strength meter.
    if (result.strength < 60) {
      result.indicatorText = mensajes.weak;
      result.strengthText = 'weak';
    } else if (result.strength < 70) {
      result.indicatorText = mensajes.fair;
      result.strengthText = 'fair';
    } else if (result.strength < 80) {
      result.indicatorText = mensajes.good;
      result.strengthText = 'good';
    } else if (result.strength <= 100) {
      result.indicatorText = mensajes.strong;
      result.strengthText = 'strong';
    }

    return result.messages.length > 0 ? {passwordStrength: result} : null;
  };
}

export const equalsPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const password_confirmation = control.get('password_confirmation');

  if (!isNullOrUndefined(password) && !isNullOrUndefined(password.value) && password.value.length === 0) {
    return null;
  }

  return password && password_confirmation && password.value === password_confirmation.value ?
    null : {'equalsPassword': true};
};
