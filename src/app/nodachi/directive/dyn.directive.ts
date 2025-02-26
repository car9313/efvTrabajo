import {Directive, Input, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[dynHost]',
})
export class DynDirective {
  [propNames: string]: any;
  @Input() dynHost: any;
  constructor(public viewContainerRef: ViewContainerRef) { }
}
