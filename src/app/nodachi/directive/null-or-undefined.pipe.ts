import {Pipe, PipeTransform} from '@angular/core';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';

@Pipe({
  name: 'isNullOrUndefined'
})
export class NullOrUndefinedPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return isNullOrUndefined(value) || value === '';
  }
}
