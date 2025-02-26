import {AfterViewInit, Component, Inject, OnInit, Optional} from '@angular/core';
import {ScDialogRef} from '@app/nodachi/components/ng-dialog/sc-dialog-ref';
import {DASH_MODAl_DATA} from '@app/nodachi/components/ng-dialog/sc-dialog.service';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
})
export class MapModalComponent {

  features: Array<any>;

  constructor(public dialogRef: ScDialogRef<MapModalComponent>,
              @Optional() @Inject(DASH_MODAl_DATA) public data: any) {
  }

  readyMap(map) {
    this.features = this.data.features;
  }
}
