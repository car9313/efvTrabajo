import {Component, OnInit} from '@angular/core';
import {animations, isNullOrUndefined, SelectItem} from '@app/nodachi';
import {ImportDataService} from '@app/admin/import-data/import-data.service';
import {Notifications} from '../../nodachi/services/notifications';
import {ServiceLocator} from '../../nodachi/services/locator.service';
import {SpinService} from '../../nodachi/components/ng-spin/spin.service';
import { ProvService } from '@app/nodachi/common-services';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  animations: animations,
})
export class ImportDataComponent implements OnInit {

  notification: Notifications;
  field: string;

  fields: Array<{ id, description }>;
  fileTypeExcel: Array<string>;
  file: any;
  fileName: any;
  fileSelected: any;
  model: { fields?: Array<any>, anho_censo?: number, filtro?: string, filtro_valor?: number, fields_obj?: Array<any>, indexes?: Array<any>, field_key?: any, codificador?: string, file_id?: any, row_start?: any };
  errors: Array<string>;
  spin: SpinService;
  provinces: Array<SelectItem>;
  constructor(private importDataService: ImportDataService, private provService: ProvService) {
    this.model = {codificador: '', anho_censo: 0, filtro: '', filtro_valor: 0, fields: [], fields_obj: [], indexes: [], file_id: null, field_key: '', row_start: 0};
    this.field = '';
    this.fileTypeExcel = ['application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    this.file = null;

    this.fileName = '';
    this.fileSelected = {file: null};
    this.errors = [];
    this.notification = ServiceLocator.get(Notifications);
    this.spin = ServiceLocator.get(SpinService);
  }

  ngOnInit() {
    this.fields = [
      {id: 'provincia', description: 'Provincia'},
      // {id: 'municipio', description: 'Municipio'},
      {id: 'nae-secciones', description: 'Secciones NAE'},
      {id: 'nae-divisiones', description: 'Divisiones NAE'},
      {id: 'reup-organismo', description: 'Organismo'},
      {id: 'codigo-reup', description: 'REUP'},
      // {id: 'm', description: 'Censo - Poblacion y Vivienda'},
      // {id: 'censo-poblacion-sexo', description: 'Censo - Población por Sexo y Zona'},
    ];
  }

  save() {
    this.model.file_id = this.fileSelected.file;
    this.spin.startLoading();
    this.importDataService.postFile(this.model).subscribe(resp => {
      this.spin.stopLoading();
      this.notification.success('<span class="far fa-check-circle"></span> Datos importados correctamente.');
      this.model = {codificador: '', anho_censo: 0, filtro: '', filtro_valor: 0, fields: [], fields_obj: [], indexes: [], file_id: null, field_key: '', row_start: 0};
      this.file = null;
    }, error1 => {
      if (error1.status === 400) {
        this.spin.stopLoading();
        const error = !isNullOrUndefined(error1) && !isNullOrUndefined(error1.error) ? error1.error : {};
        if (!isNullOrUndefined(error.ModelState)) {
          this.notification.verification(error1);
        }
      }
    });
  }

  getFields(field) {
    if (!isNullOrUndefined(field)) {
      this.importDataService.getFields(field).subscribe(resp => {
        this.model = resp;

        if (this.model.filtro === 'provincia') {
          this.listProv();
        }
        }, error1 => {  });
    } else {

    }
  }

  listProv(): void {
    this.provService
      .getNomenclador()
      .subscribe(provinces => {
        this.provinces = provinces;
      }, error2 => {
      });
  }

  fileSelect(event, input) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files && event.target.files[0] && input.valid) {
        this.fileSelected.file = event.target.files[0];
        this.fileName = this.fileSelected.file.name;
      } else {
        this.fileSelected.file = null;
        this.fileName = '';
      }
    }
  }

}
