#! /bin/bash

VERSION=0.1.0
#echo "==>> Construir distribucion de la app"
#docker-compose build build
#docker-compose up build

docker build -f ./prod.Dockerfile -t saico:${VERSION} .
#docker run -p 8080:80 saico:${VERSION}
#docker push  mtzregistry-hub.datys.cu:5000/saipci-ui:${VERSION}
