import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanText'
})
export class BooleanTextPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value === true ? 'Si' : 'No';
  }

}
