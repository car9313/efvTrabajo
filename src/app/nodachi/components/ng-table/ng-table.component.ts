import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { isNullOrUndefined } from '@app/nodachi/utils/utility';
import { ColumnTable } from '@app/nodachi/models/column-table';


export class HeaderView {
  constructor(public field: string, public field_view: string, public link?: string[], public externo?: boolean, public clickAction?: any) {
  }
}

export interface RowConfig {
  clickAction?: any;
  class?: any;
}

export interface IExtraHeader {
  title?: string;
  tooltip?: string;
  url?: any[];
  icon?: any;
  target?: string;
  clickAction?: any;
  condition?: any;
  conditionDisable?: any;
  externo?: boolean;
  class?: any;
}

let paginationId = 0;

@Component({
  selector: 'ng-table',
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.scss'],
})
export class NgTableComponent implements AfterViewInit, OnChanges {

  constructor() {
    this.rows = [];
    this.rowsSelection = [];
    this.headers = [];
    this.extraHeaders = [];
    this.showPrint = true;
    this.headerView = { field: '', link: [], field_view: 'id' };
    this.columns = [];
    this.select = new EventEmitter();
    this.update = new EventEmitter();
    this.view = new EventEmitter();
    this.removeConfirm = new EventEmitter();
    this.search = new EventEmitter();
    this.print = new EventEmitter();
    this.currentpageChange = new EventEmitter();
    this.permissions = {};
    this.currentItems = 0;
    this.itemPerPage = 10;
    this.totalItems = 0;
    this.totalPage = 0;
    this.paginationId = `pagination-${paginationId++}`;
    this.keepHtml = [];
    this.rowConfig = {};

    this.locale = {
      previousLabel: 'Anterior',
      nextLabel: 'Siguiente',
    };

    this.selecteable = false;
    this.multipleSelect = false;
    this.editable = true;
    this.viewable = true;
    this.selectIcon = 'fa-check';
  }

  @Input() rows: any[];
  @Input() rowConfig: RowConfig;
  @Input() headers: any[];
  @Input() extraHeaders: IExtraHeader[];
  @Input() headerView: HeaderView;
  @Input() permissions;
  @Input() currentItems;
  @Input() itemPerPage;
  @Input() currentpage;
  @Input() totalItems;
  @Input() totalPage;
  @Input() selecteable: boolean;
  @Input() multipleSelect: boolean;
  @Input() selectIcon: string;
  @Input() editable: boolean;
  @Input() viewable: boolean;
  @Input() keepHtml: any[];
  @Input() tableClass: string[];
  @Input() showPrint: boolean;
  columns: Array<ColumnTable>;
  rowsSelection: Array<boolean>;
  @Output() select: EventEmitter<any>;
  @Output() update: EventEmitter<any>;
  @Output() view: EventEmitter<any>;
  @Output() removeConfirm: EventEmitter<any>;
  @Output() search: EventEmitter<number>;
  @Output() print: EventEmitter<any>;
  @Output() currentpageChange: EventEmitter<number>;

  paginationId: string;

  locale: any;

  flag = false;

  ngAfterViewInit() {
    this.setColumns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['headers']) {
      this.setColumns();
    }
  }

  cambiarFlag() {
    this.flag = !this.flag;
  }

  setColumns() {
    const headers = this.headers;
    this.columns = [];
    for (const key in headers) {
      if (key) {
        this.columns.push({ name: key, title: headers[key] });
      }
    }
  }

  OnUpdate(e) {
    this.update.emit(e);
  }

  OnView(e) {
    this.view.emit(e);
  }

  OnRemoveConfirm(obj) {
    const e = { item: obj, title: 'title' };
    this.removeConfirm.emit(e);
  }

  checkCondition(val, row) {
    return (!isNullOrUndefined(val) && typeof val === 'function') ? val(row) : true;
  }

  exectFunc(val, row) {
    return (!isNullOrUndefined(val) && typeof val === 'function') ? val(row) : val;
  }

  type(val) {
    return typeof val;
  }

  pageChanged(page: number) {
    this.currentpageChange.emit(page);
    this.search.emit(page);
  }

  public getData(row: any, propertyName: string): string {
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }

  public getLink(row: any, propertyName: string[]): string[] {
    const regex = /^\${[\w|.]+}$/;
    const routerLink = [];
    propertyName.forEach((value => {
      if (regex.test(value)) {
        routerLink.push(value.substring(2, (value.length - 1)).split('.').reduce((prev: any, curr: string) => prev[curr], row));
      } else {
        routerLink.push(value);
      }
    }));
    return routerLink;
  }

  public getPublicLink(row: any, propertyName: string[], btn?: any): string {
    if (btn) {
      if (btn.clickAction) {
        return '#';
      }
    }
    const regex = /^\${[\w|.]+}$/;
    let routerLink = '';
    propertyName.forEach((value => {
      if (regex.test(value)) {
        routerLink += (value.substring(2, (value.length - 1)).split('.').reduce((prev: any, curr: string) => prev[curr], row));
      } else {
        routerLink += (value);
      }
    }));
    return routerLink;
  }

  selectItem(row, i) {
    if (this.multipleSelect) {
      row.selected = !row.selected;
      const rows = this.rows.map((value, index) => {
        const selection = this.rows[index] || false;
        return Object.assign({ selected: selection, object: i === index }, value);
      });
      this.select.emit(rows);
    } else {
      this.select.emit(row);
    }
  }

  clickAction(action, row, event) {
    if (!action) {
      return;
    }
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (typeof action === 'function') {
      action(row);
    }
  }

  onPrint(formato) {
    this.print.emit(formato/*,this.headers*/);
  }
  /*
    onPrint() {
      // Extraemos el
      const DATA = document.getElementById('htmlData');
      console.log(DATA);
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
      html2canvas(DATA, options).then((canvas) => {

        const img = canvas.toDataURL('image/PNG');

        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((docResult) => {
        docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      });
    }
  */
  selectAll() {
    if (this.rows.some(x => x.selected !== true)) {
      this.rows.map(e => e.selected = true);
    } else {
      this.rows.map(e => e.selected = false);
    }
    this.select.emit(this.rows);
  }

  checkAllSelect() {
    return this.rows.some(x => x.selected !== true);
  }

  RejectMultiple() {
    console.log(this.rows.filter(x => x.selected === true).map(x => x.id));
  }
}
