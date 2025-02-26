import {AfterViewInit, Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';

let summernote = 0;

export interface ISumernoteSettings {
  lang?: string; // default: 'en-US'
  height?: number;  // set editor height
  minHeight?: number;             // set minimum height of editor
  maxHeight?: number;             // set maximum height of editor
  focus: boolean;
  placeholder?: string;
  tabsize: number;
}


@Component({
  selector: 'ng-summernote',
  templateUrl: './ng-summernote.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgSummernoteComponent),
      multi: true,
    },
  ],
})
export class NgSummernoteComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  summernoteId: string;
  $summernote: JQuery;

  @Input() public mostrarVariables = false;
  @Input() public minHeigth: number = 400;

  @Input() set variables(values: Array<{ name: string, value: string }>) {
    if (isNullOrUndefined(this.$summernote)) {
      this.init(values);
    } else {
      this.$summernote.summernote('destroy');
      this.init(values);
    }
  }

  constructor(public sanitizer: DomSanitizer) {
    this.summernoteId = `summernote-${summernote++}`;
    this.$summernote = null;
    this.variables = [];
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.init([]);
    }, 0);
  }

  private init(values = []) {
    const _this = this;
    if (this.mostrarVariables) {
      $.extend($.summernote.options, {
        examplePlugin: {
          icon: '<span class="note-icon-pencil"></span>',
          tooltip: 'Example Plugin Tooltip',
        },
      });

      $.extend($.summernote.plugins, {
        examplePlugin: (context) => {
          const self = this,
            ui = $.summernote.ui,
            $note = context.layoutInfo.note,
            $editor = context.layoutInfo.editor,
            $editable = context.layoutInfo.editable,
            $toolbar = context.layoutInfo.toolbar,
            options = context.options,
            lang = options.langInfo;

          context.memo('button.examplePlugin', function () {
            // Here we create a button
            const button = ui.button({
              className: 'dropdown-toggle',
              contents: '<span class="note-icon-pencil"></span>',
              data: {
                toggle: 'dropdown',
              },
            });

            const dropdown = ui.dropdownCheck({
              className: 'dropdown-menu',
              items: values,
              template: function (item) {
                const tag = item.value;
                return item.name + '</' + tag + '>';
              },
              click: function (tagName) {
                context.invoke('editor.pasteHTML', '<abbr style="background-color: black;color: white"> '
                  + $(tagName.target).attr('data-value')
                  + ' </abbr>');
                context.invoke('editor.tab');
                return false;
              },
            });

            return ui.buttonGroup([
              button,
              dropdown,
            ]).render();
          });
        },
      });

      this.$summernote = $(`#${this.summernoteId}`).summernote({
        lang: 'es-ES',
        toolbar: [
          ...$.summernote.options.toolbar,
          ['custom', ['examplePlugin']],
        ],
      }).on('summernote.change', (we, contents, $editable) => {
        this.onChange(contents);
      })
        .on('summernote.blur', () => {
          this.onTouched();
        });
    } else {
      this.$summernote = $(`#${this.summernoteId}`).summernote({
        lang: 'es-ES',
        minHeight: this.minHeigth
      } as SummernoteOptions)
        .on('summernote.change', (we, contents, $editable) => {
          this.onChange(contents);
        })
        .on('summernote.blur', () => {
          this.onTouched();
        });
    }
  }

  ngOnDestroy(): void {
    if (!isNullOrUndefined(this.$summernote)) {
      this.$summernote.summernote('destroy');
    }
  }

  writeValue(obj: any): void {
    if (isNullOrUndefined(this.$summernote)) {
      this.init();
    }
    this.$summernote.summernote('code', obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isNullOrUndefined(this.$summernote)) {
      this.init();
    }
    const action = isDisabled ? 'disable' : 'enable';
    this.$summernote.summernote(action);
  }

  onChange(_: any) {
  }

  onTouched(): void {
  }

}
