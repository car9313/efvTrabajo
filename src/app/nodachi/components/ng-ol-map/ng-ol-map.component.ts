import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {MapService} from '../../services/map.service';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {SaicoLayoutService} from '../../../admin/saico-layout/saico-layout.service';
import {MapFeature, OlMapEvent} from './mapFeature';
import {ConfigService} from '../../services/config.services';
import {Subscription} from 'rxjs';
import {SelectItem} from '../../models/select-item';
import {TemplatePortal} from '@angular/cdk/portal';

import {Vector} from 'ol/layer';
import {Map, Overlay, View} from 'ol';
import {Point} from 'ol/geom';
import {defaults as controlDefaults, FullScreen, ZoomSlider} from 'ol/control';
import {defaults as defaultInteractions} from 'ol/interaction';

let nextId = 0;

@Component({
  selector: 'ng-ol-map',
  templateUrl: './ng-ol-map.component.html',
  styleUrls: ['./ng-ol-map.component.scss'],
})
export class NgOlMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('popup', { static: true }) popupElement: ElementRef;
  @ViewChild('popup_delete', { static: true }) popupDeleteElement: ElementRef;
  @Input() templaterefview: TemplateRef<any>;
  public id: string;
  public title: string;
  public style_class: string;
  public description: Array<any>;
  public showpopup: boolean;
  public showpopup_delete: boolean;
  private map: Map;
  private readonly view: View;
  private readonly extent?: Array<number>;
  private _zoom: number;
  private _center?: Array<number>;
  private _objects?: Array<MapFeature>;
  public objlayers: Array<Vector>;
  private subscription: Subscription;
  private clickedElement: Array<number>;
  public fullScreen: boolean;
  public popover: TemplatePortal;

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
  set objects(objects: Array<MapFeature>) {
    this._objects = objects;
    this.showpopup = false;
    this.showpopup_delete = false;
    this.clearObjects();
    this.loadObjects(objects);
  }

  @Input()
  readonly: boolean;

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

  popup: Overlay;
  popupDelete: Overlay;

  constructor(public mapService: MapService,
              public adminService: SaicoLayoutService,
              public configService: ConfigService,
              public viewContainerRef: ViewContainerRef) {
    this.target = `ng-olmap-${nextId++}`;
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
    this.showpopup = false;
    this.showpopup_delete = false;
    this.readonly = false;
    this.clickedElement = null;
    this.fullScreen = false;
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

  getColor(style_class) {
    if (!isNullOrUndefined(style_class)) {
      switch (style_class) {
        case 'primary':
          return '#007bff';
        case 'success':
          return '#28a745';
        case 'info':
          return '#17a2b8';
        case 'warning':
          return '#ffc107';
        case 'danger':
          return '#dc3545';
        case 'dark':
          return '#000';
      }
    } else {
      return '#000';
    }
  }

  ngAfterViewInit(): void {
    this.popup = new Overlay({
      element: this.popupElement.nativeElement,
      positioning: 'bottom-center',
      offset: [0, -26],
    });
    this.popupDelete = new Overlay({
      element: this.popupDeleteElement.nativeElement,
      positioning: 'bottom-center',
      offset: [5, -17],
    });
    setTimeout(() => {
      const controls = [new FullScreen(), new ZoomSlider()];
      if (this.legend.length > 0) {
        controls.push(this.mapService.legendControl(this.legend));
      }
      this.map = new Map({
        controls: controlDefaults({attribution: false}).extend(controls),
        interactions: defaultInteractions({mouseWheelZoom: false}),
        layers: this.mapService.layers(this.extent, this.projection),
        target: this.target,
        logo: false,
        view: this.view,
      });

      this.map.on('click', (evt: any) => {
        let action = 'none';
        let data: any = null;
        if (!isNullOrUndefined(evt)) {
          data = evt.coordinate;
          const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature1) => {
            return feature1;
          });
          if (feature) {
            const coordinates = (feature.getGeometry() as Point).getCoordinates();
            this.clickedElement = coordinates;
            if (this.readonly) {
              if (feature.get('title') !== undefined && feature.get('title') !== '') {
                action = 'view';
                data = feature;
                this.title = feature.get('title');
                this.style_class = feature.get('style_class') || 'dark';
                if (!isNullOrUndefined(this.templaterefview)) {
                  this.popover = new TemplatePortal(this.templaterefview, this.viewContainerRef);
                }
                this.popup.setPosition(coordinates);
                this.map.addOverlay(this.popup);
              } else {
                action = 'view-feature';
                data = feature;
              }
            } else {
              action = 'popup-delete';
              this.id = feature.get('idItem');
              this.title = feature.get('title');
              this.description = feature.get('description');
              this.style_class = feature.get('style_class');
              this.popupDelete.setPosition(coordinates);
              this.map.addOverlay(this.popupDelete);
            }
          } else {
            if (!this.readonly) {
              action = 'add';
              this.loadObjects([
                {latitude: evt.coordinate[1], longitude: evt.coordinate[0]},
              ]);
            }
          }
          this.clickMap.emit({evt: evt, action: action, data: data});
        }
      });

      this.map.on('pointermove', (evt: any) => {
        if (!isNullOrUndefined(evt)) {
          if (evt.dragging) {
            // this.showpopup = false;
            /*$(this.popup.nativeElement).popover('dispose');*/
            return;
          }
          const pixel = this.map.getEventPixel(evt.originalEvent);
          const hit = this.map.hasFeatureAtPixel(pixel);
          let features = [];
          if (hit) {
            features = this.map.getFeaturesAtPixel(pixel, {
              layerFilter: (layer => {
                return layer.get('type') !== 'base-prov';
              }),
            }) || [];
          }
          (this.map.getTargetElement() as HTMLElement).style.cursor = (hit && features.length > 0) ? 'pointer' : '';
          this.pointermove.emit(evt);
        }
      });

      this.map.on('moveend', (evt: any) => {
        if (!isNullOrUndefined(evt)) {
          this.moveend.emit(evt);
        }
      });

      this.ready.emit(this.map);
    }, 0);
  }

  close() {
    if (!isNullOrUndefined(this.map)) {
      this.map.removeOverlay(this.popup);
      this.map.removeOverlay(this.popupDelete);
    }
  }

  loadObjects(objects: Array<MapFeature>) {
    if (!isNullOrUndefined(this.map)) {
      objects.forEach((item) => {
        if ((!isNullOrUndefined(item.latitude) && !isNullOrUndefined(item.longitude)) || item.location !== null) {
          let color = '#000';
          if (!isNullOrUndefined(item.style_class)) {
            color = this.getColor(item.style_class);
          }
          const geometry: any = !isNullOrUndefined(item.location) ? item.location : [item.longitude, item.latitude];
          const vectorLayer = this.mapService.createMarker(geometry, {
              idItem: item.idItem || '',
              description: item.description || [],
              title: item.title || '',
              style_class: item.style_class || 'dark',
            },
            color,
            '26px',
            item.srcMarker,
            item.typeMarker,
          );
          this.map.addLayer(vectorLayer);
          this.objlayers.push(vectorLayer);
        }
      });
    }
  }

  clearObjects() {
    if (!isNullOrUndefined(this.popup) && !isNullOrUndefined(this.popupDelete)) {
      this.close();
    }
    if (!isNullOrUndefined(this.map)) {
      this.objlayers.forEach((item) => {
        this.map.removeLayer(item);
      });
    }
  }

  delete_feature() {
    if (this.clickedElement !== null) {
      const pixel = this.map.getPixelFromCoordinate(this.clickedElement);
      const layers = this.map.forEachLayerAtPixel(pixel, (layer => layer));
      if (!isNullOrUndefined(layers)) {
        this.map.removeLayer(layers);
        this.map.removeOverlay(this.popupDelete);
        this.clickMap.emit({evt: null, action: 'delete', data: this.clickedElement});
      }
    }
  }
}
