import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Components
import { NGPaginationComponent } from './ng-pagination/ng-pagination.component';
import { NgChoosenComponent } from './ng-choosen2/ng-choosen.component';
import { NgPerPageComponent } from './ng-perpage/ng-perpage.component';
import { NgTableComponent } from './ng-table/ng-table.component';
import { NgSearchBarComponent } from './ng-search-bar/ng-search-bar.component';
import { NgFbuttonComponent } from './ng-fbutton/ng-fbutton.component';
import { NgCollapseItemComponent } from './ng-collapse-item/ng-collapse.component';
import { NgTabComponent, NgTabsComponent } from './ng-tabs/ng-tabs.component';
import { NgModalComponent } from './ng-modal/ng-modal.component';
import { NgOlMapComponent } from './ng-ol-map/ng-ol-map.component';
import { DatePickerComponent } from './ng-datepicker/ng-datepicker.component';
import { MultiselectDropdownComponent } from './ng-choosen/dropdown.component';
import { MultiSelectSearchFilter } from './ng-choosen/search-filter.pipe';
import { ChartsModule } from 'ng2-charts';
import { Ng2FileTypeDirective } from './ng-filtetype/ng2-filetype.directive';
import { FileValueAccessorDirective } from './ng-filtetype/file-control-value-accessor';
import { NgCollapseComponent } from './ng-collapse/ng-collapse.component';
import { NgFileComponent } from './ng-file/ng-file.component';
import { NgSummernoteComponent } from './ng-summernote/ng-summernote.component';
import { NgTabsRouteComponent } from './ng-tabs-route/ng-tabs-route.component';
import { NgPersonCiDirective } from './ng-validators/ng-person-ci.directive';
import { NgNumberDirective } from './ng-validators/ng-number.directive';
import { NgMinDirective } from './ng-validators/ng-min.directive';
import {
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeIntl,
  OwlDateTimeModule,
} from './ng-datepicker/date-time';
import { NgTableInputComponent } from './ng-table-input/ng-table-input.component';
import { OwlMomentDateTimeModule } from './ng-datepicker/date-time/adapter/moment-adapter/moment-date-time.module';
import { ProgressLineComponent } from './ng-progress-line/ng-progress-line.component';
import { NgMaxDirective } from './ng-validators/ng-max.directive';
import { PortalModule } from '@angular/cdk/portal';

import { NgInlineEditComponent } from './ng-inline-edit/ng-inline-edit.component';
// tslint:disable:max-line-length
import { FilterByPipe } from '../directive/filterBy.pipe';
import { FilterEqualPipe } from '../directive/filterEqual.pipe';
import { NgVarDirective } from './ng-var/ng-var.directive';
import { NgOlMapInputComponent } from './ng-ol-map-input/ng-ol-map-input.component';
import { NgCheckValidatorDirective } from './ng-validators/ng-check.directive';
import {
  EqualsPasswordValidatorDirective,
  PasswordStrengthDirective,
} from '../../admin/user/user-add/password-strength.directive';
import { DynDirective } from '../directive/dyn.directive';
import {
  DefaultIntl,
  MY_MOMENT_FORMATS,
} from '@app/nodachi/components/default-intl';
import { EscapeHtmlPipe } from '@app/nodachi/directive/keep-html.pipe';
import { CanAccessDirective } from '@app/nodachi/directive/can-access.directive';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { NullOrUndefinedPipe } from '@app/nodachi/directive/null-or-undefined.pipe';
import { SearchByPipe } from '@app/nodachi/directive/searchBy.pipe';
import { ScDialogContainerComponent } from '@app/nodachi/components/ng-dialog/sc-dialog-container/sc-dialog-container.component';
import { NgStepperComponent } from '@app/nodachi/components/ng-stepper/ng-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgCharjsComponent } from '@app/nodachi/components/ng-charjs/ng-charjs.component';
import { NgSingleValueComponent } from './ng-single-value/ng-single-value.component';
import { GridsterModule } from 'angular-gridster2';
import { BooleanTextPipe } from '@app/nodachi/directive/boolean-text.pipe';
import { EscapeUrlPipe } from '@app/nodachi/directive/keep-url.pipe';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { CompareToDirective } from '../directive/compare-to.directive';
import { ButtonPrintComponent } from './button-print/button-print.component';



// Services
// tslint:enable:max-line-length

@NgModule({
  declarations: [
    NGPaginationComponent,
    NgChoosenComponent,
    NgFbuttonComponent,
    NgPerPageComponent,
    NgSearchBarComponent,
    NgTableComponent,
    NgTabsComponent,
    NgTabComponent,
    NgModalComponent,
    NgCollapseItemComponent,
    NgOlMapComponent,
    NgOlMapInputComponent,
    DatePickerComponent,
    MultiselectDropdownComponent,
    MultiSelectSearchFilter,
    Ng2FileTypeDirective,
    FileValueAccessorDirective,
    NgFileComponent,
    NgSummernoteComponent,
    NgTabsRouteComponent,
    NgPersonCiDirective,
    NgNumberDirective,
    NgMinDirective,
    NgMaxDirective,
    NgCollapseComponent,
    NgTableInputComponent,
    ProgressLineComponent,
    NgInlineEditComponent,
    NgVarDirective,
    ProgressLineComponent,
    FilterByPipe,
    FilterEqualPipe,
    NullOrUndefinedPipe,
    NgCheckValidatorDirective,
    PasswordStrengthDirective,
    EqualsPasswordValidatorDirective,
    DynDirective,
    EscapeHtmlPipe,
    EscapeUrlPipe,
    CanAccessDirective,
    SearchByPipe,
    ScDialogContainerComponent,
    NgStepperComponent,
    NgCharjsComponent,
    NgSingleValueComponent,
    BooleanTextPipe,
    ListNotificationComponent,
    CompareToDirective,
    ButtonPrintComponent,
  ],
  exports: [
    OwlDateTimeModule,
    // OwlMomentDateTimeModule,
    NgxPaginationModule,
    NgChoosenComponent,
    NGPaginationComponent,
    NgFbuttonComponent,
    NgPerPageComponent,
    NgSearchBarComponent,
    NgTableComponent,
    NgTabsComponent,
    NgTabComponent,
    NgModalComponent,
    NgOlMapComponent,
    NgOlMapInputComponent,
    DatePickerComponent,
    NgCollapseItemComponent,
    NgCollapseComponent,
    MultiselectDropdownComponent,
    MultiSelectSearchFilter,
    ChartsModule,
    Ng2FileTypeDirective,
    FileValueAccessorDirective,
    NgFileComponent,
    NgSummernoteComponent,
    NgTabsRouteComponent,
    NgPersonCiDirective,
    NgNumberDirective,
    NgMinDirective,
    NgMaxDirective,
    NgTableInputComponent,
    ProgressLineComponent,
    NgInlineEditComponent,
    NgVarDirective,
    ProgressLineComponent,
    FilterByPipe,
    FilterEqualPipe,
    NullOrUndefinedPipe,
    NgCheckValidatorDirective,
    PasswordStrengthDirective,
    EqualsPasswordValidatorDirective,
    DynDirective,
    EscapeHtmlPipe,
    EscapeUrlPipe,
    CanAccessDirective,
    PrettyJsonModule,
    NgStepperComponent,
    SearchByPipe,
    ScDialogContainerComponent,
    NgCharjsComponent,
    BooleanTextPipe,
    CompareToDirective,
    ButtonPrintComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule,
    ReactiveFormsModule,
    ChartsModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    PortalModule,
    PrettyJsonModule,
    CdkStepperModule,
    GridsterModule,
  ],
  providers: [
    { provide: OwlDateTimeIntl, useClass: DefaultIntl },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
  ],
  entryComponents: [ScDialogContainerComponent],
})
export class NoComponentsModule { }
