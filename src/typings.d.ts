/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare module 'xml-writer';

interface IRamdomColorOption {
  hue?: string;
  luminosity?: string;
  count?: number;
  seed?: number | string;
  format?: string;
  alpha?: number;
}

declare const randomColor: (options?: IRamdomColorOption) => string;
declare module 'randomColor' {
  export = randomColor;
}

interface CryptoJSStatic {
  AES: AES;
  enc: { Utf8: Utf8 };
}

interface AES {
  encrypt(message, key);

  decrypt(ciphertext, key);
}

interface Utf8 {
  stringify(wordArray);

  parse(utf8Str);
}

declare const CryptoJS: CryptoJSStatic;
declare module 'crypto-js' {
  export = CryptoJS;
}

/// <reference types="jquery"/>

interface SummernoteOptions {
  lang?: string;
  hint?: any;
  toolbar?: any[];
  plugins?: any;
  placeholder?: string;
}

interface Summernote {
  options?: SummernoteOptions;
  plugins?: any;
  toolbar?: any[];
  ui?: any;
  dom?: any;
  popover?: any;

  (options?: SummernoteOptions): JQuery;

  (method: string, obj?: any): JQuery;
}

type ChosenOnEvent = 'chosen:ready' | 'chosen:maxselected' | 'chosen:showing_dropdown' | 'chosen:hiding_dropdown' | 'chosen:no_results';
type ChosenTriggerEvent = 'chosen:updated' | 'chosen:activate' | 'chosen:open' | 'chosen:close';

interface ChosenOptions {
  /**
   * When set to true on a single select, Chosen adds a UI element which selects the first element (if it is blank).
   */
  allow_single_deselect?: boolean;
  /**
   * By default, Chosen's search is case-insensitive. Setting this option to true makes the search case-sensitive.
   */
  case_sensitive_search?: boolean;
  /**
   * When set to true, Chosen will not display the search field (single selects only).
   */
  disable_search?: boolean;
  /**
   * Hide the search input on single selects if there are n or fewer options.
   */
  disable_search_threshold?: number;
  /**
   * By default, searching will match on any word within an option tag. Set this option to false if you want
   * to only match on the entire text of an option tag.
   */
  enable_split_word_search?: boolean;
  /**
   * By default, Chosen will search group labels as well as options, and filter to show all options below
   * matching groups. Set this to false to search only in the options.
   */
  group_search?: boolean;
  /**
   * By default, Chosen's results are hidden after a option is selected. Setting this option to false will keep
   * the results open after selection. This only applies to multiple selects.
   */
  hide_results_on_select?: boolean;
  /**
   * When set to true, Chosen will grab any classes on the original select field and add them to Chosen’s
   * container div.
   */
  inherit_select_classes?: boolean;
  /**
   * Limits how many options the user can select. When the limit is reached, the `chosen:maxselected` event is
   * triggered.
   */
  max_selected_options?: number;
  /**
   * The text to be displayed when no matching results are found. The current search is shown at the end of the text
   * (e.g., No results match "Bad Search").
   */
  no_results_text?: string;
  /**
   * The text to be displayed as a placeholder when no options are selected for a multiple select.
   */
  placeholder_text_multiple?: string;
  /**
   * The text to be displayed as a placeholder when no options are selected for a single select.
   */
  placeholder_text_single?: string;
  /**
   * Chosen supports right-to-left text in select boxes. Set this option to true to support right-to-left text options.
   */
  rtl?: boolean;
  /**
   * By default, Chosen’s search matches starting at the beginning of a word. Setting this option to true allows
   * matches starting from anywhere within a word.
   * This is especially useful for options that include a lot of special characters or phrases in ()s and []s.
   */
  search_contains?: boolean;
  /**
   * By default, pressing delete/backspace on multiple selects will remove a selected choice.
   * When false, pressing delete/backspace will highlight the last choice, and a second press deselects it.
   */
  single_backstroke_delete?: boolean;
  /**
   * The width of the Chosen select box. By default, Chosen attempts to match the width of the select box you are
   * replacing.
   * If your select is hidden when Chosen is instantiated, you must specify a width or the select will show up with
   * a width of 0.
   */
  width?: string;
  /**
   * By default, Chosen includes disabled options in search results with a special styling. Setting this option to
   * false will hide disabled results and exclude them from searches.
   */
  display_disabled_options?: boolean;
  /**
   * By default, Chosen includes selected options in search results with a special styling. Setting this option to
   * false will hide selected results and exclude them from searches.
   * Note: this is for multiple selects only. In single selects, the selected result will always be displayed.
   */
  display_selected_options?: boolean;
  /**
   * By default, Chosen only shows the text of a selected option. Setting this option to true will show the text and
   * group (if any) of the selected option.
   */
  include_group_label_in_selected?: boolean;
  /**
   * Only show the first (n) matching options in the results. This can be used to increase performance for selects
   * with very many options.
   */
  max_shown_results?: number;
}

interface ChosenSelectedData {
  selected: string;
  deselected: string;
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {

  summernote(options?: SummernoteOptions): this;

  summernote(method: string, obj?: any): this;

  alert(action?: 'close' | 'dispose'): this;

  button(action: 'toggle' | 'dispose'): this;

  carousel(action: 'cycle' | 'pause' | number | 'prev' | 'next' | 'dispose'): this;

  carousel(options?: any): this;

  collapse(action: 'toggle' | 'show' | 'hide' | 'dispose'): this;

  collapse(options?: any): this;

  dropdown(action: 'toggle' | 'update' | 'dispose'): this;

  dropdown(options?: any): this;

  modal(action: 'toggle' | 'show' | 'hide' | 'handleUpdate' | 'dispose'): this;

  modal(options?: any): this;

  popover(action: 'show' | 'hide' | 'toggle' | 'dispose' | 'enable' | 'disable' | 'toggleEnabled' | 'update'): this;

  popover(options?: any): this;

  scrollspy(action: 'refresh' | 'dispose'): this;

  scrollspy(options?: any): this;

  tab(action: 'show' | 'dispose'): this;

  tooltip(action: 'show' | 'hide' | 'toggle' | 'dispose' | 'enable' | 'disable' | 'toggleEnabled' | 'update'): this;

  tooltip(options?: any): this;


  // Chosen
  chosen(options?: ChosenOptions | 'destroy'): this;

  /**
   * Chosen triggers the standard DOM event whenever a selection is made
   * (it also sends a selected or deselected parameter that tells you which option was changed).
   */
  on(events: 'change', handler: (eventObject: any, args: ChosenSelectedData) => any): this;

  /**
   * * `chosen:ready` Triggered after Chosen has been fully instantiated.
   * * `chosen:maxselected` Triggered if max_selected_options is set and that total is broken.
   * * `chosen:showing_dropdown` Triggered when Chosen’s dropdown is opened.
   * * `chosen:hiding_dropdown` Triggered when Chosen’s dropdown is closed.
   * * `chosen:no_results` Triggered when a search returns no matching results.
   */
  on(events: ChosenOnEvent, handler: (eventObject: any) => any): this;

  /**
   * * `chosen:updated` This event should be triggered whenever Chosen’s underlying select element changes
   * (such as a change in selected options).
   * * `chosen:activate` This is the equivalant of focusing a standard HTML select field. When activated,
   * Chosen will capure keypress events as if you had clicked the field directly.
   * * `chosen:open` This event activates Chosen and also displays the search results.
   * * `chosen:close` This event deactivates Chosen and hides the search results.
   */
  trigger(eventType: ChosenTriggerEvent): this;
}

interface JQueryStatic {
  summernote: Summernote;
}

interface Array<T> {
  unique(a): Array<T>;
}
