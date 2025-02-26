import {Component, Inject, OnInit, Optional} from '@angular/core';
import {ScDialogRef} from '@app/nodachi/components/ng-dialog/sc-dialog-ref';
import {DASH_MODAl_DATA} from '@app/nodachi/components/ng-dialog/sc-dialog.service';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
})
export class PromptComponent implements OnInit {

  title: string;
  message: string;

  constructor(public dialogRef: ScDialogRef<PromptComponent>,
              @Optional() @Inject(DASH_MODAl_DATA) public data: any) {
  }

  ngOnInit() {
    this.title = this.data.title;
    this.message = this.data.message;
  }

  onAction(action) {
    this.dialogRef.close(action);
  }

}
