### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:10-alpine as builder

COPY package.json package-lock.json ./

# Settings for datys
COPY closure-util.json ./
RUN echo "registry = https://nexus-3.datys.cu/repository/npm-proxy/" >> ~/.npmrc && \
    echo "strict-ssl = false" >> ~/.npmrc
ENV SASS_BINARY_SITE="https://nexus-3.datys.cu/repository/github-proxy/sass/node-sass/releases/download"
ENV PHANTOMJS_CDNURL="https://nexus-3.datys.cu/repository/github-proxy/Medium/phantomjs/releases/download/v2.1.1"

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm -d i && mkdir /saico && cp -R ./node_modules ./saico

WORKDIR /saico

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build-prod


### STAGE 2: Setup ###

FROM nginx:1.14-alpine

## Copy our default nginx config
COPY deploy/nginx /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /saico/dist/saico /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
