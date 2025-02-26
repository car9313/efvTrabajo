#!/bin/sh
# Entrypoint de produccion para caipiar los ficheros para un volumen
echo "==>> Creando carpeta /var/www/saipci_ui"
mkdir -p /var/www/saipci_ui

echo "==>> Borrando contendio de la carpeta /var/www/saipci_ui"
rm -rf /var/www/saipci_ui/*

echo "==>> Copiando ficheros"
cp -r /src/* /var/www/saipci_ui
