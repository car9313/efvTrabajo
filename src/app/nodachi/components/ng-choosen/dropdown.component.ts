import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MultiSelectSearchFilter} from './search-filter.pipe';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {
  IChangedResponse,
  IMultiSelectOption,
  IMultiSelectTexts,
  INgChoosenOpts,
} from './ng-choosen-opts';
import {coerceArray} from '@angular/cdk/coercion';

/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 *
 * Ivan Horta
 *
 *
 */
/**/
// tslint:disable-next-line:no-conflicting-lifecycle
@Component({
  selector: 'ng-choosen',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectDropdownComponent),
      multi: true,
    },
    MultiSelectSearchFilter,
  ],
})
export class MultiselectDropdownComponent
  implements OnInit,
    OnChanges,
    DoCheck,
    OnDestroy,
    ControlValueAccessor,
    Validator {
  filterControl: FormControl = this.fb.control('');
  loading: boolean;
  _disabled: boolean;

  @HostBinding('class') class = 'ng-multiselect-dropdown';

  @Input() items: Array<any>;
  @Input() options: INgChoosenOpts;
  @Input() texts: IMultiSelectTexts;

  @Input()
  set initialTitle(value) {
    this.title = value || this.options.placeHolder || '';
  }

  @Input() disabledSelection: boolean;
  @Output() selectionLimitReached = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();
  @Output() dropdownOpened = new EventEmitter();
  @Output() changeText = new EventEmitter();
  @Output() added = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() lazyLoad = new EventEmitter();
  @Output() filter: Observable<string> = this.filterControl.valueChanges;
  // tslint:disable-next-line:no-output-native
  @Output() change = new EventEmitter<any>();
  @Output() valueChanged = new EventEmitter<IChangedResponse>();
  destroyed$ = new Subject<any>();

  filteredOptions: IMultiSelectOption[] = [];
  renderFilteredOptions: IMultiSelectOption[] = [];
  model: any[] = [];
  parents: any[];
  title: string;
  titleHover: string;
  differ: any;
  numSelected: number;

  renderItems = true;
  checkAllSearchRegister = new Set();
  checkAllStatus = false;
  loadedValueIds = [];

  defaultSettings: INgChoosenOpts = {
    closeOnClickOutside: true,
    pullRight: false,
    enableSearch: true,
    searchRenderLimit: 0,
    searchRenderAfter: 1,
    searchMaxLimit: 0,
    searchMaxRenderedItems: 0,
    checkedStyle: 'checkboxes',
    buttonClasses: 'w-100 btn btn-white',
    containerClasses: 'w-100 dropdown-inline',
    selectionLimit: 1,
    minSelectionLimit: 0,
    closeOnSelect: true,
    autoUnselect: true,
    showCheckAll: false,
    showUncheckAll: false,
    fixedTitle: false,
    dynamicTitleMaxItems: 1,
    maxHeight: '300px',
    isLazyLoad: false,
    stopScrollPropagation: false,
    loadViewDistance: 1,
    selectAddedValues: false,
    valueField: 'id',
    textField: 'description',
    placeHolder: 'Selecciona una opción',
  };
  defaultTexts: IMultiSelectTexts = {
    checkAll: 'Seleccionar todos',
    uncheckAll: 'Deseleccionar todos',
    checked: 'Seleccionado',
    checkedPlural: 'Seleccionados',
    searchPlaceholder: 'Buscar...',
    searchEmptyResult: 'Ningún resultado...',
    searchNoRenderText: 'Escriba ...',
    defaultTitle: 'Selecciona una opción',
    allSelected: 'Todos seleccionados',
  };

  private _isVisible = false;
  private _workerDocClicked = false;

  @HostListener('document: click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!this.isVisible || !this.options.closeOnClickOutside) {
      return;
    }
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.isVisible = false;
      this.dropdownClosed.emit();
    }
  }

  set isVisible(val: boolean) {
    this._isVisible = val;
    this._workerDocClicked = val ? false : this._workerDocClicked;
  }

  get isVisible() {
    return this._isVisible;
  }

  get searchLimit() {
    return this.options ? this.options.searchRenderLimit : 0;
  }

  get searchRenderAfter() {
    return this.options ? this.options.searchRenderAfter : 1;
  }

  get searchLimitApplied() {
    return this.searchLimit > 0 && this.items.length > this.searchLimit;
  }

  constructor(
    private element: ElementRef,
    private fb: FormBuilder,
    private searchFilter: MultiSelectSearchFilter,
    differs: IterableDiffers
  ) {
    this.differ = differs.find([]).create(null);
    this.options = this.defaultSettings;
    this.texts = this.defaultTexts;
    this.numSelected = 0;
    this.loading = false;
  }

  getItemStyle(option: IMultiSelectOption): any {
    if (!option.isLabel) {
      return {cursor: 'pointer'};
    }
  }

  getItemStyleSelectionDisabled(): any {
    if (this.disabledSelection) {
      return {cursor: 'default'};
    }
  }

  ngOnInit() {
    this.title = this.options.placeHolder || '';
    const this_ = this;
    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.updateRenderItems();
        if (this.options.isLazyLoad) {
          this.load();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.options = Object.assign(this.defaultSettings, this.options);
    }

    if (changes['items']) {
      this.loading = true;
      const loading = this.items === undefined;
      this.items = this.items || [];
      const tmpOpt: Array<IMultiSelectOption> = [];
      this.items.forEach((item) => {
        const newItem: any = {};
        if (typeof item === 'string') {
          newItem.valueField = item;
          newItem.textField = item;
          newItem.disable = false;
        } else {
          newItem.valueField = item[this.options.valueField];
          newItem.textField = this.getItemTextField(item).split('__')[0];
          newItem.disable = item['disable'] || false;
          newItem.extra = isNullOrUndefined(item['extra'])
            ? this.getItemTextField(item).split('__')[1]
            : item['extra'];
        }
        tmpOpt.push(newItem);
      });
      this.items = tmpOpt;
      if (this.model) {
        this.model.forEach((m) => {
          this.items.forEach((item) => {
            if (item.valueField === m) {
              item.classes = 'active';
            }
          });
        });
      }

      this.parents = this.items
        .filter((option) => typeof option.parentId === 'number')
        .map((option) => option.parentId);
      this.updateRenderItems();

      if (this.options.selectAddedValues && this.loadedValueIds.length === 0) {
        this.loadedValueIds = this.loadedValueIds.concat(
          changes.items.currentValue.map((value) => value.id)
        );
      }
      if (this.options.selectAddedValues && changes.items.previousValue) {
        const addedValues = changes.items.currentValue.filter(
          (value) => this.loadedValueIds.indexOf(value.id) === -1
        );
        this.loadedValueIds = this.loadedValueIds.concat(
          addedValues.map((value) => value.id)
        );
        if (this.checkAllStatus) {
          this.addChecks(addedValues);
        } else if (this.checkAllSearchRegister.size > 0) {
          this.checkAllSearchRegister.forEach((searchValue) =>
            this.addChecks(this.applyFilters(addedValues, searchValue))
          );
        }
      }

      if (this.texts) {
        this.updateTitle();
      }
      // if (this.options.selectionLimit === 1) {
      //   this.onModelChange(this.model[0]);
      //   this.valueChanged.emit({
      //     value: this.items.find(x => {
      //       return x.valueField === this.model[0]
      //     })
      //   });
      // } else {
      //   this.onModelChange(this.model);
      //   this.valueChanged.emit({
      //     value: this.items.filter(x => {
      //       return this.model.some(x.valueField);
      //     })
      //   });
      // }
      // this.onModelTouched();
      this.loading = loading;
    }

    if (changes['texts'] && !changes['texts'].isFirstChange()) {
      this.updateTitle();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  updateRenderItems() {
    this.renderItems =
      !this.searchLimitApplied ||
      this.filterControl.value.length >= this.searchRenderAfter;
    this.filteredOptions = this.applyFilters(
      this.items,
      this.options.isLazyLoad ? '' : this.filterControl.value
    );
    this.renderFilteredOptions = this.renderItems ? this.filteredOptions : [];
  }

  applyFilters(options, value) {
    return this.searchFilter.transform(
      options,
      value,
      this.options.searchMaxLimit,
      this.options.searchMaxRenderedItems
    );
  }

  onModelChange(_: any) {
  }

  onModelTouched() {
  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      let model = coerceArray(value);
      if (
        model.length > 0 &&
        typeof model[0] === 'object' &&
        model[0].hasOwnProperty(this.options.valueField)
      ) {
        model = model.map((m) => m[this.options.valueField]);
      }
      if (this.items) {
        model.forEach((m) => {
          this.items.forEach((item) => {
            if (item.valueField === m) {
              item.classes = 'active';
            }
          });
        });
      }
      this.model = model;
    } else {
      this.model = [];
      this.items.forEach((item) => {
        if (item.hasOwnProperty('classes')) {
          item.classes = '';
        }
      });
    }
    this.updateTitle();
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled;
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.model);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  validate(_c: AbstractControl): { [key: string]: any } {
    return this.model && this.model.length
      ? null
      : {
        required: {
          valid: false,
        },
      };
  }

  registerOnValidatorChange(_fn: () => void): void {
    throw new Error('Method not implemented.');
  }

  clearSearch(event: Event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    this.filterControl.setValue('');
  }

  toggleDropdown() {
    this.isVisible = !this.isVisible;
    this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
  }

  isSelected(option: IMultiSelectOption): boolean {
    return this.model && this.model.indexOf(option.valueField) > -1;
  }

  setSelected(_event: Event, option: IMultiSelectOption) {
    if (option.isLabel) {
      return;
    }
    if (!this.disabledSelection) {
      if (_event.stopPropagation) {
        _event.stopPropagation();
      }
      const index = this.model.indexOf(option.valueField);
      const isAtSelectionLimit =
        this.options.selectionLimit > 0 &&
        this.model.length >= this.options.selectionLimit;
      if (index > -1) {
        const removeItem = (idx, id): void => {
          this.model.splice(idx, 1);
          this.removed.emit(id);
        };

        if (
          this.options.minSelectionLimit === undefined ||
          this.numSelected > this.options.minSelectionLimit
        ) {
          removeItem(index, option.valueField);
          option.classes = '';
        }
        const parentIndex =
          option.parentId && this.model.indexOf(option.parentId);
        if (parentIndex > -1) {
          removeItem(parentIndex, option.parentId);
        } else if (this.parents.indexOf(option.valueField) > -1) {
          this.items
            .filter(
              (child) =>
                this.model.indexOf(child.id) > -1 &&
                child.parentId === option.valueField
            )
            .forEach((child) =>
              removeItem(this.model.indexOf(child.id), child.id)
            );
        }
      } else if (isAtSelectionLimit && !this.options.autoUnselect) {
        this.selectionLimitReached.emit(this.model.length);
        return;
      } else {
        const addItem = (id): void => {
          this.model.push(id);
          this.added.emit(id);
          // this.valueChanged.emit({
          //   value: this.items.find(x => {
          //     return x.valueField === id;
          //   }),
          // });
        };
        option.classes = 'active';
        addItem(option.valueField);
        if (!isAtSelectionLimit) {
          if (option.parentId) {
            const children = this.items.filter(
              (child) =>
                child.id !== option.valueField &&
                child.parentId === option.parentId
            );
            if (children.every((child) => this.model.indexOf(child.id) > -1)) {
              addItem(option.parentId);
            }
          } else if (this.parents.indexOf(option.valueField) > -1) {
            const children = this.items.filter(
              (child) =>
                this.model.indexOf(child.id) < 0 &&
                child.parentId === option.valueField
            );
            children.forEach((child) => addItem(child.id));
          }
        } else {
          const removedOption = this.model.shift();
          const removedItem = this.items.find((item) => {
            return item.valueField === removedOption;
          });
          if (removedItem !== undefined) {
            removedItem.classes = '';
          }
          this.removed.emit(removedOption);
        }
      }
      if (this.options.closeOnSelect) {
        this.toggleDropdown();
      }
      this.model = this.model.slice();
      if (this.options.selectionLimit === 1) {
        this.onModelChange(this.model[0]);
        this.change.emit(this.model[0]);
        this.valueChanged.emit({
          value: this.items.find((x) => {
            return x.valueField === this.model[0];
          }),
        });
      } else {
        this.onModelChange(this.model);
        this.change.emit(this.model);
        this.valueChanged.emit({
          value: this.items.filter((x) => {
            return this.model.some(e => e === x.valueField);
          }),
        });
      }
      this.onModelTouched();
    }
  }

  updateNumSelected() {
    this.numSelected =
      this.model.filter((id) => this.parents.indexOf(id) < 0).length || 0;
  }

  updateTitle() {
    this.titleHover = '';
    if (this.numSelected === 0 || this.options.fixedTitle) {
      this.title = this.texts ? this.options.placeHolder : '';
      this.changeText.emit(this.title);
    } else if (
      this.options.displayAllSelectedText &&
      this.model.length === this.items.length
    ) {
      this.title = this.texts ? this.texts.allSelected : '';
      this.changeText.emit(this.title);
    } else if (
      this.options.dynamicTitleMaxItems &&
      this.options.dynamicTitleMaxItems >= this.numSelected
    ) {
      const auxTitle = this.items
        .filter(
          (option: IMultiSelectOption) =>
            this.model.indexOf(option.valueField) > -1
        )
        .map((option: IMultiSelectOption) => option.textField)
        .join(', ');
      if (auxTitle !== '') {
        this.title = auxTitle;
        this.titleHover = auxTitle;
        this.changeText.emit(this.title);
      }
    } else {
      this.title =
        this.numSelected +
        ' ' +
        (this.numSelected === 1
          ? this.texts.checked
          : this.texts.checkedPlural);
      const auxTitle = this.items
        .filter(
          (option: IMultiSelectOption) =>
            this.model.indexOf(option.valueField) > -1
        )
        .map((option: IMultiSelectOption) => option.textField)
        .join(', ');
      if (auxTitle !== '') {
        this.titleHover = auxTitle;
        this.changeText.emit(this.titleHover);
      }
    }
  }

  searchFilterApplied() {
    return (
      this.options.enableSearch &&
      this.filterControl.value &&
      this.filterControl.value.length > 0
    );
  }

  addChecks(options) {
    const this_ = this;
    const checkedOptions = options
      .filter((option: IMultiSelectOption) => {
        if (this.model.indexOf(option.valueField) === -1) {
          this.added.emit(option.valueField);
          // this.valueChanged.emit({value: option});
          return true;
        }
        return false;
      })
      .map((option: IMultiSelectOption) => option.valueField);
    this.model = this.model.concat(checkedOptions);
  }

  checkAll() {
    if (!this.disabledSelection) {
      this.addChecks(
        !this.searchFilterApplied() ? this.items : this.filteredOptions
      );
      if (this.options.selectAddedValues) {
        if (this.searchFilterApplied() && !this.checkAllStatus) {
          this.checkAllSearchRegister.add(this.filterControl.value);
        } else {
          this.checkAllSearchRegister.clear();
          this.checkAllStatus = true;
        }
        this.load();
      }
      this.onModelChange(this.model);
      this.change.emit(this.model);
      this.valueChanged.emit({
        value: this.items,
      });
      this.onModelTouched();
    }
  }

  uncheckAll() {
    if (!this.disabledSelection) {
      const checkedOptions = this.model;
      let unCheckedOptions = !this.searchFilterApplied()
        ? this.model
        : this.filteredOptions.map(
          (option: IMultiSelectOption) => option.valueField
        );
      // set unchecked options only to the ones that were checked
      unCheckedOptions = checkedOptions.filter((item) =>
        unCheckedOptions.includes(item)
      );
      this.model = this.model.filter((id: number) => {
        if (
          (unCheckedOptions.indexOf(id) < 0 &&
            this.options.minSelectionLimit === undefined) ||
          unCheckedOptions.indexOf(id) < this.options.minSelectionLimit
        ) {
          return true;
        } else {
          this.removed.emit(id);
          return false;
        }
      });
      if (this.options.selectAddedValues) {
        if (this.searchFilterApplied()) {
          if (this.checkAllSearchRegister.has(this.filterControl.value)) {
            this.checkAllSearchRegister.delete(this.filterControl.value);
            const this_ = this;
            this.checkAllSearchRegister.forEach((searchTerm) => {
              const filterOptions = this_.applyFilters(
                this_.items.filter((option) =>
                  unCheckedOptions.includes(option.textField)
                ),
                searchTerm
              );
              this_.addChecks(filterOptions);
            });
          }
        } else {
          this.checkAllSearchRegister.clear();
          this.checkAllStatus = false;
        }
        this.load();
      }
      if (this.options.selectionLimit === 1) {
        this.onModelChange(null);
        this.change.emit(null);
        this.valueChanged.emit({value: null});
      } else {
        this.onModelChange(this.model);
        this.change.emit(this.model);
        this.valueChanged.emit({
          value: this.items.filter((x) => {
            return this.model.some(e => e === x.valueField);
          }),
        });
      }

      this.onModelTouched();
    }
  }

  preventCheckboxCheck(event: Event, option: IMultiSelectOption) {
    if (
      this.options.selectionLimit &&
      !this.options.autoUnselect &&
      this.model.length >= this.options.selectionLimit &&
      this.model.indexOf(option.valueField) === -1 &&
      event.preventDefault
    ) {
      event.preventDefault();
    }
  }

  isCheckboxDisabled(): boolean {
    return this.disabledSelection;
  }

  checkScrollPosition(ev) {
    const scrollTop = ev.target.scrollTop;
    const scrollHeight = ev.target.scrollHeight;
    const scrollElementHeight = ev.target.clientHeight;
    const roundingPixel = 1;
    const gutterPixel = 1;

    if (
      scrollTop >=
      scrollHeight -
      (1 + this.options.loadViewDistance) * scrollElementHeight -
      roundingPixel -
      gutterPixel
    ) {
      this.load();
    }
  }

  checkScrollPropagation(ev, element) {
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const scrollElementHeight = element.clientHeight;

    if (
      (ev.deltaY > 0 && scrollTop + scrollElementHeight >= scrollHeight) ||
      (ev.deltaY < 0 && scrollTop <= 0)
    ) {
      ev = ev || window.event;
      if (ev.preventDefault) {
        ev.preventDefault();
      }
      ev.returnValue = false;
    }
  }

  load() {
    this.lazyLoad.emit({
      length: this.items.length,
      filter: this.filterControl.value,
      checkAllSearches: this.checkAllSearchRegister,
      checkAllStatus: this.checkAllStatus,
    });
  }

  clearModel(e) {
    this.uncheckAll();
    this.items.forEach((item) => {
      if (item.hasOwnProperty('classes')) {
        item.classes = '';
      }
    });
    this.updateNumSelected();
    this.updateTitle();
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

  public validateItem(item): boolean {
    let result = true;
    if (
      !isNullOrUndefined(item) &&
      !isNullOrUndefined(this.options.textField)
    ) {
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
}
