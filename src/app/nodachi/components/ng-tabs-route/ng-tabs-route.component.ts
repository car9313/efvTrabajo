import {Component, Input} from '@angular/core';
import {TabRoute} from '../../models/tab-route';

@Component({
  selector: 'ng-tabs-route',
  templateUrl: './ng-tabs-route.component.html',
})
export class NgTabsRouteComponent {

  @Input() tabs: Array<TabRoute>;
  transitioning: boolean;
  open = false;

  constructor() {
    this.tabs = [];
    this.transitioning = false;
  }

  toggleOpen() {
    this.open = !this.open;
  }
}
