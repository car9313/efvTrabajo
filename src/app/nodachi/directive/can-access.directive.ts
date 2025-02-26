import {Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Utility} from '@app/nodachi/utils/utility';

@Directive({
  selector: '[canAccess]',
})
export class CanAccessDirective implements OnDestroy {

  private alive = true;
  private hasView = false;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private utility: Utility) {
  }

  @Input() set canAccess([permission, resource]: [string, string]) {
    // bypass admin
    const can = this.utility.isAdmin() ? true : this.utility.hasPermission(resource, [permission]);
    if (can && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!can && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
