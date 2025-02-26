import {Injectable} from '@angular/core';

export interface TitleRoute {
  breadcrumb: string;
  navigation: string;
}

@Injectable()
export class BreadcrumbService {

  private routesFriendlyNames: Map<string, TitleRoute> = new Map<string, TitleRoute>();
  private routesFriendlyNamesRegex: Map<string, TitleRoute> = new Map<string, TitleRoute>();
  private routesWithCallback: Map<string, (string: string) => string> = new Map<string, (string: string) => string>();
  private routesWithCallbackRegex: Map<string, (string: string) => string> = new Map<string, (string: string) => string>();
  private hideRoutes: any = [];
  private hideRoutesRegex: any = [];

  constructor() {
  }

  /**
   * Specify a friendly name for the corresponding route.
   *
   * @param route
   * @param name
   */
  addFriendlyNameForRoute(route: string, name: TitleRoute): void {
    this.routesFriendlyNames.set(route, name);
  }

  /**
   * Specify a friendly name for the corresponding route matching a regular expression.
   *
   * @param routeRegex
   * @param name
   */
  addFriendlyNameForRouteRegex(routeRegex: string, name: TitleRoute): void {
    this.routesFriendlyNamesRegex.set(routeRegex, name);
  }

  /**
   * Specify a callback for the corresponding route.
   * When a mathing url is navigatedd to, the callback function is invoked to get the name to be displayed in the breadcrumb.
   */
  addCallbackForRoute(route: string, callback: (id: string) => string): void {
    this.routesWithCallback.set(route, callback);
  }

  /**
   * Specify a callback for the corresponding route matching a regular expression.
   * When a mathing url is navigatedd to, the callback function is invoked to get the name to be displayed in the breadcrumb.
   */
  addCallbackForRouteRegex(routeRegex: string, callback: (id: string) => string): void {
    this.routesWithCallbackRegex.set(routeRegex, callback);
  }

  /**
   * Show the friendly name for a given route (url). If no match is found the url (without the leading '/') is shown.
   *
   * @param route
   * @param breadcrumb
   * @returns {*}
   */
  getFriendlyNameForRoute(route: string, breadcrumb = true): string {
    let name: string;
    const routeEnd = route.substr(route.lastIndexOf('/') + 1, route.length);

    this.routesFriendlyNamesRegex.forEach((value, key) => {
      if (new RegExp(key).exec(route)) {
        name = breadcrumb ? value.breadcrumb : this.getValue(value);
      }
    });

    this.routesWithCallback.forEach((value, key) => {
      if (key === route) {
        name = value(routeEnd);
      }
    });

    this.routesWithCallbackRegex.forEach((value, key) => {
      if (new RegExp(key).exec(route)) {
        name = value(routeEnd);
      }
    });

    this.routesFriendlyNames.forEach((value, key) => {
      if (key === route) {
        name = breadcrumb ? value.breadcrumb : this.getValue(value);
      }
    });
    return name ? name : routeEnd;
  }

  getValue(value): string {
    let name = '';
    if (!value.navigation || value.navigation === '') {
      name = value.breadcrumb;
    } else {
      name = value.navigation;
    }
    return name;
  }

  /**
   * Specify a route (url) that should not be shown in the breadcrumb.
   */
  hideRoute(route: string): void {
    if (this.hideRoutes.indexOf(route) === -1) {
      this.hideRoutes.push(route);
    }
  }

  /**
   * Specify a route (url) regular expression that should not be shown in the breadcrumb.
   */
  hideRouteRegex(routeRegex: string): void {
    if (this.hideRoutesRegex.indexOf(routeRegex) === -1) {
      this.hideRoutesRegex.push(routeRegex);
    }
  }

  /**
   * Returns true if a route should be hidden.
   */
  isRouteHidden(route: string): boolean {
    let hide = this.hideRoutes.indexOf(route) > -1;

    this.hideRoutesRegex.forEach((value: any) => {
      if (new RegExp(value).exec(route)) {
        hide = true;
      }
    });

    return hide;
  }
}
