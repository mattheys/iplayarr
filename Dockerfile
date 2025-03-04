FROM node:current-alpine

RUN apk --update add \
    ffmpeg \
    openssl \
    perl-mojolicious \
    perl-lwp-protocol-https \
    perl-xml-simple \
    perl-xml-libxml

RUN apk add atomicparsley --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ --allow-untrusted && ln -s `which atomicparsley` /usr/local/bin/AtomicParsley

RUN mkdir -p /data/output /data/config

WORKDIR /iplayer

ENV GET_IPLAYER_VERSION=3.35

RUN wget -qO- https://github.com/get-iplayer/get_iplayer/archive/v${GET_IPLAYER_VERSION}.tar.gz | tar -xvz -C /tmp && \
    mv /tmp/get_iplayer-${GET_IPLAYER_VERSION}/get_iplayer . && \
    rm -rf /tmp/* && \
    chmod +x ./get_iplayer

ENV GET_IPLAYER_EXEC=/iplayer/get_iplayer

WORKDIR /app

COPY package*.json ./
RUN mkdir frontend
COPY frontend/package*.json ./frontend/

RUN npm install
RUN cd frontend && npm install
COPY . .
RUN npm run build:frontend
RUN npm run build:backend

CMD ["npm", "run", "start"]
