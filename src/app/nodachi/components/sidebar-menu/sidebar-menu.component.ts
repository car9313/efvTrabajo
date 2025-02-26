import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config.services';
import {isNullOrUndefined, Utility} from '../../utils/utility';
import {SaicoLayoutService} from '../../../admin/saico-layout/saico-layout.service';
import {Event, NavigationEnd, Router} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {NestedTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, combineLatest, ConnectableObservable, merge, Observable, of, Subscription} from 'rxjs';
import {filter, map, publishReplay} from 'rxjs/operators';

export class MenuNode {
  childrens?: MenuNode[];
  link: string;
  name: string;
  data?: any;
  parents?: MenuNode[];
}

export class MenuDataSource<T> extends DataSource<T> {
  private _data = new BehaviorSubject<T[]>([]);

  get data() {
    return this._data.value;
  }

  set data(value: T[]) {
    this._data.next(value);
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return merge(...[collectionViewer.viewChange, this._data])
      .pipe(map(() => {
        return this.data;
      }));

  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}

@Component({
  selector: 'sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  // styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit, OnDestroy {

  links: Array<any>;
  events: Observable<Event>;
  eventSubscription: Subscription;
  search = '';
  nestedTreeControl: NestedTreeControl<MenuNode>;
  nestedDataSource: MenuDataSource<MenuNode>;
  url: string;
  mapNav: Map<string, Array<MenuNode>>;

  constructor(private config: ConfigService,
              private adminService: SaicoLayoutService,
              private router: Router,
              private utilityService: Utility,
              private breakpointObserver: BreakpointObserver) {

    this.events = this.router.events.pipe(filter(e => {
      return e instanceof NavigationEnd;
    }));
    this.events.subscribe((navigationEnd: NavigationEnd) => {
      if (!this.breakpointObserver.isMatched(Breakpoints.Web)) {
        this.adminService.closeMenu();
      }
      this.url = navigationEnd.urlAfterRedirects || navigationEnd.url;
    });
    this.nestedTreeControl = new NestedTreeControl<MenuNode>(this._getChildren);
    this.nestedDataSource = new MenuDataSource<MenuNode>();
  }

  ngOnInit() {
    this.nestedDataSource.data = this.currentUserlinks();
    this.getCurrentNode(this.mapNav).subscribe((nodes: Array<MenuNode>) => {
      this.nestedTreeControl.collapseAll();
      nodes.forEach(value => {
        this.nestedTreeControl.expand(value);
      });
    });
  }

  toggleMenu(): void {
    this.adminService.toggleMenu();
  }


  private defaultLinks(): Array<any> {
    return this.config.getConst('menuLinks') || [];
  }

  private currentUserlinks(): Array<any> {
    const links = this.defaultLinks();
    const perms = this.utilityService.currentUserPerms();
    const output: Array<any> = [];
    const navMap = new Map<string, Array<MenuNode>>();
    for (const link of links) {
      const item = this.checkLinksAccess(link, perms, [], navMap);
      if (!isNullOrUndefined(item)) {
        output.push(item);
      }
    }
    this.mapNav = navMap;
    return output;
  }

  private checkLinksAccess(link: any, perms: Array<any>, parents: Array<any>, navMap: Map<string, Array<MenuNode>>): MenuNode {
    const search = this.search.toLowerCase().trim();
    const child: MenuNode = {link: link.link, name: link.name};

    child.childrens = [];
    const nodes = [child, ...parents];
    child.parents = nodes;
    const cleanedUrl = link.link.replace(/\/$/, '');

    navMap.set(cleanedUrl, nodes);

    if (!isNullOrUndefined(link.childrens) && Array.isArray(link.childrens)) {
      for (const l of link.childrens) {
        const item = this.checkLinksAccess(l, perms, child.parents, navMap);
        const name: string = l.name.toLowerCase();
        if (!isNullOrUndefined(item)) {
          if ((!isNullOrUndefined(l.childrens) && Array.isArray(l.childrens)) || search === '' || name.indexOf(search) >= 0) {
            child.childrens.push(item);
          }
        }
      }
    } else {
      if (!isNullOrUndefined(link.data) && !this.canAccess(link.data[0], perms)) {
        return null;
      }
      return child;
    }
    return child.childrens.length > 0 ? child : null;
  }

  private canAccess(permission: any, perms: Array<any>): boolean {
    if (this.utilityService.isAdmin() && !isNullOrUndefined(permission)
      && permission.hasOwnProperty('resource') && permission.resource === 'admin') {
      return true;
    }
    return perms.some(perm => perm.resource === permission.resource && perm.actions && perm.actions.length > 0);
  }

  private _getChildren = (node: MenuNode) => {
    return of(node.childrens);
  }

  hasNestedChild = (_: number, nodeData: MenuNode) => {
    return nodeData.childrens && nodeData.childrens.length > 0;
  }

  ngOnDestroy(): void {
    if (!isNullOrUndefined(this.eventSubscription)) {
      this.eventSubscription.unsubscribe();
    }
  }

  toggleNode(event, node: MenuNode) {
    if (!this.nestedTreeControl.isExpanded(node)) {
      this.nestedTreeControl.collapseAll();
      node.parents.forEach(value => {
        this.nestedTreeControl.expand(value);
      });
    } else {
      this.nestedTreeControl.collapse(node);
    }
    event.stopPropagation();
  }

  Search() {
    const data = this.currentUserlinks();
    this.nestedDataSource.data = data;
    if (this.search && this.search.length > 0) {
      data.forEach(value => {
        this.nestedTreeControl.expandDescendants(value);
      });
    } else {
      this.nestedTreeControl.collapseAll();
    }
  }

  private getCurrentNode(nodes): Observable<any> {
    const currentNode = combineLatest(
      of(nodes),
      of(this.url))
      .pipe(map(([navMap, url]) => {
          const u = url.replace(/\/list$/, '');

          return navMap.has(url) ? navMap.get(url) : navMap.has(u) ? navMap.get(u) : this.getParentUrl(navMap, url, u);
        }),
        publishReplay(1));
    (currentNode as ConnectableObservable<any>).connect();
    return currentNode;
  }

  private getParentUrl(navMap, url: string, u: string) {
    const keys: IterableIterator<any> = navMap.keys();
    const length = navMap.size;
    let i = 0;
    while (i < length) {
      const href = keys.next().value;
      if (url.indexOf(href) !== -1) {
        return navMap.has(href) ? navMap.get(href) : [];
      } else {
        if (u.indexOf(href) !== -1) {
          return navMap.has(href) ? navMap.get(href) : [];
        }
      }
      i++;
    }
    return [];
  }
}
