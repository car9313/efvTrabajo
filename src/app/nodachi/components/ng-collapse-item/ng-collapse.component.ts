import { Component, Input } from '@angular/core';
import { isNullOrUndefined } from '@app/nodachi/utils/utility';

let nextId = 0;

export class CollapseSettings {
  constructor(public headers: any, public collapsedItems: any, public hideNull: boolean) {
  }
}

@Component({
  selector: 'ng-collapse-item',
  templateUrl: './ng-collapse.component.html',
  styleUrls: ['./ng-collapse.component.scss']
})
export class NgCollapseItemComponent {
  @Input() settings: CollapseSettings;
  public _object: any;
  id: string;
  encabezados: any;
  ocultos: any;
  collapsed: boolean;
  collapsing: boolean;

  @Input()
  set object(objeto: any) {
    if (!isNullOrUndefined(objeto)) {
      this._object = objeto;
      this.consolidando();
    }
  }

  constructor() {
    this.id = 'ngCollapse' + nextId++;
    this.collapsed = false;
    this.settings = { headers: [], collapsedItems: [], hideNull: false };
    this.encabezados = [];
    this.ocultos = [];
    this.collapsing = false;
  }

  collapse(): void {
    this.collapsed = !this.collapsed;
  }

  consolidando() {
    const headers = this.settings.headers;
    const obj = this._object;
    const ocultos = this.settings.collapsedItems;
    for (const key in headers) {
      if (key && (!this.settings.hideNull
        || (this.settings.hideNull && !isNullOrUndefined(obj[key])))) {
        this.encabezados.push({ key: headers[key], value: obj[key] });
      }
    }
    for (const key in ocultos) {
      if (key) {
        this.ocultos.push({ key: ocultos[key], value: obj[key] });
      }
    }
  }
}
