import {Injectable} from '@angular/core';
import {ConfigService} from './config.services';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Group, Tile, Vector} from 'ol/layer';
import {TileWMS, Vector as VectorSource} from 'ol/source';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import Feature from 'ol/Feature';
import {GeoJSON, WKT} from 'ol/format';
import {LineString, Point, Polygon} from 'ol/geom';
import {Control} from 'ol/control';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class MapService {

  constructor(public configService: ConfigService, public httpClient: HttpClient) {
  }

  layers(mapExtent, projectionName) {
    const dpa_1975 = this.getTiledMap('idesoi:DPACuba1975', mapExtent, projectionName);
    dpa_1975.setProperties([{title: 'DPA 1975', type: 'base', id: 'dpa_1975'}]);

    const dpa_2011 = this.getTiledMap('idesoi:DPACuba2011', mapExtent, projectionName);
    dpa_2011.setProperties([{title: 'DPA 2011', type: 'base', id: 'dpa_2011'}]);

    const cartas_nauticas_cubanas = this.getTiledMap('idesoi:GPKG-CartasNauticasCubanas', mapExtent, projectionName);
    cartas_nauticas_cubanas.setProperties([{
      title: 'Cartas Náuticas Cubanas',
      type: 'base',
      id: 'cartas_nauticas_cubanas'
    }]);

    const planimetria_geoserver = this.getTiledMap('idesoi:Basecuba', mapExtent, projectionName);
    planimetria_geoserver.setVisible(true);
    planimetria_geoserver.setProperties([{title: 'Planimetría GeoServer', type: 'base', id: 'planimetria_geoserver'}]);

    const ol_style = new Style({
      fill: new Fill({
        color: 'transparent',
      }),
      stroke: new Stroke({
        color: '#0275d8',
        width: 1,
      }),
    });

    // const prov2011 = this.getFeature('idesoi:LimitesProv2011');
    // prov2011.setStyle(ol_style);
    // prov2011.set('type', 'base-prov');

    const group = new Group({
      layers: [
        // dpa_1975,
        // dpa_2011,
        // cartas_nauticas_cubanas,
        planimetria_geoserver,
        // prov2011,
      ],
    });
    group.set('title', 'Mapa Base');

    return [
      group,
    ];
  }

  getFeature(typeName: string) {
    const o = {
      'service': 'WFS',
      'version': '2.0.0',
      'request': 'GetFeature',
      'typeName': typeName,
      'outputFormat': 'application/json',
    };
    const p = new HttpParams({fromObject: o});
    const url = this.configService.getConfig('geoServerUrl') + '?' + p.toString();
    return new Vector({
      source: new VectorSource({
        url: url,
        format: new GeoJSON(),
      }),
    });
  }

  getTiledMap(layers: string, mapExtent, projectionName) {
    const tile = new Tile({
      visible: false,
      extent: mapExtent,
      source: new TileWMS({
        params: {
          'LAYERS': layers,
          'TILED': true,
        },
        projection: projectionName,
        url: this.configService.getConfig('geoServerUrl'),
        serverType: 'geoserver',
      }),
    });
    tile.setProperties([{type: 'base'}]);
    return tile;
  }

  createMarker(coords: Array<number> | string,
               data: { [p: string]: any } = {},
               color: string = '#000',
               height: string = '26px',
               srcMedia: string = '\uf3c5',
               mediaType = 'font') {

    const iconFeature = this.createFeature(coords, data);

    const iconStyle = mediaType === 'img' ? new Style({
      image: this.imageMarkerStyleFunction(srcMedia),
    }) : new Style({
      text: this.fontawesomeMarkerStyleFunction(height, srcMedia, color),
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    return new Vector({
      source: vectorSource,
    });
  }

  createPoint(coords: Array<number> | string) {

    const feature = this.createFeature(coords);

    feature.setStyle(this.pointStyleFunction());

    const vectorSource = new VectorSource({
      features: [feature],
    });

    return new Vector({
      source: vectorSource,
    });
  }

  createLine(pointA: Array<number>, pointB: Array<number>) {
    const options = Object.assign({
      geometry: new LineString([pointA, pointB]),
    }, {});
    const feature = new Feature(options);

    feature.setStyle(this.lineStyleFunction());

    const vectorSource = new VectorSource({
      features: [feature],
    });

    return new Vector({
      source: vectorSource,
    });
  }

  createPolygon(points: Array<Array<number>> | string) {
    let feature = null;
    if (typeof points === 'string') {
      feature = (new WKT()).readFeature(points);
    }
    if (Array.isArray(points)) {
      const options = Object.assign({
        geometry: new Polygon([points]),
      }, {});
      feature = new Feature(options);
    }
    if (feature) {
      feature.setStyle(this.polygonStyleFunction());
    } else {
      feature = new Feature();
    }
    const vectorSource = new VectorSource({
      features: [feature],
    });

    return new Vector({
      source: vectorSource,
    });
  }

  polygonStyleFunction() {
    return new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 1, 0.3)',
      }),
      stroke: new Stroke({
        color: '#0275d8',
        width: 1,
      }),
    });
  }

  pointStyleFunction() {
    return new Style({
      image: new Circle({
        radius: 2,
        fill: new Fill({color: 'rgba(255, 0, 0, 0.1)'}),
        stroke: new Stroke({color: '#000', width: 1}),
      }),
    });
  }

  lineStyleFunction() {
    return new Style({
      stroke: new Stroke({
        color: 'green',
        width: 2,
      }),
    });
  }

  imageMarkerStyleFunction(src?: string, scale?:number) {
    const img = isNullOrUndefined(src) ? 'marker-26' : src;
    let obj: any = {
      anchor: [0.5, 26],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: `/assets/${img}.png`,
    };
    if (scale) {
      obj.scale = scale;
    }
    return new Icon(obj);
  }

  fontawesomeMarkerStyleFunction(height, fontIcon, color) {
    const styleText = new Text({
      font: `900 ${height}/${height} "Font Awesome 5 Free"`,
      text: fontIcon,
      textBaseline: 'bottom',
      fill: new Fill({
        color: color,
      }),
      placement: 'point',
    });
    styleText['overflow'] = true;

    return styleText;
  }


  createFeature(geometry: Array<number> | string, properties?: { [p: string]: any }): Feature {
    let feature = new Feature();
    if (typeof geometry === 'string') {
      feature = (new WKT()).readFeature(geometry);
    } else {
      feature.setGeometry(new Point(geometry));
    }
    if (properties) {
      feature.setProperties(properties);
    }
    if (properties && properties.id) {
      feature.setId(properties.id);
    }
    return feature;
  }

  searchColorbyIP(indice): any {
    switch (indice) {
      case 'AP':
        return 'danger';
      case 'P':
        return 'primary';
      case 'MP':
        return 'success';
      case 'NP':
      default:
        return 'dark';
    }
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

  legendControl(legend) {
    let legendControl;
    legendControl = function (opt_options) {
      const options = opt_options || {};
      const button = document.createElement('button');
      button.type = 'button';
      button.title = 'Leyenda';
      button.textContent = '>>';
      let collapsed = false;

      const ul = document.createElement('ul');
      ul.classList.add('list-inline');
      legend.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('list-inline-item');
        li.innerHTML = `<span class="badge badge-${item.id}">${item.description}</span>`;
        ul.appendChild(li);
      });

      const handleLegend = () => {
        collapsed = !collapsed;
        button.textContent = collapsed ? 'L' : '>>';
        ul.classList.toggle('d-none');
      };

      button.addEventListener('click', handleLegend, false);
      button.addEventListener('touchstart', handleLegend, false);

      const element = document.createElement('div');
      element.className = 'legend-ol-map ol-unselectable ol-control';
      element.appendChild(ul);
      element.appendChild(button);

      Control.call(this, {
        element: element,
        target: options.target,
      });
    };
    legendControl.prototype = Object.create(Control.prototype);
    legendControl.prototype.constructor = legendControl;
    return new legendControl();
  }

  getQueryFeature(arg) {
    const o = Object.assign({
      'service': 'WFS',
      'version': '1.0.0',
      'request': 'GetFeature',
      'outputFormat': 'JSON',
    }, arg);
    return this.httpClient.get(this.configService.getConfig('geoServerUrl'), {params: o});
  }

  getProvinceOfPoint(wkt): Observable<any> {
    const params = {
      typeName: 'idesoi:Prov2011',
      maxFeatures: '1',
      cql_filter: `CONTAINS(the_geom,${wkt})`,
      PROPERTYNAME: 'Nombre,CODIGO',
    };
    return this.getQueryFeature(params)
      .pipe(
        map((resp: any) => {
          return !isNullOrUndefined(resp.features) && resp.features.length > 0 ? resp.features[0] : null;
        }));
  }

}
