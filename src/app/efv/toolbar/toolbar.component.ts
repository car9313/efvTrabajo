import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {EfvListService} from '@app/efv/efv-list.service';

export interface Prueba {
  numero_efv: string;
  estado: string;
  fecha_udp: Date;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = ['numero_fv', 'estado', 'fecha_udp'];
  dataSource = new MatTableDataSource<Prueba>([]);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private efvListService: EfvListService) {
  }

  ngOnInit() {
    this.getListEfvPendientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getListEfvPendientes() {
    this.efvListService.getPendiente().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (e) => {
      }
    });
  }

}
