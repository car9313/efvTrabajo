import {Component} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'ng-collapse',
  templateUrl: './ng-collapse.component.html',
  styleUrls: ['./ng-collapse.component.scss']
})
export class NgCollapseComponent {
  id: string;
  collapsed: boolean;
  collapsing: boolean;

  constructor() {
    this.id = 'ngCollapse' + nextId++;
    this.collapsed = false;
    this.collapsing = false;
  }

  collapse(): void {
    this.collapsed = !this.collapsed;
  }
}
