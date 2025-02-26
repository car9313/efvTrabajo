import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SaicoLayoutService } from './saico-layout.service';
import { Subject, Subscription } from 'rxjs';
import { LoginService } from '@app/admin';

@Component({
  selector: 'nodachi-app',
  templateUrl: './saico-layout.component.html',
  styleUrls: ['./saico-layout.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0, 0, 0)',
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(-100%, 0, 0)',
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class SaicoLayoutComponent implements OnDestroy {
  menuState: string;
  private _adminSubscribtion: Subscription;

  constructor(public adminService: SaicoLayoutService) {
    this.menuState = 'in';
    this._adminSubscribtion = this.adminService
      .getObserver()
      .subscribe((next) => {
        this.menuState = next.menuState;
      });
  }

  ngOnDestroy(): void {
    this._adminSubscribtion.unsubscribe();
  }
}
