import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';
import {ProgressLineEvent, ProgressLineEventType, ProgressLineService} from './progress-line.service';

@Component({
  selector: 'ng-progress-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ng-progress-line.component.html',
  styleUrls: ['./ng-progress-line.component.scss']
})
export class ProgressLineComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() color: string;
  @Input() height: string;
  @Input() show: boolean;
  private subject: Subscription;
  private subject2: Subscription;

  constructor(public service: ProgressLineService, private _elmRef: ElementRef, private _changeDetectorRef: ChangeDetectorRef) {
    this.color = 'firebrick';
    this.height = '3px';
    this.show = true;
  }

  ngOnInit(): void {
    this.subject = this.service.events.subscribe((event: ProgressLineEvent) => {
      if (event.type === ProgressLineEventType.COLOR) {
        this.color = event.value;
      } else if (event.type === ProgressLineEventType.HEIGHT) {
        this.height = event.value;
      } else if (event.type === ProgressLineEventType.VISIBLE) {
        this.show = event.value;
      }
    });
  }

  ngAfterViewInit(): void {
    this.subject2 = this.service.events.subscribe((event: ProgressLineEvent) => {
      this._elmRef.nativeElement.visible = event.type === ProgressLineEventType.VISIBLE ? event.value : true;
      this._changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subject.unsubscribe();
    this.subject2.unsubscribe();
  }
}
