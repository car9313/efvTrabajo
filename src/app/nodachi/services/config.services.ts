import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { constants } from '../../../environments/constants';
import { HttpHeaders } from '@angular/common/http';

// Add this function
export function initConfig(config: ConfigService) {
  return () => config.load();
}

@Injectable()
export class ConfigService {
  public static whitelist = [];
  private config: any = null;
  private headers;

  constructor() {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  url() {
    return localStorage.getItem('serverApi') || this.getConfig('serverApi');
  }

  getSecretKey() {
    return constants.secretKey;
  }

  getClientId() {
    return constants.clientId;
  }

  getEnVar(key: string) {
    return this.config[key];
  }

  getConst(key: string) {
    return constants[key];
  }

  /**
   * Use to get the data found in the second file (config file)
   */
  public getConfig(key: any) {
    return this.config[key];
  }

  /**
   * Use to get the data found in the first file (env file)
   */
  public getEnv(key: any) {
    return environment[key];
  }

  public getFileUrl(fileId: string) {
    return fileId ? `${this.url()}/api/v1/core/file/${fileId}` : null;
  }

  /**
   * This method:
   *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
   *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
   */
  public load() {
    return fetch(`./assets/config.${environment.env}.json`)
      .then((response) => response.json())
      .then((responseData) => {
        this.config = responseData || {};
        if (!this.config.hasOwnProperty('serverApi')) {
          Promise.reject('Archivo de configuracion invalido');
        } else {
          Promise.resolve(true);
        }
        this.setAuthWhitelist();
      })
      .catch((error2) => {
        console.error('No se encuentra el archivo de configuracion');
        Promise.reject(error2.error);
      });
  }

  private setAuthWhitelist() {
    ConfigService.whitelist.push(this.getConfig('papyrusApi'));
    ConfigService.whitelist.push(this.getConfig('openLSServer'));
  }
}
