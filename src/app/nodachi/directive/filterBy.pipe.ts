import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterby'
})
export class FilterByPipe implements PipeTransform {

  transform(value: any, key = null, valor: any = false) {
    return key ? value.filter(value2 => value2[key] === valor) : value;
  }
}
