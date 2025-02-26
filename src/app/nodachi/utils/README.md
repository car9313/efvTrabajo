# no-icomponent
Componentes genéricos con las funcionalidades básicas, de los componentes de una entidad.
  
* IComponentList:
  Listado genérico de entidades sin modal. 
  Ejemplo de uso:
  ```typescript
  export class DivisionListComponent extends IComponentList {  
    constructor(private divisionService: DivisionService, public router: Router) {
      super('codificadores/divisions','codificadores/division',divisionService,
        "Division", 'Administrar Divisiones', router);
    }
  }
  ```
   
* IComponentoModal
  Listado genérico de entidades con modal.  
    Ejemplo de uso:
    ```typescript
    ```
  
* ICreateComponent
  Funcionalidades basicas para los formularios de crear. 
    Ejemplo de uso:
    ```typescript
    export class DivisionAddComponent extends ICreateComponent{
       constructor(private divisionService: DivisionService, public router: Router) {
        super(divisionService,router,'Agregar Nueva División',new Division());
      }
    }
    ```
    
* IUpdateComponent
  Funcionalidades basicas para los formularios de actualizar.
  
    Ejemplo de uso:
    ```typescript
    export class DivisionEditComponent extends IUpdateComponent{
      constructor(private divisionService: DivisionService, public route: ActivatedRoute, public router: Router) {
        super(divisionService,route, router,'Editar División', new Division());
      }
    }
    ```


