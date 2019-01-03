FROM node:11.4.0-alpine

WORKDIR /home/node/app
RUN apk update
RUN apk add --no-cache \
    # Prerequisites for pngquant-bin
    build-base \
    libpng-dev \
    lcms2-dev \
    bash
COPY ./package* ./

RUN npm install && \
    npm cache clean --force
RUN npm run build

COPY . .

EXPOSE ${PORT}
