# Saico
Front-end del proyecto SAICO. usando las tecnologías NodeJS, Angular y Bootstrap.
La aplicación corre usando contenedor de Docker y Docker Compose.

 [![Build status](https://dc-tfs-app.datys.cu/tfs/DATYS/_apis/public/build/definitions/163e0f68-ac34-4ce4-b6c8-4d8795f6d542/8/badge)](https://dc-tfs-app.datys.cu/tfs/DATYS/Bomberos)
 [![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/guide/styleguide)
 [![Dependency Status](https://david-dm.org/ypmaden/saico.svg)](https://david-dm.org/ypmaden/saico)
 [![devDependency Status](https://david-dm.org/ypmaden/saico/dev-status.svg)](https://david-dm.org/ypmaden/saico#info=devDependencies)
 [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# Empezar a desarrollar
 1. Clonar proyecto :
 ```ssh
     git clone https://dc-tfs-app.datys.cu/tfs/DATYS/Bomberos/_git/saipci-ui
 ```
  ```ssh
      git checkout origin/webapi
  ```
 2. Crear imágenes de docker :
 ```ssh
    docker-compose build web
 ```
 ó sin utilizar docker
 ```ssh
    npm install
```
  
 3. Las configuraciones se encuentran en :
* ```src/environments/constants.ts```: Son las configuraciones necesarias para la aplicación y las que se toman por defecto.
* ```src/config.production.json```: Son las configuraciones para recursos externos eje: api, servicios de mapas etc. renombrar este archivo a ```config.develoment.json``` para usar en desarrollo

 4. Corriendo aplicación  
 ```ssh
    docker-compose up web
 ```
 ó sin utilizar docker
 ```ssh
    npm start
```
Se puede acceder por la URL *http://localhost:4201/* tener presente que no debe estar corriendo ninguna
 aplicación por el mismo puerto.


# Generar documentación
```ssh
    docker-compose exec web npm run doc
 ```
  ó sin utilizar docker
 ```ssh
    npm run doc
```

# Guia para desarolladores
* [Guia general de angular](https://angular.io/guide/styleguide)
* [Guia para commits](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

