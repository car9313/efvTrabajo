import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ProgressLineService, SpinService } from './nodachi';
import { LoginService, UserService } from '@app/admin';
import { SecuritySettingsService } from '@app/admin/security-settings/security-settings.service';
import { Compiler } from '@angular/core';
@Component({
  selector: 'saico-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  // Sets initial value to true to show loading spinner on first load
  color: string;
  height: string;
  events: Subscription;
  timeSession: number;
  userActivity: null | ReturnType<typeof setTimeout> = null;
  userInactive: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private _compiler: Compiler,
    private userService: UserService,
    public securitySettingsService: SecuritySettingsService,
    private slimLoadingBarService: ProgressLineService,
    private spin: SpinService,
    private loginService: LoginService
  ) {
    this.color = '#77b6ff';
    this.height = '3px';
    this.timeSession = 900000;
  }

  ngOnInit(): void {
    this.securitySettingsService.getSettings().subscribe((settings) => {
      this.timeSession = settings.session_expire_time * 60 * 1000;
    });
    this.setTimeouta();
    this.userInactive.subscribe(() => {
      this.logaut();
    });
    this.events = this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.slimLoadingBarService.start();
    }
    if (event instanceof NavigationEnd) {
      this.slimLoadingBarService.complete();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.slimLoadingBarService.stop();
    }
    if (event instanceof NavigationError) {
      this.slimLoadingBarService.stop();
    }
    if (
      event instanceof
      RouteConfigLoadStart /* && event.route.path !== '/login'*/
    ) {
      this.slimLoadingBarService.start();
      this.spin.startLoading();
    }
    if (
      event instanceof RouteConfigLoadEnd /* && event.route.path !== '/login'*/
    ) {
      this.slimLoadingBarService.complete();
      this.spin.stopLoading();
    }
  }

  setTimeouta() {
    if (localStorage.getItem('user_name') !== null) {
      this.userActivity = setTimeout(() => {
        this.userInactive.next(undefined);
        this.logaut();
        this.router.navigate(['/login']);
      }, this.timeSession);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  @HostListener('window:unload', ['$event'])
  beforeunloadHandler($event) {
    this.logaut();
  }

  /*   @HostListener('window:mousemove', ['$event'])
    refreshUserState($event) {
      if (localStorage.getItem('user_name') !== null) {
        clearTimeout(this.userActivity);
        setTimeout(() => {
          this.setTimeouta();
        }, 0);
      }
    }

    @HostListener('document:visibilitychange', ['$event'])
    visibilitychange($event) {
      this.setStoreVisibility();
      setTimeout(() => {
        this.setIfNoVisibility();
      }, 0);
    } */

  logaut() {
    this.loginService.logout().subscribe((resp) => {
      // this._compiler.clearCache();
      localStorage.clear();
    });
  }

  setIfNoVisibility() {
    if (localStorage.getItem('anyvisibility') === '1') {
      this.setTimeouta();
    }
  }

  setStoreVisibility() {
    if (document.hidden) {
      localStorage.setItem('anyvisibility', '1');
      clearTimeout(this.userActivity);
    } else {
      localStorage.setItem('anyvisibility', '0');
    }
  }

  ngOnDestroy(): void {
    this.events.unsubscribe();
  }
}
