import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {BreadcrumbService} from './breadcrumb.service';


@Component({
  selector: 'ng-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class NgBreadCrumbComponent implements OnInit, OnChanges, OnDestroy {
  @Input() useBootstrap: boolean;
  @Input() prefix: string;

  public _urls: string[];
  public _routerSubscription: any;

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService) {
    this.useBootstrap = true;
    this.prefix = '';
  }

  ngOnInit(): void {
    this._urls = [];

    if (this.prefix.length > 0) {
      this._urls.unshift(this.prefix);
    }
    this.generateBreadcrumbTrail(this.router.url);
    this._routerSubscription = this.router.events.subscribe((navigationEnd: Event) => {

      if (navigationEnd instanceof NavigationEnd) {
        this._urls.length = 0; // Fastest way to clear out array
        this.generateBreadcrumbTrail(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
      }
    });
  }

  ngOnChanges(changes: any): void {
    if (!this._urls) {
      return;
    }

    this._urls.length = 0;
    this.generateBreadcrumbTrail(this.router.url);
  }

  /**
   * Metodo recurisvo para crear los breadcumbs, fue modificado con la primera condicional del metodo
   * @param url
   */
  generateBreadcrumbTrail(url: string): void {
    if (url.endsWith('/edit') || url.endsWith('/view') || url.endsWith('/list')) {
      this.breadcrumbService.hideRoute(url);
    }

    if (!this.breadcrumbService.isRouteHidden(url)) {
      // Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
      this._urls.unshift(url);
    }

    if (url.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/'))); // Find last '/' and add everything before it as a parent route
    } else if (this.prefix.length > 0) {
      this._urls.unshift(this.prefix);
    }
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url).then();
  }

  friendlyName(url: string): string {
    return !url ? '' : this.breadcrumbService.getFriendlyNameForRoute(url);
  }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }
}
