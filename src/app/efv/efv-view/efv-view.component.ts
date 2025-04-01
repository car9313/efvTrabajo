import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { animations, IComponentView } from '@app/nodachi';
import { ActivatedRoute, Router } from '@angular/router';
import { Efv } from '@app/efv/efv';
import { EfvListService } from '@app/efv/efv-list.service';

@Component({
  selector: 'app-efv-view',
  templateUrl: './efv-view.component.html',
  styleUrls: ['./efv-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: animations,
})
export class EfvViewComponent extends IComponentView<Efv>  {
  public efv: string;
  public comments: any[];
  public show_score: boolean;

  constructor(protected efvServices: EfvListService, public router: Router, public route: ActivatedRoute) {
    super(efvServices, route, router, 'Efv', new Efv());

  }
  goList(): void {
    const listUrl = '/efv/efv_buscar';
    this.router.navigateByUrl(listUrl).then();
  }

}
