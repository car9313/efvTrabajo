import {Component, Input, OnInit} from '@angular/core';
import {CdkStep, CdkStepper} from '@angular/cdk/stepper';

@Component({
  selector: 'ng-stepper',
  templateUrl: './ng-stepper.component.html',
  providers: [{provide: CdkStepper, useExisting: NgStepperComponent}],
})
export class NgStepperComponent extends CdkStepper {
  @Input() selectedIndex: number;
}
