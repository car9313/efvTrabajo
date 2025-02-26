FROM node:10-alpine

#RUN echo "172.22.10.36 espejo.datys.cu" >> /etc/hosts
RUN mkdir -p /app

WORKDIR /app

# Par instalar phantomjs
#RUN apt-get update -qq; exit 0
#RUN apt-get install -y --no-install-recommends bzip2 libfontconfig1
#RUN npm config set phantomjs_cdnurl https://nexus-3.datys.cu/repository/github-proxy/Medium/phantomjs/releases/download/v2.1.1

COPY package.json package-lock.json ./

# Settings for datys
COPY closure-util.json ./
RUN echo "registry = https://nexus-3.datys.cu/repository/npm-proxy/" >> ~/.npmrc && \
    echo "strict-ssl = false" >> ~/.npmrc
ENV SASS_BINARY_SITE="https://nexus-3.datys.cu/repository/github-proxy/sass/node-sass/releases/download"
ENV PHANTOMJS_CDNURL="https://nexus-3.datys.cu/repository/github-proxy/Medium/phantomjs/releases/download/v2.1.1"

COPY deploy/sh/run-web.sh /usr/sbin/run-web.sh
RUN chmod +x /usr/sbin/run-web.sh

COPY deploy/sh/run-test.sh /usr/sbin/run-test.sh
RUN chmod +x /usr/sbin/run-test.sh

COPY deploy/sh/node-build.sh /usr/sbin/node-build.sh
RUN chmod +x /usr/sbin/node-build.sh

VOLUME /app/node_modules
