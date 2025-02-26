import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

let singleValueId = 0;

@Component({
  selector: 'app-ng-single-value',
  templateUrl: './ng-single-value.component.html',
  styleUrls: ['./ng-single-value.component.scss'],
})
export class NgSingleValueComponent implements AfterViewInit {

  @Input() value;
  @Input() description;
  @ViewChild('title', { static: true }) title: ElementRef;
  id: string;

  constructor() {
    this.id = `singleValue-${singleValueId++}`;
    this.value = '';
    this.description = '';
  }

  ngAfterViewInit(): void {
    this.title.nativeElement.style.fontSize = `${this.title.nativeElement.offsetHeight}px`;
  }

}
