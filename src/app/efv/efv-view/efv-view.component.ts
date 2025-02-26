import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { animations, IComponentView } from '@app/nodachi';
import { ActivatedRoute, Router } from '@angular/router';
import { Efv } from '@app/efv/efv';
import { EfvListService } from '@app/efv/efv-list.service';
import { Efv1 } from '@app/efv/efv1';
import { EMPTY, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-efv-view',
  templateUrl: './efv-view.component.html',
  styleUrls: ['./efv-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: animations,
})
export class EfvViewComponent extends IComponentView<Efv1>  {
  public efv: string;
  public comments: any[];
  public show_score: boolean;

  constructor(protected efvServices: EfvListService, public router: Router, public route: ActivatedRoute) {
    super(efvServices, route, router, 'Efv', new Efv1());
    /* this.route.paramMap.subscribe((params) => {
       this.efv = params.get('id');
       this.search(true);
       this.efvServices.getViajero(this.efv).subscribe((resp) => {
         this.comments = resp;
       });
     });
     this.efv = this.route.snapshot.paramMap.get('id');
     console.log(this.efv);*/
  }

  /*
    getViajeroData() {
      this.efvServices.getViajero(this.efv).subscribe((resp) => {
        this.comments = resp;
        console.log(this.comments);
      });
    }

    changeTab(event) {
      if (event.index === 1) {
        this.show_score = true;
      }
    }

     getViajeroData() {
       this.efvServices.getViajero(this.efv).subscribe((res) => {
         this.comments = res;
       });
     }

    ngOnInit(search = true): void {
      this.ngOnInitObservable(null, search).subscribe();
      this.getViajeroData();
    }

    ngOnInitObservable(id?, search = true): Observable<any> {
      this.loadState();
      this.setPerm(null);
      this.spin.startLoading();

      if (search) {
        return this.getById(
          id ? id : this.route.snapshot.paramMap.get('id')
        ).pipe(
          tap((model) => {
            this.model = model;
            this.spin.stopLoading();
          }),
          catchError((error2) => {
            this.spin.stopLoading();
            this.notification.verification(error2);
            this.goList();
            return observableThrowError(error2);
          })
        );
      }

      return EMPTY;
    }

  */
  goList(): void {
    // const listUrl: string = this.router.url.replace(/\/view\/\d+$/, '/list');
    const listUrl = '/efv/list';
    this.router.navigateByUrl(listUrl).then();
  }

}
