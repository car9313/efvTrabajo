import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ng-search-bar',
  templateUrl: './ng-search-bar.component.html',
  styleUrls: ['./ng-serach-bar.component.scss'],
})
export class NgSearchBarComponent implements OnInit {
  @Input() permissions: any;
  @Input() itemPerPage: number;
  @Input() find: string;
  @Input() hideSearch: boolean;
  @Input() hidePerPage: boolean;
  @Input() hideCreate: boolean;
  @Input() disableSearch: boolean;
  @Input() hasFilters: boolean;
  @Output() create: EventEmitter<any>;
  @Output() search: EventEmitter<any>;
  @Output() findChange: EventEmitter<string>;
  @Output() itemPerPageChange: EventEmitter<number>;
  @Output() resetFilters: EventEmitter<any>;
  constructor() {
    this.permissions = { create: false, edit: false, delete: false };
    this.itemPerPage = 10;
    this.find = '';
    this.hideSearch = false;
    this.hidePerPage = false;
    this.hideCreate = false;
    this.create = new EventEmitter();
    this.search = new EventEmitter();
    this.findChange = new EventEmitter();
    this.itemPerPageChange = new EventEmitter();
    this.resetFilters = new EventEmitter();
  }
  ngOnInit() {}
  onCreate(e) {
    this.create.emit(e);
  }
  onSubmit(e) {
    this.findChange.emit(this.find);
    this.itemPerPageChange.emit(this.itemPerPage);
    this.search.emit(e);
  }
  onReset(e) {
    this.resetFilters.emit(e);
  }
}
