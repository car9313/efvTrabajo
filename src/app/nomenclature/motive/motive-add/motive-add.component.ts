import { Component, OnInit } from '@angular/core';
import {animations, IComponentCreate, NgChoosenOpts, SelectItem} from '@app/nodachi';
import {Motive} from '../motive';
import {MotiveService} from '@app/nodachi/common-services/nomencladores/motive/motive.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-motive-add',
  templateUrl: './motive-add.component.html',
  animations: animations,
})
export class MotiveAddComponent extends IComponentCreate<Motive> implements OnInit {

  public tipoSolicitud: Array<SelectItem>;
  public choosenOptsTipo: NgChoosenOpts;

  constructor(public motiveService: MotiveService,
              public router: Router,
              public route: ActivatedRoute) {
    super(motiveService, router, 'Agregar Motivo de Rechazo', new Motive());
    this.choosenOptsTipo = {placeHolder: '--Seleccione Tipo Solicitud--', valueField: 'key', textField: 'value'};
  }

  ngOnInit() {
    super.ngOnInit();
    this.listTiposDeSolicitud();
  }

  listTiposDeSolicitud(): void {
    this.motiveService
      .getEnumTipoMotivo()
      .subscribe(tipo => {
        this.tipoSolicitud = tipo;
      }, error2 => {
      });
  }
}
