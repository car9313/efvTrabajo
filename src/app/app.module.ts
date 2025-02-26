import {Injector, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es-CU';
import {ToastrModule} from 'ngx-toastr';
// Modules
import {NodachiModule} from './nodachi';
import {SystemModule} from './system/system.module';
// Routes
import {AppRoutingModule} from './app-routing.module';
// Services
import {ServiceLocator} from './nodachi/services/locator.service';
// Components
import {AppComponent} from './app.component';
import {AuthInterceptor} from './nodachi/services/auth-interceptor.service';
import {ChangePasswordComponent} from './admin/change-password/change-password.component';
import {ChangeExpiredPasswordComponent} from './admin/change-expired-password/change-expired-password.component';
import {Router} from '@angular/router';
import {ReloadComponent} from './system/reload.component';
import {NavigationService} from '@app/nodachi/services/navigationService';
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    ChangeExpiredPasswordComponent,
    ReloadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NodachiModule.forRoot(),
    SystemModule,
    HttpClientModule,
    ToastrModule.forRoot({
      iconClasses: {
        success: 'sc-success',
        info: 'sc-info',
        error: 'sc-error',
        warning: 'sc-warning',
      },
      timeOut: 5000,
      enableHtml: true,
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      progressBar: true,
      tapToDismiss: true,
    })
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    ,
    {provide: LOCALE_ID, useValue: 'es-CU'}
  ]
})
export class AppModule {
  constructor(private injector: Injector, private router: Router) {
    ServiceLocator.injector = injector;
    NavigationService.router = router;
  }
}
