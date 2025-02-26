import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[var]',
  exportAs: 'var'
})

export class NgVarDirective {
  constructor() { }

  @Input() var: any;
}
