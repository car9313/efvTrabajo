import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {HomeComponent} from '../home/home.component';
// Modules
import {NgCharjsComponent, NgSingleValueComponent, NgTableComponent, NoComponentsModule} from '../nodachi';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {OverlayModule} from '@angular/cdk/overlay';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {PromptComponent} from '@app/nodachi/components/prompt/prompt.component';
import {PrintComponent} from '@app/nodachi/components/print/print.component';
import {MapModalComponent} from '@app/nodachi/components/map-modal/map-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    PromptComponent,
    PrintComponent,
    MapModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NoComponentsModule,
    DragDropModule,
    PortalModule,
    OverlayModule,
    CdkStepperModule,
  ],
  exports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    NoComponentsModule,
    CdkStepperModule,
    HomeComponent,
    PromptComponent,
    PrintComponent,
    MapModalComponent,
  ],
  providers: [],
  entryComponents: [ NgTableComponent,
    NgCharjsComponent, NgSingleValueComponent, PromptComponent, PrintComponent,
    MapModalComponent],
})

export class SystemModule {
}
