import { strings } from '@angular-devkit/core';
import { Component, OnInit } from '@angular/core';
import { animations, IComponentCreate } from '@app/nodachi';
import { CantidadEfv } from '@app/efv/cantEfv';
import { GenerarEfvService } from '@app/efv/efv-generar/generarEfv.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-efv-generar',
  templateUrl: './efv-generar.component.html',
  animations: animations,
})
export class EfvGenerarComponent extends IComponentCreate<CantidadEfv> implements OnInit {
  public errors: string = null;

  constructor(public efvService: GenerarEfvService, router: Router, route: ActivatedRoute) {
    super(efvService, router, 'Genererar Formas valiosas', new CantidadEfv());

  }

  ngOnInit() {
    super.ngOnInit();
  }
  public isSave(): void {
    // const id = isNullOrUndefined(object.id) ? object.item.id : object.id;
    this.notification.confirm('Atención!', 'Seguro que desea crear formas valiosas', () => this.save());
    // location.reload();
  }

  /*  save(newElement: boolean = false): void {
     this.spin.startLoading();
     this.preSave();
     this.efvService.prueba(this.model)
       .subscribe(res => {
         this.spin.stopLoading();
         this.notification.verification(res);
         this.model = Object.assign({}, this.emptyModal);
         this.resetForms();
         this.postSave(res);
         if (newElement) {
           this.goWhenSave(res);
         } else {
           this.goList();
         }
       },
         error2 => {
           this.spin.stopLoading();
           this.notification.verification(error2);
         });
   } */
  save() {
    this.efvService.createEfv(this.model).subscribe(res => {
      this.resetForms();
      if (res != null) {
        this.spin.stopLoading();
        this.notification.error(res)
        this.errors = res;
      }
      else {
        this.spin.stopLoading();
        this.notification.success('Las formas valiosas se crearon correctamente')
      }
    })
  }


  goList(): void {
    const listUrl: string = this.router.url.replace(/\/efv_generar$/, '/list');
    this.router.navigateByUrl(listUrl).then();
  }
}
