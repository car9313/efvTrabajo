import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterEqual',
})
export class FilterEqualPipe implements PipeTransform {

  transform(value: any = [], lista: Array<any>) {
    return value.filter(value2 => lista.find((value3) => value3.medios_portatiles_id === value2.id ) === undefined );
  }
}
