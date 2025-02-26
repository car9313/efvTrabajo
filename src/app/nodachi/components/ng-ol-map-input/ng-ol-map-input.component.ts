import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {MapService} from '../../services/map.service';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {SaicoLayoutService} from '../../../admin/saico-layout/saico-layout.service';
import {ConfigService} from '../../services/config.services';
import {Subscription} from 'rxjs';
import {SelectItem} from '../../models/select-item';
import {OlMapEvent} from '../ng-ol-map/mapFeature';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {Notifications} from '../../services/notifications';

import {Map, View} from 'ol';
import {Vector} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {defaults as controlDefault, FullScreen, ZoomSlider} from 'ol/control';
import {defaults as defaultInteractions, Draw, Modify, Select, Snap} from 'ol/interaction';
import {Point} from 'ol/geom';
import {WKT} from 'ol/format';
import {Style} from 'ol/style';
import {coerceArray} from '@angular/cdk/coercion';

let nextId = 0;

@Component({
  selector: 'ng-ol-map-input',
  template: `
    <div class='olmap shadow' [attr.id]="target"></div>`,
  styleUrls: ['./ng-ol-map-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgOlMapInputComponent),
    multi: true,
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NgOlMapInputComponent),
    multi: true,
  }],
})
export class NgOlMapInputComponent implements ControlValueAccessor, Validator, OnInit, AfterViewInit, OnDestroy {

  @HostBinding('class') cssClass;
  @HostBinding('attr.multiple') attrMultiple;
  @ViewChild('popup', { static: false }) popupElement: ElementRef;
  @Input() templaterefview: TemplateRef<any>;
  private map: Map;
  private readonly view: View;
  private readonly extent?: Array<number>;
  private _zoom: number;
  private _center?: Array<number>;
  public objlayers: Vector[];
  private subscription: Subscription;
  private clickedElement: Array<number>;
  private _disabled: boolean;
  private _multiple: boolean;
  private _onChange: () => void;

  @Input()
  set center(value: Array<number>) {
    this._center = value;
    this.view.setCenter(this._center);
  }

  @Input()
  set zoom(value: number) {
    this._zoom = value;
    this.view.setZoom(this._zoom);
  }

  @Input()
  projection?: string;
  @Input()
  target?: string;

  @Input()
  get multiple(): boolean | string {
    return this._multiple;
  }

  set multiple(value: boolean | string) {
    this._multiple = value != null && value !== false && `${value}` !== 'false';
    if (this._onChange) {
      this._onChange();
    }
  }

  @Input() format?: string;

  @Input()
  legend: Array<SelectItem>;

  @Output()
  clickMap = new EventEmitter<OlMapEvent>();
  @Output()
  pointermove = new EventEmitter<any>();
  @Output()
  moveend = new EventEmitter<any>();
  @Output()
  ready = new EventEmitter<Map>();
  @Output()
  change = new EventEmitter<any>();


  select: Select;
  modify: Modify;
  draw: Draw;
  snap: Snap;
  drawend: boolean;
  vector: Vector;
  vectorSource: Vector;
  model: any;

  constructor(public mapService: MapService,
              public adminService: SaicoLayoutService,
              public configService: ConfigService,
              private notification: Notifications) {
    this.target = `ng-olmap-input-${nextId++}`;
    this.extent = [-180.0, -90.0, 180.0, 90.0];
    this.projection = 'EPSG:4326';
    this.view = new View({
      projection: this.projection,
      minZoom: 6,
      maxZoom: 20,
      extent: this.extent,
    });
    if (isNullOrUndefined(this._center)) {
      this.center = [-79.5, 21.5];
    }
    if (isNullOrUndefined(this._zoom)) {
      this.zoom = 7;
    }
    this.map = null;
    this.objlayers = [];
    this.legend = [];
    this.clickedElement = null;
    this.cssClass = 'ol-map-input';
    this.multiple = false;
    this.format = 'Point';
    this.vectorSource = new VectorSource();
    this.attrMultiple = this.multiple ? '' : null;
  }

  ngOnInit() {
    this.subscription = this.adminService.getObserver().subscribe(
      () => {
        setTimeout(() => this.updateMap(), 400);
      },
    );
  }

  updateMap() {
    if (!isNullOrUndefined(this.map)) {
      setTimeout(() => this.map.updateSize(), 0);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const controls = [new FullScreen(), new ZoomSlider()];
      if (this.legend.length > 0) {
        controls.push(this.mapService.legendControl(this.legend));
      }
      this.map = new Map({
        controls: controlDefault({attribution: false}).extend(controls),
        interactions: defaultInteractions({mouseWheelZoom: false}),
        layers: this.mapService.layers(this.extent, this.projection),
        target: this.target,
        view: this.view,
      });

      this.vector = new Vector({
        source: this.vectorSource,
      });
      this.select = new Select();

      this.modify = new Modify({
        // features: this.select.getFeatures()
        source: this.vectorSource,
      });
      this.draw = new Draw({
        source: this.vector.getSource(),
        type: this.format,
        condition: event1 => {
          if (this.format === 'Point') {
            const features = this.vector.getSource().getFeatures().find(value => {
              return (value.getGeometry() as Point).getCoordinates()[0] === event1.coordinate[0]
                && (value.getGeometry() as Point).getCoordinates()[1] === event1.coordinate[1];
            });
            return isNullOrUndefined(features);
          } else {
            return true;
          }
        },
      });
      this.snap = new Snap({
        source: this.vector.getSource(),
      });


      this.map.addLayer(this.vector);

      this.map.addInteraction(this.select);

      this.modify.on('modifyend', (evento: Modify.Event) => {
        this.onTouched();
      });
      this.map.addInteraction(this.modify);

      const selectedFeatures = this.select.getFeatures();
      this.select.on('change:active', () => {
        selectedFeatures.forEach((each) => {
          selectedFeatures.remove(each);
        });
      });

      this.select.on('select', (evento: Select.Event) => {
        if (evento.selected.length > 0 && this._multiple === false) {
          const feature = this.vectorSource.getClosestFeatureToCoordinate(evento.mapBrowserEvent.coordinate);
          const descrption = feature.get('description') || '';
          this.notification.confirm('Eliminar', `Desea eliminar el marcador ${descrption}`, () => {
            this.vectorSource.removeFeature(this.vectorSource.getClosestFeatureToCoordinate(evento.mapBrowserEvent.coordinate));
            this.setDraw(true);
          }, () => {
            this.modify.removePoint();
          });
        }
      });

      this.vectorSource.on(['addfeature', 'clear', 'removefeature', 'changefeature'], (evento: VectorSource.Event) => {
        const model = this.vectorSource.getFeatures().map(value => {
          return (new WKT()).writeFeature(value);
        });
        this.onChange(model.length === 0 ? null : model.length === 1 ? model[0] : model);
        this.change.emit(model.length === 0 ? null : model.length === 1 ? model[0] : model);
      });

      this.draw.on('drawend', (evento: Draw.Event) => {
        evento.feature.setStyle(this.createStyle());
        if (!this.multiple) {
          this.draw.setActive(false);
        }
        this.select.setActive(false);
        setTimeout(() => {
          this.select.setActive(true);
        }, 300);

        this.modify.setActive(true);
        this.drawend = true;

        this.onTouched();
      });
      this.map.addInteraction(this.draw);
      if (this.drawend) {
        this.draw.setActive(false);
      } else {
        this.modify.setActive(false);
        this.select.setActive(false);
      }
      if (this._disabled) {
        this.draw.setActive(false);
        this.modify.setActive(false);
        this.select.setActive(false);
      }
      this.map.addInteraction(this.snap);

      this.ready.emit(this.map);
    }, 0);
  }

  getModel() {
    const model = [];
    this.vectorSource.getFeatures().forEach(value => {
      model.push((new WKT()).writeFeature(value));
    });
    this.onChange(model);
    this.change.emit(model);
  }

  createStyle() {
    switch (this.format) {
      case 'Polygon':
        return this.mapService.polygonStyleFunction();
      case 'LineString':
        return this.mapService.lineStyleFunction();
      default:
        return new Style({
          text: this.mapService.fontawesomeMarkerStyleFunction('26px', '\uf3c5', '#000'),
        });
    }
  }

  onChange(_: any) {
  }

  onTouched() {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    if (!isNullOrUndefined(this.draw)) {
      this.draw.setActive(false);
    }
    if (!isNullOrUndefined(this.modify)) {
      this.modify.setActive(false);
    }
    if (!isNullOrUndefined(this.select)) {
      this.select.setActive(false);
    }
  }

  writeValue(obj: any): void {
    this.vectorSource.clear();
    if (!isNullOrUndefined(obj) && obj !== '') {
      const items = coerceArray(obj);
      items.forEach(item => {
        if (!isNullOrUndefined(item)) {
          const geometry: Array<number> | string = item;
          const feature = this.mapService.createFeature(geometry);
          feature.setStyle(this.createStyle());
          this.vectorSource.addFeature(feature);
          this.drawend = true;
          this.setDraw(false);
        }
      });
    }

  }

  setDraw(active: boolean = false) {
    if (!isNullOrUndefined(this.draw)) {
      this.draw.setActive(active);
      this.modify.setActive(!active);
      this.select.setActive(!active);
      this.drawend = !active;
    }
  }

  clearCanvas() {
    this.vectorSource.clear();
    this.setDraw(true);
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.multiple ? null : this._validator(c);
  }

  private _validator(absControl: AbstractControl): ValidationErrors | null {
    return this._isEmptyInputValue(absControl.value) ? null :
      Array.isArray(absControl.value) ? absControl.value.length > 1 ? {multiple: true} : null : null;
  }

  private _isEmptyInputValue(value: any): boolean {
    return value == null;
  }
}
