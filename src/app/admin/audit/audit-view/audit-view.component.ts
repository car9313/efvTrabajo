import {Component, OnInit} from '@angular/core';
import {animations, IComponentView} from '@app/nodachi';
import {Audit} from '@app/admin/audit/audit';
import {AuditService} from '../audit.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-audit-view',
  templateUrl: './audit-view.component.html',
  animations: animations
})

export class AuditViewComponent extends IComponentView<Audit> implements OnInit {
  public key_values: any;
  public new_values: any;

  constructor(public auditService: AuditService,
              public router: Router,
              public route: ActivatedRoute) {
    super(auditService, route, router, 'Detalles de Evento', new Audit());
  }

  ngOnInit(): void {
    this.ngOnInitObservable().subscribe(model => {
      this.key_values = this.model.key_values === '-' ? '' : JSON.parse(this.model.key_values);
      this.new_values = this.model.new_values === '-' ? '' : JSON.parse(this.model.new_values);
    });
  }

  goList(): void {
    this.router.navigateByUrl('/admin/audits/list').then();
  }
}
