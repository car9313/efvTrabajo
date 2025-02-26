# Nodachi

Núcleo para las aplicaciones de Angular 2 con Rails como api, en DATYS.
 
# Admin
Funcionalidades bascas de administración, gestion de usuario, roles , permisos, auditorías, dashboard y menu lateral, 
presentadas en el componente *AdminDashBoardComponent* y exportadas en el modulo *admin/dashboard/no-dashboard.module.ts*

# Componentes
Componentes genéricos para facilitar el trabajo y reusar código. Para su uso es necesario importar el modulo 
NoComponentsModule en el fichero *components/no-components.module.ts*, buscar mas especificaciones en la carpeta de cada componente. 
 
# Servicios
Servicios genéricos que ayudan en la construcción y reutilización de código.
Todos los servicios se exportan en **nodachi.module.ts**, para usarlos es necesario importar este modulo.

## ConfigService
Configuraciones generales de la aplicación.

#### Uso
```typescript
import {ConfigService} from "nodachi/services/config.services";
let config = new ConfigService();
let secretKey=config.getSecretKey();
```

## CoreService
Clase genérica para los servicios de un recurso.

#### Uso
```typescript
import {CoreService} from "nodachi/services/core.services";

@Injectable()
export class UserService extends CoreService{
    constructor() {
      super('user','/api/v1/users');
    }
}
```

## HttpClient
Permite realizar peticiones http a la api sin tener que pasarle cabecera ni token de autenticación.
La url de la peticion es relativa al Host. 
#### Uso
```typescript
      let http = new HttpClient();
       return http
      .post('/api/v1/authenticate', JSON.stringify(user))
      .pipe(catchError(LoginService.handleError));
```

