import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[compare]',
})
export class CompareToDirective implements OnInit {
  constructor(private renderer: Renderer2, private element: ElementRef) {
  }

  ngOnInit() {}
}
