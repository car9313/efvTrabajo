

export interface IMapFeature {
  idItem?: number;
  title?: string;
  description?: Array<string>;
  latitude?: number;
  longitude?: number;
  style_class?: string;
  location?: string | string[] | [number, number];
  typeMarker?: string;
  srcMarker?: string;
}

export class MapFeature {
  idItem?: number;
  title?: string;
  description?: Array<string>;
  latitude?: number;
  longitude?: number;
  location?: string | string[] | [number, number];
  style_class?: string;
  typeMarker?: string;
  srcMarker?: string;

  constructor(opt?: IMapFeature) {
    this.idItem = (opt && opt.idItem) ? opt.idItem : 0;
    this.title = (opt && opt.title) ? opt.title : 'Posición';
    this.description = (opt && opt.description) ? opt.description : [];
    this.latitude = (opt && opt.latitude) ? opt.latitude : 0;
    this.longitude = (opt && opt.longitude) ? opt.longitude : 0;
    this.location = (opt && opt.location) ? opt.location : null;
    this.style_class = (opt && opt.style_class) ? opt.style_class : 'dark';
    this.typeMarker = (opt && opt.typeMarker) ? opt.typeMarker : 'font';
    this.srcMarker = (opt && opt.srcMarker) ? opt.srcMarker : '\uf3c5';
  }
}

export interface OlMapEvent {
  evt: any;
  action: string;
  data: any;
}
