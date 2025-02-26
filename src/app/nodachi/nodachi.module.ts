import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { CdkTreeModule } from '@angular/cdk/tree';
// Routes Guard
import { LoggedInGuard, LoginGuard } from './services/logged-in.guard';

import { PageNoAcessComponent } from './components/403/no-access.component';
import { PageNotFoundComponent } from './components/404/not-found.component';
import { SaicoLayoutComponent } from '../admin/saico-layout/saico-layout.component';
import { LoginFormComponent } from '../admin/login/login-form.component';
import { BannerComponent } from './components/banner/banner.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgBreadCrumbComponent } from './components/ng-breadcrumb/breadcrumb.component';
import { NgSpinComponent } from './components/ng-spin/ng-spin.component';
// Services
import { ProgressLineService } from './components/ng-progress-line/progress-line.service';
import { MapService } from './services/map.service';
import { BreadcrumbService } from './components/ng-breadcrumb/breadcrumb.service';
import { SpinService } from './components/ng-spin/spin.service';
import { ConfigService, initConfig } from './services/config.services';
import { LoginService } from '../admin/login/login.service';
import { UserService } from '../admin/user/user.service';

import { OpenLSServerService } from './services/open-lsserver.service';
import { Utility } from './utils/utility';
import {
  MunicipalityService,
  ProvService,
  ThemedService,
} from './common-services';
import { NgNavHistoryComponent } from './components/ng-nav-history/ng-nav-history.component';
import { ImagePlaceholderService } from '@app/nodachi/services/image-placeholder.service';
import { NotificationsComponent } from '@app/nodachi/components/notifications/notifications.component';
import { NotificationService } from '@app/nodachi/services/notification.service';

import { NotificationsConfigService } from '@app/nodachi/common-services/admin/notifications_config.service';
import { FooterComponent } from '@app/nodachi/components/footer/footer.component';
import { CompareToService } from './services/compare-to.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LayoutModule,
    CdkTreeModule,
  ],
  declarations: [
    PageNoAcessComponent,
    PageNotFoundComponent,
    SaicoLayoutComponent,
    LoginFormComponent,
    BannerComponent,
    FooterComponent,
    SidebarMenuComponent,
    NgBreadCrumbComponent,
    NgSpinComponent,
    NgNavHistoryComponent,
    NotificationsComponent,
  ],
  providers: [],
  exports: [
    PageNoAcessComponent,
    PageNotFoundComponent,
    SaicoLayoutComponent,
    LoginFormComponent,
    BannerComponent,
    FooterComponent,
    SidebarMenuComponent,
    NgSpinComponent,
    NgNavHistoryComponent,
    NotificationsComponent,
  ],
})
export class NodachiModule {
  constructor(@Optional() @SkipSelf() parentModule: NodachiModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NodachiModule,
      providers: [
        LoggedInGuard,
        LoginGuard,
        ConfigService,
        {
          provide: APP_INITIALIZER,
          useFactory: initConfig,
          deps: [ConfigService],
          multi: true,
        },
        ProgressLineService,
        BreadcrumbService,
        MapService,
        SpinService,
        OpenLSServerService,
        Utility,
        UserService,
        LoginService,
        ThemedService,
        ProvService,
        MunicipalityService,
        ImagePlaceholderService,
        NotificationService,
        NotificationsConfigService,
        CompareToService,
      ],
    };
  }
}
