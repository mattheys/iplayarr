# base
FROM node:current AS base

WORKDIR /app

COPY package*.json ./
    
RUN npm install

COPY . .

# for lint

FROM base as linter

WORKDIR /app

RUN npm run lint

# for build

FROM linter as builder

WORKDIR /app

RUN npm run build


# for production

FROM node:current-alpine

RUN apk --update add \
    ffmpeg \
    openssl \
    perl-mojolicious \
    perl-lwp-protocol-https \
    perl-xml-simple \
    perl-xml-libxml \
    su-exec

RUN apk add atomicparsley --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ --allow-untrusted && ln -s `which atomicparsley` /usr/local/bin/AtomicParsley

WORKDIR /iplayer

ENV GET_IPLAYER_VERSION=3.35

RUN wget -qO- https://github.com/get-iplayer/get_iplayer/archive/v${GET_IPLAYER_VERSION}.tar.gz | tar -xvz -C /tmp && \
    mv /tmp/get_iplayer-${GET_IPLAYER_VERSION}/get_iplayer . && \
    rm -rf /tmp/* && \
    chmod +x ./get_iplayer

ENV GET_IPLAYER_EXEC=/iplayer/get_iplayer
ENV STORAGE_LOCATION=/config

WORKDIR /app

COPY package*.json ./

RUN npm run install:both --omit=dev

COPY --from=builder /app/dist ./

RUN npm run build:frontend && npm run build:backend

RUN rm -rf /app/src /app/frontend/src

EXPOSE 3000

ENTRYPOINT [ "./docker_entry.sh" ]

CMD ["npm", "run", "start"]

