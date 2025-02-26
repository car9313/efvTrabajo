import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';

let nextInlineEditId = 0;

@Component({
  selector: 'ng-inline-edit',
  templateUrl: './ng-inline-edit.component.html',
  styleUrls: ['./ng-inline-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgInlineEditComponent),
      multi: true
    }
  ]
})
export class NgInlineEditComponent implements OnInit , ControlValueAccessor {
  private _value: any = '';
  private _temporal: any =  '';
  get value(): any { return this._value; }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }
  private _disabled: boolean;
  inlineEditName: string;
  labelClass: string;
  valueClass: string;
  overclass: string;
  @Input() public view: boolean;
  @Input() public type: string;
  @Input() public class: string;
  @Input() public lbw: any;
  @Input() public label: string;
  @Input() public tooltip: string;
  @Input() public readonly: boolean;
  @Input() public formula: string;
  showToolTip: boolean;

  @Output()
  valueChanged: EventEmitter<any>;
  constructor() {
    this.valueChanged = new EventEmitter<any>();
  }

  ngOnInit() {
    if (isNullOrUndefined(this.type)) {
      this.type = 'text';
    }
    if (isNullOrUndefined(this.lbw)) {
      this.lbw = 2;
    }
    this.inlineEditName = 'inline-edit-' + (nextInlineEditId++);

    this.labelClass = 'col-' + this.lbw + ' col-form-label';
    this.valueClass = 'col';
    this.overclass = '';
    this.view  = true;
    this.showToolTip = !isNullOrUndefined(this.tooltip);
    this.readonly = isNullOrUndefined(this.readonly) ? false :  this.readonly;
  }
  public set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
  }

  public get disabled() {
    return this._disabled;
  }
  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(_: any) {
  }

  onTouched(): void {
  }
  public MouseOver( over: boolean) {
    this.overclass = '';
    if (over) {
      this.overclass = 'inline-hidden-hover';
    }
  }
  public edit() {
    this.view =  false;
    this.overclass = '';
    // this._temporal = this._value;
  }
  public update(value) {
    this.view =  true;
    this.writeValue(value);
    this.valueChanged.emit(null);
    this.overclass = '';
  }
  public cancel() {
    this.view = true;
    this.overclass = '';
  }

  }
