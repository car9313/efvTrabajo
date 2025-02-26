import {Component, Input, OnInit} from '@angular/core';
import {SpinService} from './spin.service';

@Component({
  selector: 'ng-spin',
  templateUrl: './ng-spin.component.html',
  styleUrls: ['./ng-spin.component.scss']
})
export class NgSpinComponent implements OnInit {

  @Input() show: boolean;

  constructor(public service: SpinService) {
  }

  ngOnInit() {
    this.service.events.subscribe((event: boolean) => {
      this.show = event;
    });
  }
}
