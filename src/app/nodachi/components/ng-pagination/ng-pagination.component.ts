import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'ng-pagination',
  templateUrl: './ng-pagination.component.html'
})
export class NGPaginationComponent {
  @Input() totalitems: number;
  @Input() paginationId: string;
  @Input() currentpage: number;
  @Input() itemperpage: number;
  @Input() totalpage: number;
  @Input() currentitems: number;
  @Output() currentpageChange: EventEmitter<any>;
  @Output() search: EventEmitter<any>;

  constructor() {
    this.totalitems = 0;
    this.currentpage = 1;
    this.currentitems = 0;
    this.itemperpage = 10;
    this.totalpage = 0;
    this.currentpageChange = new EventEmitter();
    this.search = new EventEmitter();
  }

  onSearch(e) {
    this.currentpage = e;
    this.currentpageChange.emit(this.currentpage);
    this.search.emit(e);
  }
}
