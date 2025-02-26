import {Injectable} from '@angular/core';
import * as XMLWriter from 'xml-writer';
import {Observable} from 'rxjs';
import {ConfigService} from './config.services';
import {AdvanceSearch} from '../models/advance-search';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

export interface GeocodedAddress {
  freeFormAddress?: string;
  accuracy?: string;
  matchType?: string;
  srsName?: string;
  lat?: number;
  lon?: number;
}

@Injectable()
export class OpenLSServerService {

  private url: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.url = this.config.getConfig('openLSServer');
  }

  private static mapAddress(resp: any) {
    const list = new DOMParser().parseFromString(resp, 'text/xml').getElementsByTagName('GeocodedAddress');
    const geocodedAddresses: Array<GeocodedAddress> = [];
    for (let i = 0; i < list.length; i++) {
      const geo: GeocodedAddress = {};
      const fAddress = list.item(i).getElementsByTagName('freeFormAddress');
      if (fAddress.length > 0) {
        geo.freeFormAddress = fAddress.item(0).textContent;
      }
      const p = list.item(i).getElementsByTagName('pos');
      if (p.length > 0) {
        const point = p.item(0).textContent.split(' ');
        if (point.length > 1) {
          geo.lat = parseFloat(point[1]);
          geo.lon = parseFloat(point[0]);
        }
      }
      const geocodeMatchCode = list.item(i).getElementsByTagName('GeocodeMatchCode');
      if (geocodeMatchCode.length > 0) {
        geo.accuracy = geocodeMatchCode.item(0).getAttribute('accuracy');
        geo.matchType = geocodeMatchCode.item(0).getAttribute('matchType');
      }
      const points = list.item(i).getElementsByTagName('Point');
      if (points.length > 0) {
        geo.srsName = points.item(0).getAttribute('srsName');
      }
      geocodedAddresses.push(geo);
    }
    return geocodedAddresses;

  }

  private static CreateAddressXML(search: AdvanceSearch | string) {
    const xw = new XMLWriter('  ');
    xw.startDocument('1.0', 'UTF-8');

    xw.startElement('XLS');
    xw.writeAttribute('version', '1.2');
    xw.writeAttribute('n1:lang', 'en-US');
    xw.writeAttribute('xmlns:n1', 'http://www.opengis.net/xls');
    xw.writeAttribute('xmlns', 'http://www.opengis.net/xls');

    xw.startElement('RequestHeader');
    xw.writeAttribute('MSID', 'DPA2011');
    xw.endElement('RequestHeader');

    xw.startElement('Request');
    xw.writeAttribute('version', '1.2');
    xw.startAttribute('requestID').text('').endAttribute();
    xw.writeAttribute('methodName', 'GeocodeService');
    xw.writeAttribute('maximumResponses', '10');

    xw.startElement('GeocodeRequest');

    xw.startElement('Address');

    if (typeof search === 'object') {
      xw.startElement('StreetAddress');

      xw.startElement('Building');
      xw.startAttribute('buildingName').text('').endAttribute();
      xw.startAttribute('subdivision').text('').endAttribute();
      xw.startAttribute('number').text('').endAttribute();
      xw.endElement('Building');
      xw.writeElement('Street', (search.street1 ? search.street1.toLocaleUpperCase() : '') + ','
        + (search.street2 ? search.street2.toLocaleUpperCase() : '') + ','
        + (search.street3 ? search.street3.toLocaleUpperCase() : '') + ','
        + (search.km ? search.km.toLocaleUpperCase() : ''));

      xw.endElement('StreetAddress');

      xw.startElement('Place');
      xw.writeAttribute('type', 'CountrySubdivision');
      xw.text(search.province ? search.province.toLocaleUpperCase() : '');
      xw.endElement('Place');

      xw.startElement('Place');
      xw.writeAttribute('type', 'Municipality');
      xw.text(search.municipality ? search.municipality.toLocaleUpperCase() : '');
      xw.endElement('Place');

      xw.startElement('Place');
      xw.writeAttribute('type', 'MunicipalitySubdivision');
      xw.text(search.council ? search.council.toLocaleUpperCase() : '');
      xw.endElement('Place');
    }

    if (typeof search === 'string') {
      xw.startElement('freeFormAddress');

      xw.writeElement('freeFormAddress', search ? search.toLocaleUpperCase() : '');

      xw.endElement('freeFormAddress');
    }

    xw.endElement('Address');

    xw.endElement('GeocodeRequest');

    xw.endElement('Request');

    xw.endElement('XLS');
    xw.endDocument();

    return xw.toString();
  }

  GeoCodeAddress(search: AdvanceSearch | string): Observable<Array<GeocodedAddress>> {
    const xmlDocument = OpenLSServerService.CreateAddressXML(search);
    return this.http.post(this.url, xmlDocument, {headers: {}, responseType: 'text'})
      .pipe(map(OpenLSServerService.mapAddress));
  }
}
