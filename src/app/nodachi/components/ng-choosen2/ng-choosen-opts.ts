import {isNullOrUndefined} from '@app/nodachi/utils/utility';

export interface INgChoosenOpts2 {
  valueField?: string;
  textField?: string;
  multiSelect?: boolean;
  elClass?: Array<string>;
  placeHolder?: string;
  noResultsText?: string;
  width?: string;
  allow_single_deselect?: boolean;
  search_contains?: boolean;
}

/** Opciones para el component choosen.
 * @param {string} valueField value en la options del select (default: "id").
 * @param {string} textField text en la options del select(default: "description").
 * @param {boolean} multiSelect si el select es multiple (default: false).
 * @param {Array<string>} elClass classes css para el select (default: ["form-control"]).
 * @param {string} placeHolder texto si no hay opcion seleccionada (default: "Selecciona una opcion").
 * @param {string} noResultsText texto si no se encuentra opcion en la busqueda (default: "No se encontraron resultados").
 * @param {string} width ancho del select (default: "100%").
 */
export class NgChoosenOpts2 {

  /**
   * value en la options del select (default: "id").
   */
  valueField?: string;

  /**
   * text en la options del select(default: "description").
   */
  textField?: string;

  /**
   * si el select es multiple (default: false).
   */
  multiSelect?: boolean;

  /**
   * classes css para el select (default: ["form-control"]).
   */
  elClass?: Array<string>;

  /**
   * texto si no hay opcion seleccionada (default: "Selecciona una opción").
   */
  placeHolder?: string;

  /**
   * texto si no se encuentra opcion en la busqueda (default: "No se encontraron resultados").
   */
  noResultsText?: string;

  /**
   * ancho del select (default: "100%").
   */
  width?: string;

  /**
   * permite limpiar el select.
   */
  allow_single_deselect?: boolean;

  /**
   * Permite hacer la busqueda por contain
   */
  search_contains?: boolean;

  /**
   *
   * Opciones para el component choosen.
   * @param {INgChoosenOpts} opt
   */
  constructor(opt?: INgChoosenOpts2) {
    this.valueField = (opt && opt.valueField) ? opt.valueField : 'id';

    this.textField = (opt && opt.textField) ? opt.textField : 'description';

    this.elClass = (opt && opt.elClass) ? opt.elClass : ['form-control'];

    this.placeHolder = (opt && opt.placeHolder) ? opt.placeHolder : 'Selecciona una opción';

    this.noResultsText = (opt && opt.noResultsText) ? opt.noResultsText : 'No se encontraron resultados';

    this.multiSelect = (opt && !isNullOrUndefined(opt.multiSelect)) ? opt.multiSelect : false;

    this.width = (opt && opt.width) ? opt.width : '100%';

    this.allow_single_deselect = (opt && !isNullOrUndefined(opt.allow_single_deselect)) ? opt.allow_single_deselect : true;

    this.search_contains = (opt && !isNullOrUndefined(opt.search_contains)) ? opt.search_contains : true;
  }
}
