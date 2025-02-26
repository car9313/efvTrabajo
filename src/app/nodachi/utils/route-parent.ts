import {BreadcrumbService} from '../components/ng-breadcrumb/breadcrumb.service';

export class RouteParent {

  constructor(public breadcrumbService: BreadcrumbService,
              public parentName: string,
              public parentAlias: string,
              public arrayRoutes: any[]) {
    this.routerNameInit();
  }

  /**
   * Inicializa el padre y recorre las primeras rutas llamando al metodo recursivo
   * */
  routerNameInit() {
    this.breadcrumbService.addFriendlyNameForRoute(this.parentName, {breadcrumb: this.parentAlias, navigation: this.parentAlias});
    this.arrayRoutes.forEach(child => {
      this.routerNameRecursive(child, `${this.parentName}/`);
    });
  }

  /**
   * Metodo recursivo para recorrer los link
   * @param childs contiene los hijos
   * @param path la url k se va creando
   */
  routerNameRecursive(childs, path) {
    const regex = /:\w+/g;
    if (childs.children) {
      path += childs.path;
      if (childs.data && childs.data[1]) {
        if (regex.test(path)) {
          const tmppath = path.replace(regex, '\\d+');
          this.breadcrumbService.addFriendlyNameForRouteRegex(`^${tmppath}$`, childs.data[1]);
        } else {
          this.breadcrumbService.addFriendlyNameForRoute(path, childs.data[1]);
        }
      }
      childs.children.forEach(child => {
        this.routerNameRecursive(child, `${path}/`);
      });
    } else {
      if (childs.data && childs.data[1]) {
        path += childs.path;
        if (regex.test(path)) {
          const tmppath = path.replace(regex, '\\d+');
          this.breadcrumbService.addFriendlyNameForRouteRegex(`^${tmppath}$`, childs.data[1]);
        } else {
          this.breadcrumbService.addFriendlyNameForRoute(path, childs.data[1]);
        }
      }
    }
  }
}
