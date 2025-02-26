import {AfterContentInit, Component, ContentChildren, HostBinding, Input, QueryList} from '@angular/core';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {ActivatedRoute} from '@angular/router';

let nextId = 0;

export interface ITabComponent {
  onTabInit();
}

interface INgTabComponent {
  tabTitle: string;
  active: boolean;
  tabId: string;

  onTabInit();
}

@Component({
  selector: 'ng-tab',
  template: `
    <ng-content></ng-content>`
})
export class NgTabComponent implements INgTabComponent {

  @Input() tabTitle: string;
  @Input() active: boolean;

  @Input()
  set tabId(value) {
    if (isNullOrUndefined(value)) {
      this._tabId = `ng-tab-${nextId++}`;
      this.a_id = this._tabId;
      this.a_labelledby = this._tabId + '-link';
    } else {
      this._tabId = value;
      this.a_id = value;
      this.a_labelledby = value + '-link';
    }
  }

  get tabId() {
    return this._tabId;
  }

  private _tabId: string;

  @HostBinding('attr.role') a_role;
  @HostBinding('class') cssClass;
  @HostBinding('id') a_id;
  @HostBinding('attr.aria-labelledby') a_labelledby;

  @ContentChildren('tabitem') childrens: QueryList<ITabComponent>;

  constructor() {
    this.tabTitle = '';
    this.active = false;
    this.tabId = `ng-tab-${nextId++}`;
    this.a_role = 'tabpanel';
    this.cssClass = 'tab-pane fade';
    this.a_id = this.tabId;
    this.a_labelledby = this.tabId + '-link';
  }

  onTabInit() {
    if (this.childrens.length > 0) {
      this.childrens.first.onTabInit();
    }
  }
}

@Component({
  selector: 'ng-tabs',
  template: `
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs" role="tablist">
          <li *ngFor="let tab of tabs" (click)="selectTab(tab,$event)" role="presentation" class="nav-item">
            <a id="{{ tab.tabId }}-link"
               [href]="'#'+tab.tabId"
               class="nav-link"
               role="tab"
               [attr.aria-controls]="tab.tabId">{{ tab.tabTitle }}</a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="tab-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>`
})
export class NgTabsComponent implements AfterContentInit {

  @ContentChildren(NgTabComponent) tabs: QueryList<NgTabComponent>;

  constructor(private route: ActivatedRoute) {
  }

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    this.route.fragment.subscribe(fragment => {
      if (!isNullOrUndefined(fragment)) {
        const ngTabComponent = this.tabs.find((tab) => {
          return tab.tabId === fragment;
        });
        if (!isNullOrUndefined(ngTabComponent)) {
          this.selectTab(ngTabComponent);
        }
      } else {
        // if there is no active tab set, activate the first
        this.selectTab(activeTabs.length === 0 ? this.tabs.first : activeTabs[0]);
      }
    });
  }

  selectTab(tab: NgTabComponent, e: any = null) {
    if (tab.active) {
      $(e.target).closest('ul').toggleClass('open');
      e.preventDefault();
    } else {

      if (!isNullOrUndefined(tab)) {
        // deactivate all tabs
        this.tabs.toArray().forEach(tabItem => tabItem.active = false);
        if (e) {
          $(e.target).closest('ul').toggleClass('open');
        }
        if (e !== null) {
          $(e.target).tab('show');
          e.preventDefault();
        } else {
          setTimeout(() => {
            $('#' + tab.tabId + '-link').tab('show');
          }, 0);
        }

        // activate the tab the user has clicked on.
        tab.active = true;
        tab.onTabInit();
      }
    }
  }

}
