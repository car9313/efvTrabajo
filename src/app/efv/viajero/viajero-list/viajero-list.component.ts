import { Component, OnInit } from '@angular/core';
import { animations, IComponentList, isNullOrUndefined, NgChoosenOpts } from '../../../nodachi/index';
import { ViajerosService } from '../viajeros.service';
import { Router } from '@angular/router';
import { IsFilter } from '@app/nodachi/decorators/is-filter.decorator';

@Component({
  selector: 'app-viajero-list',
  templateUrl: './viajero-list.component.html',
  styleUrls: ['./viajero-list.component.scss'],
  animations: animations
})
export class ViajeroListComponent extends IComponentList implements OnInit {
  @IsFilter() public pasaporte: string;
  @IsFilter() public numero_fv: string;

  @IsFilter() public fechaFilterNacimiento: string;
  @IsFilter() public fechaFinFilterNacimiento: string;

  @IsFilter() public fechaFilterActivacion: string;
  @IsFilter() public fechaFinFilterActivacion: string;
  public today = new Date();

  constructor(protected viajerosService: ViajerosService, public router: Router) {
    super(viajerosService, 'Viajero', 'Lista de  Viajeros', router);
    this.headers = {
      numero_fv: 'eFV',
      primer_nombre: 'Nombre',
      primer_apellido: 'Primer Apellido',
      segundo_apellido: 'Segundo Apellido',
      pasaporte: 'Pasaporte',
      pais: 'País',
      fecha_nacimiento: 'Fecha de nacimiento',
      fecha_activacion: 'Fecha Activacion',
    };
    this.headersExcel = [
      { name: 'numero_fv', key: 'eFV' },
      { name: 'primer_nombre', key: 'Primer Nombre' },
      { name: 'segundo_nombre', key: 'Segundo Nombre' },
      { name: 'primer_apellido', key: 'Primer Apellido' },
      { name: 'segundo_apellido', key: 'Segundo Apellido' },
      { name: 'pasaporte', key: 'Pasaporte' },
      { name: 'pais', key: 'País' },
      { name: 'fecha_nacimiento', key: 'Fecha Nacimiento' },
      { name: 'ciudadania', key: "Ciudadania" },
      { name: 'fecha_venta', key: "Fecha Venta" },
      { name: 'fecha_activacion', key: "Fecha Activacion" },
    ];

  }

  ngOnInit() {
    super.ngOnInit();
  }

  preSearch() {
    this.searchParams.other_params = {
      fechadesdeNacimiento: this.fechaFilterNacimiento ? this.fechaFilterNacimiento : null,
      fechahastaNacimiento: this.fechaFinFilterNacimiento ? this.fechaFinFilterNacimiento : null,
      pasaporte: this.pasaporte,
      numeroFV: this.numero_fv,
      fechadesdeActivacion: this.fechaFilterActivacion ? this.fechaFilterActivacion : null,
      fechahastaActivacion: this.fechaFinFilterActivacion ? this.fechaFinFilterActivacion : null,
    };

  }

  view(object: any): void {
    const viewUrl: string =
      this.router.url.replace(/\/list$/, '/view') + '/' + object.numero_fv;
    this.router.navigateByUrl(viewUrl).then();
  }
}
