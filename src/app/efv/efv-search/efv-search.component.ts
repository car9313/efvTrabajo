import { Component, OnInit } from '@angular/core';
import {
  IComponentList,
  NgChoosenOpts,
  animations,
  isNullOrUndefined,
} from '@app/nodachi';
import { EfvListService } from '../efv-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IsFilter } from '@app/nodachi/decorators/is-filter.decorator';
import { SolicitudService } from '../solicitudes/solicitud.service';

@Component({
  selector: 'app-efv-search',
  templateUrl: './efv-search.component.html',
  styleUrls: ['./efv-search.component.scss'],
  animations: animations,
})
export class EfvSearchComponent extends IComponentList implements OnInit {
  public estadoschoosenOpts: NgChoosenOpts;
  public estados: any;
  @IsFilter() public actionEstadoFilter: string;
  @IsFilter() public id_segmento: string;
  @IsFilter() public id_solicitud: string;
  @IsFilter() public efv: string;

  public tiposVisachoosenOpts: NgChoosenOpts;
  public tiposVisa: any;
  @IsFilter() public actionTiposVisaFilter: string;

  public entidadeschoosenOpts: NgChoosenOpts;
  public entidades: any;
  @IsFilter() public actionEntidadesFilter: string;

  constructor(
    private efvListService: EfvListService,
    public router: Router,
    private route: ActivatedRoute,
    public solicitudService: SolicitudService
  ) {
    super(efvListService, 'EFv', 'Formas valiosas', router);

    this.headers = {
      numero_fv: '#eFV',
      estado: 'Estado',
      id_segmento: 'Id segmento',
      id_solicitud: 'Id Solicitud',
      tipo_visa: 'Tipo Visa',
      entidad: 'Entidad',
    };
    this.headersExcel = [
      { name: 'numero_fv', key: 'Numero Efv' },
      { name: 'estado_fv', key: 'Estado Efv' },
      { name: 'id_segmento', key: 'Id Segmento' },
      { name: 'id_solicitud', key: 'Id Solicitud' },
      { name: 'tipo_visa', key: 'Tipo Visa' },
      { name: 'entidad', key: 'Entidad' },
      { name: 'modalidad', key: 'Modalidad' },
      { name: 'eticket_id', key: 'Eticket Id' },
      { name: 'chk_frontera', key: 'Chk Frontera' },
      { name: 'fecha_cruce', key: 'Fecha Cruce' },
      { name: 'fecha_envio_cruce', key: 'Fecha Envio Cruce' },
      { name: 'fc_e_stado', key: 'Fecha Estado' },
      { name: 'modalidad', key: 'Modalidad' },
    ];

    this.estadoschoosenOpts = {
      textField: 'value',
      valueField: 'key',
      placeHolder: 'Estados',
    };
    this.tiposVisachoosenOpts = {
      textField: 'description',
      valueField: 'code',
      placeHolder: 'Tipos de Visa',
    };
    this.entidadeschoosenOpts = {
      textField: 'name',
      valueField: 'description',
      placeHolder: 'Entidades',
    };
  }

  ngOnInit() {
    super.ngOnInit(false);
    this.route.params.subscribe((params) => {
      if (params['id_solicitud']) {
        this.id_solicitud = params['id_solicitud'];
        this.search();
      } else if (params['id_segmento']) {
        this.id_segmento = params['id_segmento'];
        this.search();
      } else if (this.id_solicitud || this.id_segmento || this.efv) {
        this.search();
      }
      // Access the 'id' parameter from the URL
    });
    this.listEstados();
    this.listTipoVisa();
    this.listEntidades();
  }
  listEstados(): void {
    this.efvListService.getEstados().subscribe((res) => {
      this.estados = res;
    });
  }
  listTipoVisa(): void {
    this.solicitudService.getTipoVisaSolicitudes().subscribe((res) => {
      console.log(res);
      this.tiposVisa = res;
    });
  }
  listEntidades(): void {
    this.solicitudService.getEntidades().subscribe((res) => {
      console.log(res);
      this.entidades = res;
    });
  }
  preSearch() {
    this.searchParams.other_params = {
      efv: this.efv,
      estado_efv: this.actionEstadoFilter,
      id_segmento: this.id_segmento,
      id_solicitud: this.id_solicitud,
      tipovisa: this.actionTiposVisaFilter,
      entidad: this.actionEntidadesFilter,
    };
  }

  updateEstado() {
    if (
      (this.id_segmento == '' || this.id_segmento == undefined) &&
      (this.efv == '' || this.efv == undefined) &&
      (this.id_solicitud == '' || this.id_solicitud == undefined)
    ) {
      this.actionEstadoFilter = undefined;
      this.viewState.filters['id_segmento'] = null;
      this.viewState.filters['efv'] = null;
      this.viewState.filters['id_solicitud'] = null;
      this.viewState.filters['actionEstadoFilter'] = null;
      this.objects = [];
    }
  }
  public search1(reset: boolean = false, redirect: boolean = false): void {
    this.spin.startLoading();
    if (reset) {
      this.currentpage = 1;
    }
    this.searchParams.page = this.currentpage;
    this.searchParams.per = this.itemPerPage;
    this.searchParams.search = this.param_search;
    this.preSearch();
    if (!this.savedState) {
      this.saveState();
      this.savedState = false;
    }
    this.currentItems = 0;
    this.totalPage = 0;
    this.totalItems = 0;
    this.objects = [];
    this.spin.stopLoading();
  }

  public resetFilters1(search = true): void {
    this.viewState.param_search = this.param_search = '';
    this.objects = [];
    for (const key in this.viewState.filters) {
      // si el filtro es provincia o municipio pero tiene restriccion por usuario no se considera como filtro
      if (
        (key === 'province_filter' && this.disable_prov) ||
        (key === 'municipality_filter' && this.disable_mun)
      ) {
        continue;
      }
      this[key] = null;
    }
    if (search) {
      this.viewState.filters['id_segmento'] = null;
      this.viewState.filters['efv'] = null;
      this.viewState.filters['id_solicitud'] = null;
      this.viewState.filters['actionEstadoFilter'] = null;

      this.search1(true);
    }
  }
  view(object: any): void {
    const id = object.numero_fv;
    const viewUrl: string = `/efv/efv_buscar/solicitud/${this.id_solicitud}/${id}`;
    this.router.navigateByUrl(viewUrl).then();
  }
}
