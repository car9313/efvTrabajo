import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../../admin/login/login.service';
import { SaicoLayoutService } from '../../../admin/saico-layout/saico-layout.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ThemeService } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { StyleManager } from '@app/nodachi/services/style-manager';
import { UserService } from '@app/admin';
import { WorkstationDesc } from '@app/admin/user/workstationdesc';

interface SaicoTheme {
  name: string;
  isDefault?: boolean;
}

@Component({
  selector: 'banner-title',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() help: string;
  user_name: string;
  private _adminSubscribtion: Subscription;
  private _workStatationSubscribtion: Subscription;
  private _helpSubscribtion: Subscription;
  public _routerSubscription: any;
  imgList: Array<string>;
  img: string;
  dark: boolean;
  currentTheme: string;
  storageKey: string;
  themes: Array<SaicoTheme>;
  myFileName = 'manual-de-usuario.pdf';
  fileUrlPDF = 'assets/Docs/manual-de-usuario-bomberos.pdf';
  workStationsSelect: WorkstationDesc;
  versionApi: string = '';
  versionUI: string = '';
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private themeService: ThemeService,
    public styleManager: StyleManager,
    private adminService: SaicoLayoutService
  ) {
    this.user_name = localStorage.getItem('user_name');
    this.title = '';
    this.help = '';
    this.imgList = [
      'extincion',
      'prevencion',
      'cuadro',
      'informacion-analisis',
      'puesto-mando',
      'tecnologia',
      'transporte',
      'atm',
    ];
    this.img = null;
    this.storageKey = 'saico-current-theme';
    this.themes = [{ name: 'light', isDefault: true }, { name: 'dark' }];
    this.currentTheme = localStorage.getItem(this.storageKey) || 'light';
    this.dark = this.currentTheme === 'dark';
    this.changeMode(this.currentTheme);
  }

  ngOnInit(): void {
    this.workStationsSelect = JSON.parse(localStorage.getItem('user_loggued'));
    this._adminSubscribtion = this.adminService
      .getTitle()
      .subscribe((title) => {
        this.title = title;
      });
    this._workStatationSubscribtion = this.adminService
      .getWorkStation()
      .subscribe((work_station) => {
        this.workStationsSelect = work_station;
      });
    this._helpSubscribtion = this.adminService.getHelp().subscribe((help) => {
      this.help = help;
    });
    this.img = this.getImgModules(this.router.url);
    this._routerSubscription = this.router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        })
      )
      .subscribe((navigationEnd: NavigationEnd) => {
        const url = navigationEnd.urlAfterRedirects
          ? navigationEnd.urlAfterRedirects
          : navigationEnd.url;
        this.img = this.getImgModules(url);
      });
  }

  logout() {
    const prueba = this.loginService.logout().subscribe();
  }
  getVersion() {
    this.loginService.getVersion().subscribe((res) => {
      this.versionApi = res;
      this.versionUI = '1.0';
    });
  }

  ngOnDestroy(): void {
    this._workStatationSubscribtion.unsubscribe();
    this._adminSubscribtion.unsubscribe();
    this._routerSubscription.unsubscribe();
    this._helpSubscribtion.unsubscribe();
  }

  toggleMenu(): void {
    this.adminService.toggleMenu();
  }

  getImgModules(url: string) {
    return this.imgList.find((value) => {
      return !!url.match(`^/${value}/`);
    });
  }

  toggleTheme() {
    const theme = this.dark ? 'light' : 'dark';
    if (this.changeMode(theme)) {
      this.dark = !this.dark;
    }
  }
  changeMode(themeName: string) {
    const theme = this.themes.find(
      (currentTheme) => currentTheme.name === themeName
    );
    if (!theme) {
      return false;
    }
    if (theme) {
      if (theme.isDefault) {
        this.styleManager.removeStyle('theme');
      } else {
        this.styleManager.setStyle('theme', `assets/${theme.name}.css`);
      }
      this.changeCharJsTheme(theme);
      this.currentTheme = theme.name;
      localStorage.setItem(this.storageKey, this.currentTheme);
    }
    return true;
  }

  public changeCharJsTheme(value) {
    let overrides: ChartOptions;
    if (value === 'dark') {
      overrides = {
        legend: {
          labels: { fontColor: 'white' },
        },
        title: {
          fontColor: 'white',
        },
        scales: {
          xAxes: [
            {
              ticks: { fontColor: 'white' },
              gridLines: { color: 'rgba(255,255,255,0.1)' },
              scaleLabel: { fontColor: 'white' },
            },
          ],
          yAxes: [
            {
              ticks: { fontColor: 'white' },
              gridLines: { color: 'rgba(255,255,255,0.1)' },
              scaleLabel: { fontColor: 'white' },
            },
          ],
        },
      };
    } else {
      overrides = {};
    }
    this.themeService.setColorschemesOptions(overrides);
  }
}
