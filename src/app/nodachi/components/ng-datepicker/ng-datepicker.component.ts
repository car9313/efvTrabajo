import {Component, EventEmitter, forwardRef, HostBinding, Inject, Input, OnChanges, Optional, Output, SimpleChanges} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import 'moment/locale/es';
import {PickerType, SelectMode} from './date-time/date-time.class';
import {DateTimeAdapter, OWL_DATE_TIME_FORMATS, OwlDateTimeFormats} from './date-time';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {coerceArray} from '@angular/cdk/coercion';

let nextDtId = 0;

@Component({
  selector: 'ng-datepicker',
  templateUrl: './ng-datepicker.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true,
  }, {
    provide: NG_VALIDATORS,
    useExisting: DatePickerComponent,
    multi: true,
  }],
})
export class DatePickerComponent implements ControlValueAccessor, OnChanges, Validator {

  @HostBinding('class') class = 'ng-datepicker';

  // Properties for owl-date-time
  /*
  *  Configuraciones para pickerType: 'calendar','timer','both'
  * */
  @Input()
  pickerType: PickerType;

  @Input()
  set startAt(value: string) {
    this.startAtMoment = this.deserialize(value);
  }

  // Properties for input[owlDateTime]
  @Input()
  minDate: string;
  @Input()
  maxDate: string;
  @Input()
  selectMode: SelectMode;

  @Input()
  placeholder: string;

  // Events for input[owlDateTime]
  @Output()
  dateTimeChange: EventEmitter<any>;
  @Output()
  dateTimeInput: EventEmitter<any>;

  minDateMoment: moment.Moment;
  maxDateMoment: moment.Moment;
  startAtMoment: moment.Moment;
  disabled: boolean;
  reseteable: boolean;
  private _onChange: () => void;
  private onTouchedCallback: () => void;
  private onChangeCallback: (_: any) => void;

  dateMoment: FormControl;
  datepickerId: string;

  constructor(@Optional() protected dateTimeAdapter: DateTimeAdapter<moment.Moment>,
              @Optional() @Inject(OWL_DATE_TIME_FORMATS) protected dateTimeFormats: OwlDateTimeFormats) {
    this.placeholder = '';
    this.startAt = null;
    this.minDate = null;
    this.maxDate = null;
    this.minDateMoment = null;
    this.maxDateMoment = null;
    this.startAtMoment = null;
    this.selectMode = 'single';
    this.pickerType = 'calendar';

    this.dateMoment = new FormControl(null);
    this.dateTimeChange = new EventEmitter<any>();
    this.dateTimeInput = new EventEmitter<any>();
    this.datepickerId = `datetime-${nextDtId++}`;
  }

  writeValue(date: any) {
    if (isNullOrUndefined(date) || date === '') {
      this.dateMoment.setValue(null);
      this.reseteable = false;
      return;
    }
    if (typeof date === 'string') {
      this.dateMoment.setValue(this.deserialize(date));
    }
    if (date instanceof Date) {
      this.dateMoment.setValue(moment(date));
    }
    if (Array.isArray(date)) {
      const value = date.map(d => this.deserialize(d));
      this.dateMoment.setValue(value);
    }
    this.reseteable = true;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.dateMoment.disable();
    } else {
      this.dateMoment.enable();
    }
  }


  clearDate() {
    this.reseteable = false;
    this.dateMoment.setValue(null);
    this.onChangeCallback(null);
    this.onTouchedCallback();
    this.dateTimeChange.emit(null);
    if (this._onChange) {
      this._onChange();
    }
  }

  changeDate(event: { source; any, value: any, input: any }) {
    const format = (this.pickerType === 'both') ? this.dateTimeFormats.fullPickerInput :
      (this.pickerType === 'calendar') ? this.dateTimeFormats.datePickerInput : this.dateTimeFormats.timePickerInput;
    const values = coerceArray(event.value);
    const formatted = [];
    values.forEach(item => {
      formatted.push(this.dateTimeAdapter.format(item, format));
    });
    this.onChangeCallback(formatted.length === 1 ? formatted[0] : formatted);
    this.onTouchedCallback();
    this.dateTimeChange.emit(event);
    this.reseteable = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startAt']) {
      const value = changes['startAt'].currentValue;
      this.startAtMoment = this.deserialize(value);
    }
    if (changes['minDate']) {
      const value = changes['minDate'].currentValue;
      this.minDateMoment = this.deserialize(value);
    }
    if (changes['maxDate']) {
      const value = changes['maxDate'].currentValue;
      this.maxDateMoment = this.deserialize(value);
    }
  }

  private deserialize(value) {
    let date;
    if (value instanceof Date) {
      date = moment(value);
    }
    if (typeof value === 'string') {
      if (!value || value === '') {
        return null;
      }
      date = moment(value, [this.dateTimeFormats.fullPickerInput,
        this.dateTimeFormats.datePickerInput,
        this.dateTimeFormats.timePickerInput], true);
    }

    if (date && (date as moment.Moment).isValid()) {
      return date;
    }

    if (moment.isMoment(value) && (value as moment.Moment).isValid()) {
      return value;
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (c.hasError('required')) {
      this.dateMoment.setValidators(Validators.required);
    }
    return this.dateMoment.errors;
  }
}
