#! /bin/ash

echo "Instalando dependencias npm"
npm install -d

echo "build app con angular cli"
npm run build:prod

echo "==>> App angular construida"
