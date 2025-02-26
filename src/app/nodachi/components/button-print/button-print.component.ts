import {Component, Input, OnInit} from '@angular/core';

import {PrintComponent} from '@app/nodachi/components/print/print.component';
import {ServiceLocator} from '../../services/locator.service';
import {ScDialogService} from '@app/nodachi/components/ng-dialog/sc-dialog.service';
import {PrintService} from '@app/nodachi/components/button-print/print.service';
import {ICustomHeader} from '@app/nodachi/interfaces/icustom-header';


@Component({
  selector: 'app-button-print',
  templateUrl: './button-print.component.html',
  styleUrls: ['./button-print.component.scss']
})
export class ButtonPrintComponent implements OnInit {
  @Input() body: any;
  @Input() headers: any;
  @Input() headersExcel: ICustomHeader[];
  @Input() title: string;
  printTitle: string;

  constructor(public printService: PrintService) {
    this.printTitle = '';
  }

  ngOnInit() {
  }

  onPrint(formato: string) {
    this.printTitle = this.printTitle || this.title;
    const dialogRef = ServiceLocator.get<ScDialogService>(ScDialogService).open(
      PrintComponent,
      {
        width: '600px',
        hasBackdrop: true,
        panelClass: ['modal-content', 'rounded-2'],
        data: {title: this.printTitle},
      }
    );
    dialogRef.afterClosed().subscribe(result => {;
      if (result.action) {
        this.printTitle = result.title;
        if (formato === 'pdf') {
          this.printService.generatePdfUI(this.headers, this.body, this.printTitle);
        } else {
          this.printService.generateExcelUI(this.headersExcel, this.body, this.printTitle);
        }
      }
    });
  }
}
