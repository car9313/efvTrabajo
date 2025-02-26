import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {INgChoosenOpts2, NgChoosenOpts2} from '@app/nodachi/components/ng-choosen2/ng-choosen-opts';
// import 'chosen-js';

let nextChosenId = 0;

@Component({
  selector: 'ng-choosen2',
  templateUrl: './ng-choosen.component.html',
  styleUrls: ['./ng-choosen.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgChoosenComponent),
      multi: true,
    },
  ],
})
export class NgChoosenComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor, OnChanges {

  @HostBinding('class') cssClass;

  @Input() public options: INgChoosenOpts2;

  @Input() public items: Array<any>;

  private _value;
  public set value(value) {
    this._value = value;
    this.refreshChoosen();
  }

  public get value() {
    return this._value;
  }

  private _disabled: boolean;

  public set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
  }

  public get disabled() {
    return this._disabled;
  }

  @ViewChild('selectchoosen', { static: true }) selectchoosen: ElementRef;

  @Output() change = new EventEmitter<any>();
  @Output() changeText = new EventEmitter<any>();

  chosenName: string;
  loading: boolean;
  _items: Array<any>;

  constructor() {
    this.cssClass = 'ng-choosen';
    this._items = [];
    this.options = new NgChoosenOpts2(this.options);
    this.chosenName = `chosen-${nextChosenId++}`;
    this.loading = false;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    $(this.selectchoosen.nativeElement)
      .chosen('destroy');
  }

  ngAfterViewInit() {
    // if (typeof $.fn.chosen !== 'undefined') {
    //   $(this.selectchoosen.nativeElement)
    //     .chosen({
    //       no_results_text: this.options.noResultsText,
    //       allow_single_deselect: this.options.allow_single_deselect,
    //       disable_search_threshold: 10,
    //       width: this.options.width,
    //       search_contains: this.options.search_contains,
    //     }).on('change'
    //     , (e, args) => {
    //       let value = null;
    //       if (!isNullOrUndefined(args)) {
    //         value = args.selected;
    //       }
    //
    //       if (this.browserIsSupported()) {
    //         this.value = value;
    //       }
    //
    //       if (isNaN(parseInt(this.value, 10))) {
    //         this.onChange(this.value);
    //         this.change.emit(this.value);
    //       } else {
    //         this.onChange(parseInt(this.value, 10));
    //         this.change.emit(parseInt(this.value, 10));
    //       }
    //       if (!isNullOrUndefined(e.target['selectedOptions'][0].text)) {
    //         this.changeText.emit(e.target['selectedOptions'][0].text);
    //       }
    //
    //       this.onTouched();
    //     })
    //     .on('change chosen:ready chosen:updated.chosen', (e, args) => {
    //       this.changeSelectedText(e);
    //     })
    //     .on('chosen:showing_dropdown', (e, args) => {
    //       $('.chosen-search input').on('keyup', () => {
    //         this.changeListText(e);
    //       });
    //
    //       this.changeListText(e);
    //     });
    // }
  }

  changeListText(event: any): void {
    $(event.target).next().find('.chosen-results li').each(function (i, e) {
      const jqThis = $(e);
      const text = jqThis.text();
      jqThis.text(text.split('__')[0]);
    });
  }

  changeSelectedText(event: any): void {
    $(event.target).next().find('.chosen-single > span').each(function (i, e) {
      const jqThis = $(e);
      const text = jqThis.text();
      jqThis.html(text.split('__')[0]);
    });
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.refreshChoosen();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      const value = changes['items'].currentValue;
      this.buildItems(value);
    }
    if (changes['options']) {
      this.options = new NgChoosenOpts2(changes['options'].currentValue);
      this.buildItems(this.items);
    }
  }

  onChange(_: any) {
  }

  onTouched(): void {
  }

  private refreshChoosen() {
    const self = this;
    setTimeout(() => {
      if (!isNullOrUndefined(self.selectchoosen.nativeElement)) {
        $(self.selectchoosen.nativeElement)
          .trigger('chosen:updated');
      }
    }, 0);
  }

  trackById(index, item) {
    return item ? item.id : undefined;
  }

  private buildItems(value) {
    if (isNullOrUndefined(value) || value.length === 0) {
      this._items = [];
      this.loading = value === undefined;
    } else {
      this._items = value.filter((item: any) => {
        if ((typeof item === 'string') ||
          (typeof item === 'object' && this.validateItem(item))) {
          return item;
        }
      });
      this._items = this._items.map((item: any) => (typeof item === 'string' ?
        {id: item, text: item} : {
          id: item[this.options.valueField],
          text: this.getItemTextField(item),
          disable: item['disable'] || false,
        }));
      this.loading = false;
    }
    this.refreshChoosen();
  }

  public validateItem(item): boolean {
    let result = true;
    if (!isNullOrUndefined(item) && !isNullOrUndefined(this.options.textField)) {
      const arrayTextField = this.options.textField.split(',');
      arrayTextField.push(this.options.valueField);
      arrayTextField.forEach((i) => {
        result = result && item[i];
      });
    } else {
      result = false;
    }
    return result;
  }

  public getItemTextField(item): string {
    let stringReturned = '';
    const arrayTextField = this.options.textField.split(',');
    stringReturned += item[arrayTextField.shift()];
    arrayTextField.forEach((i) => {
      stringReturned += ' (' + item[i] + ')';
    });
    return stringReturned;
  }

  browserIsSupported(): boolean {
    if ('Microsoft Internet Explorer' === window.navigator.appName) {
      return document['documentMode'] >= 8;
    }
    return !(/iP(od|hone)/i.test(window.navigator.userAgent) ||
      /IEMobile/i.test(window.navigator.userAgent) ||
      /Windows Phone/i.test(window.navigator.userAgent) ||
      /BlackBerry/i.test(window.navigator.userAgent) ||
      /BB10/i.test(window.navigator.userAgent) ||
      /Android.*Mobile/i.test(window.navigator.userAgent));
  }

}
