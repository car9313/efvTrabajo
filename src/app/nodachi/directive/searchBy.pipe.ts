import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'searchBy',
})
export class SearchByPipe implements PipeTransform {

  transform(value: any, key = null, valor = '') {
    if (valor === '') {
      return value;
    }
    return key ? value.filter(value2 => (<string>value2[key]).toLocaleLowerCase().indexOf(valor.toLocaleLowerCase()) !== -1) : value;
  }
}
