export interface IMultiSelectOption {
  valueField: any;
  textField: string;
  isLabel?: boolean;
  disable?: boolean;
  parentId?: any;
  params?: any;
  classes?: string;
  extra?: any;
}

export interface IChangedResponse {
  value: any;
  added?: any;
  removed?: any;
}

export interface INgChoosenOpts {
  pullRight?: boolean;
  enableSearch?: boolean;
  closeOnClickOutside?: boolean;
  /**
   * 0 - By default
   * If `enableSearch=true` and total amount of items more then `searchRenderLimit` (0 - No limit)
   * then render items only when user typed more then or equal `searchRenderAfter` charachters
   */
  searchRenderLimit?: number;
  /**
   * 3 - By default
   */
  searchRenderAfter?: number;
  /**
   * 0 - By default
   * If >0 will render only N first items
   */
  searchMaxLimit?: number;
  /**
   * 0 - By default
   * Used with searchMaxLimit to further limit rendering for optimization
   * Should be less than searchMaxLimit to take effect
   */
  searchMaxRenderedItems?: number;
  checkedStyle?: 'checkboxes' | 'fontawesome';
  buttonClasses?: string;
  itemClasses?: string;
  containerClasses?: string;
  selectionLimit?: number;
  minSelectionLimit?: number;
  closeOnSelect?: boolean;
  autoUnselect?: boolean;
  showCheckAll?: boolean;
  showUncheckAll?: boolean;
  fixedTitle?: boolean;
  dynamicTitleMaxItems?: number;
  maxHeight?: string;
  displayAllSelectedText?: boolean;
  isLazyLoad?: boolean;
  loadViewDistance?: number;
  stopScrollPropagation?: boolean;
  selectAddedValues?: boolean;
  valueField?: string;
  textField?: string;
  placeHolder?: string;
}

export class NgChoosenOpts {
  pullRight?: boolean;
  enableSearch?: boolean;
  closeOnClickOutside?: boolean;
  /**
   * 0 - By default
   * If `enableSearch=true` and total amount of items more then `searchRenderLimit` (0 - No limit)
   * then render items only when user typed more then or equal `searchRenderAfter` charachters
   */
  searchRenderLimit?: number;
  /**
   * 3 - By default
   */
  searchRenderAfter?: number;
  /**
   * 0 - By default
   * If >0 will render only N first items
   */
  searchMaxLimit?: number;
  /**
   * 0 - By default
   * Used with searchMaxLimit to further limit rendering for optimization
   * Should be less than searchMaxLimit to take effect
   */
  searchMaxRenderedItems?: number;
  checkedStyle?: 'checkboxes' | 'fontawesome';
  buttonClasses?: string;
  itemClasses?: string;
  containerClasses?: string;
  selectionLimit?: number;
  minSelectionLimit?: number;
  closeOnSelect?: boolean;
  autoUnselect?: boolean;
  showCheckAll?: boolean;
  showUncheckAll?: boolean;
  fixedTitle?: boolean;
  dynamicTitleMaxItems?: number;
  maxHeight?: string;
  displayAllSelectedText?: boolean;
  isLazyLoad?: boolean;
  loadViewDistance?: number;
  stopScrollPropagation?: boolean;
  selectAddedValues?: boolean;
  valueField?: string;
  textField?: string;
  placeHolder?: string;

  constructor(opt?: INgChoosenOpts) {
    this.valueField = opt && opt.valueField ? opt.valueField : 'id';
    this.textField = opt && opt.textField ? opt.textField : 'description';
    this.pullRight = opt && opt.pullRight ? opt.pullRight : false;
    this.enableSearch = opt && opt.enableSearch ? opt.enableSearch : true;
    this.closeOnClickOutside =
      opt && opt.closeOnClickOutside ? opt.closeOnClickOutside : true;
    this.searchRenderLimit =
      opt && opt.searchRenderLimit ? opt.searchRenderLimit : 0;
    this.searchRenderAfter =
      opt && opt.searchRenderAfter ? opt.searchRenderAfter : 1;
    this.minSelectionLimit =
      opt && opt.minSelectionLimit ? opt.minSelectionLimit : 0;
    this.searchMaxLimit = opt && opt.searchMaxLimit ? opt.searchMaxLimit : 0;
    this.searchMaxRenderedItems =
      opt && opt.searchMaxRenderedItems ? opt.searchMaxRenderedItems : 0;
    this.checkedStyle =
      opt && opt.checkedStyle ? opt.checkedStyle : 'checkboxes';
    this.buttonClasses =
      opt && opt.buttonClasses ? opt.buttonClasses : 'w-100 btn btn-white';
    this.itemClasses = opt && opt.itemClasses ? opt.itemClasses : '';
    this.containerClasses =
      opt && opt.containerClasses
        ? opt.containerClasses
        : 'w-100 dropdown-inline';
    this.selectionLimit = opt && opt.selectionLimit ? opt.selectionLimit : 1;
    this.closeOnSelect = opt && opt.closeOnSelect ? opt.closeOnSelect : true;
    this.autoUnselect = opt && opt.autoUnselect ? opt.autoUnselect : true;
    this.showCheckAll = opt && opt.showCheckAll ? opt.showCheckAll : false;
    this.showUncheckAll =
      opt && opt.showUncheckAll ? opt.showUncheckAll : false;
    this.fixedTitle = opt && opt.fixedTitle ? opt.fixedTitle : false;
    this.dynamicTitleMaxItems =
      opt && opt.dynamicTitleMaxItems ? opt.dynamicTitleMaxItems : 1;
    this.maxHeight = opt && opt.maxHeight ? opt.maxHeight : '300px';
    this.displayAllSelectedText =
      opt && opt.displayAllSelectedText ? opt.displayAllSelectedText : false;
    this.isLazyLoad = opt && opt.isLazyLoad ? opt.isLazyLoad : false;
    this.loadViewDistance =
      opt && opt.loadViewDistance ? opt.loadViewDistance : 1;
    this.stopScrollPropagation =
      opt && opt.stopScrollPropagation ? opt.stopScrollPropagation : false;
    this.selectAddedValues =
      opt && opt.selectAddedValues ? opt.selectAddedValues : false;
    this.placeHolder =
      opt && opt.placeHolder ? opt.placeHolder : 'Selecciona una opción';
  }
}

export interface IMultiSelectTexts {
  checkAll?: string;
  uncheckAll?: string;
  checked?: string;
  checkedPlural?: string;
  searchPlaceholder?: string;
  searchEmptyResult?: string;
  searchNoRenderText?: string;
  defaultTitle?: string;
  allSelected?: string;
}
