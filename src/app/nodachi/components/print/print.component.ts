import {Component, Inject, OnInit, Optional} from '@angular/core';
import {ScDialogRef} from '@app/nodachi/components/ng-dialog/sc-dialog-ref';
import {DASH_MODAl_DATA} from '@app/nodachi/components/ng-dialog/sc-dialog.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
})
export class PrintComponent implements OnInit {

  title: string;

  constructor(public dialogRef: ScDialogRef<PrintComponent>,
              @Optional() @Inject(DASH_MODAl_DATA) public data: any) {
  }

  ngOnInit() {
    this.title = this.data.title;
  }

  onAction(action) {
    this.dialogRef.close({action: action, title: this.title});
  }

}
