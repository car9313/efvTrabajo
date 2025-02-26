#ng-fbutton
Componente con los botones genéricos de un formulario de insertar o editar una entidad.

# Uso 
1. Importar el modulo NoComponentsModule en el fichero *components/no-components.module.ts*.
2. Agregar la etiqueta en el HTML
 ```html
       <ng-fbutton (save)="save()" (saveNew)="saveNew()" (cancel)="goList()"
                   [disabled]="!(appForm.form.dirty && appForm.form.valid)"></ng-fbutton>
```
 
 


 

