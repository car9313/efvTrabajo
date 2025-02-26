import {
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ColumnTable} from '../../models/column-table';
import {coerceArray} from '@angular/cdk/coercion';


@Component({
  selector: 'ng-table-inupt',
  templateUrl: './ng-table-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgTableInputComponent),
      multi: true
    }
  ]
})
export class NgTableInputComponent implements OnInit, ControlValueAccessor, OnChanges {

  @Input()
  columns: Array<ColumnTable>;
  rows: Array<any>;
  @Output()
  add: EventEmitter<void>;

  private _disabled: boolean;

  public set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
  }

  public get disabled() {
    return this._disabled;
  }

  @ContentChildren('item') arbitraryNestedPanes: QueryList<ElementRef>;

  constructor() {
    this.columns = [];
    this.rows = [];
    this.add = new EventEmitter<void>();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['']) {}
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.rows = coerceArray(obj);
  }

  public getData(row: any, propertyName: string): string {
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }

  removeItem(index) {
    try {
      this.rows.splice(index, 1);
    } catch (e) {

    }
  }

  addItem() {
    const obj: any = {};
    this.arbitraryNestedPanes.forEach((item) => {
      obj[(item.nativeElement as HTMLElement).getAttribute('name')] = item.nativeElement.value;
    });
    if (obj !== {}) {
      this.rows.push(obj);
      this.arbitraryNestedPanes.forEach((item) => {
        item.nativeElement.value = '';
      });
      this.onChange(this.rows);
    }
  }

  onChange(_: any) {
  }

  onTouched(): void {
  }

}
