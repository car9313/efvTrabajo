import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {HistoryItem, NavHistoryService} from './nav-history.service';
import {BreadcrumbService} from '../ng-breadcrumb/breadcrumb.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'ng-nav-history',
  templateUrl: './ng-nav-history.component.html',
  styleUrls: ['./ng-nav-history.component.scss'],
})
export class NgNavHistoryComponent implements OnInit, OnDestroy {

  _routerSubscription: any;
  items: Array<HistoryItem>;
  showContextMenu: boolean;
  selectedUrl: string;
  left: number;
  top: number;

  constructor(private router: Router, private navHistoryService: NavHistoryService, private breadcrumbService: BreadcrumbService) {
    this.showContextMenu = false;
  }

  ngOnInit() {
    this.items = [];
    this._routerSubscription = this.router.events.pipe(filter(event => {
      return event instanceof NavigationEnd;
    }))
      .subscribe((navigationEnd: NavigationEnd) => {
        const url = navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url;
        this.navHistoryService.add({url: url, title: this.friendlyName(url)});
        this.items = this.navHistoryService.historyItems;
      });
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url).then();
  }

  friendlyName(url: string): string {

    if (url.startsWith('/admin/audits/view/')) {
      return 'Detalles de evento';
    } else {
      return !url ? '' : this.breadcrumbService.getFriendlyNameForRoute(url, false);
    }
  }

  remove(e, url: string) {
    e.stopPropagation();
    this.navHistoryService.remove(url);
    this.items = this.navHistoryService.historyItems;
    e.preventDefault();
  }

  contextmenu(e, url: string) {
    e.preventDefault();
    this.left = e.target.offsetLeft;
    this.top = e.target.clientHeight + 4;
    this.selectedUrl = url;
    this.showContextMenu = true;
    document.addEventListener('click', (ev) => {
      this.showContextMenu = false;
    }, {once: true});
  }

  contextRemove(e, url: string) {
    e.preventDefault();
    this.showContextMenu = false;
    this.navHistoryService.remove(url);
    this.items = this.navHistoryService.historyItems;
  }

  contextAll(e) {
    e.preventDefault();
    this.showContextMenu = false;
    this.navHistoryService.removeAll();
    this.items = this.navHistoryService.historyItems;
  }

  contextOther(e, url: string) {
    e.preventDefault();
    this.showContextMenu = false;
    this.navHistoryService.removeOther(url);
    this.items = this.navHistoryService.historyItems;
  }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

}
