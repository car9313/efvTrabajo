# Ng-Modal
Modals de bootstrap

**Inputs**

title : <string> Titulo en el header del modal (default: "Modal")

action : <string> Clase que se le agrega al modal que indica la accion que se realiza cuando da submit o para levantar el modal (default: "add")

**Outputs**

close : <event> Evento que se dispara cuando se oculta el modal

Ejemplo
```html
<ng-modal [title]="modal_title" [action]="modal_action">
 Contenido del Modal
</ng-modal>
```
