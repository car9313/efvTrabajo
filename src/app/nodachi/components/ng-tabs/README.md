# Ng-Tabs
Tabs con style de bootstrap

En el componente que se va a usar agregar el tag <ng-tabs>
dentro de este agregar tantos <ng-tab> como se requiera el atributo title indica el titulo del tab y active si el tab se muestra activo por defecto si no se especifica ninguno estara activo el primer tab.

Ejemplo:
```html
<ng-tabs>
  <ng-tab title="Tab 1">
    <componet1 #tabitem></componet1>  
  </ng-tab>
  <ng-tab title="Tab 2">
    <componet2 #tabitem></componet2>
  </ng-tab>
</ng-tabs>
```

Dentro del <ng-tag> agregar el componente que se quiera utilizar implemetando la interfaz ITabComponent

Ejemplo:
```typescript
import {Component} from "@angular/core";
import {ITabComponent} from "ng-tabs.component";

@Component({
  selector: 'componet1',
  template: '<div></div>', 
})
export class Component1 implements ITabComponent {
  onTabInit(){
    // your code
  }
}
```
