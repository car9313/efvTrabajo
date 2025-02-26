import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'ng-modal',
  template: ` <div
    [id]="id"
    class="modal fade {{ action }}"
    tabindex="-1"
    role="dialog"
    [attr.aria-labelledby]="label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-{{ size }}" role="document">
      <div class="modal-content">
        <div class="modal-header" [ngClass]="showHeader ? '':'d-none'">
          <h5 class="modal-title" id="{{ label }}">{{ tabTitle }}</h5>
          <button
            type="button"
            class="close"
            aria-label="Cerrar"
            (click)="closeModal()"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  </div>`,
})
export class NgModalComponent implements AfterViewInit {
  @Input() action: string;
  @Input() tabTitle: string;
  @Input() size: string;
  @Input() showHeader: boolean;

  // tslint:disable-next-line:no-output-native
  @Output() close: EventEmitter<any>;

  label: string;
  id: string;

  constructor() {
    this.action = 'add';
    this.tabTitle = 'Modal';
    this.size = 'lg';
    this.label = 'ngModalLabel' + nextId;
    this.id = 'ngModal' + nextId++;
    this.close = new EventEmitter<any>();
    this.showHeader = true;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('#' + this.id).on('hidden.bs.modal', (e) => {
        this.close.emit(e);
      });
    }, 0);
  }

  closeModal(): void {
    $('#' + this.id).modal('hide');
  }
}
