import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ng-charjs',
  templateUrl: './ng-charjs.component.html',
})
export class NgCharjsComponent implements OnInit {

  @Input() datasets: Array<any>;
  @Input() labels: Array<any>;
  @Input() options: any = {
    responsive: true,
  };

  @Input() chartType: string;

  @Output() chartClick: EventEmitter<any>;
  @Output() chartHover: EventEmitter<any>;
  @HostBinding() class = 'd-block';

  constructor() {
    this.chartClick = new EventEmitter();
    this.chartHover = new EventEmitter();
    this.chartType = '';
    this.labels = [];
    this.datasets = [];
  }

  ngOnInit() {
  }

  // events
  public chartClicked(e: any): void {
    this.chartClick.emit(e);
  }

  public chartHovered(e: any): void {
    this.chartHover.emit(e);
  }

}
