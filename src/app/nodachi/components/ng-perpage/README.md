#ng-perpage
Componente con un select con la calidad de elementos por pagina que se visualizan usando el paginado.

# Uso 
1. Importar el modulo NoComponentsModule en el fichero *components/no-components.module.ts*.
2. Agregar la etiqueta en el HTML
 ```html
      <ng-perpage name="perpage" [(ngModel)]="itemPerPage">
      </ng-perpage>
```
3. El valor se le asigna al atributo **ngModel** especificado, que en el ejemplo es *itemPerPage*.
 
 


 

