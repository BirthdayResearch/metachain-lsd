# Dockerfile used to build an image for the defichain-wallet-api
FROM node:18.17.0-alpine3.17

WORKDIR /app

ENV PUPPETEER_SKIP_DOWNLOAD=false
ENV CYPRESS_INSTALL_BINARY=0

# Install pnpm
RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./

COPY . .

EXPOSE 5741

RUN pnpm fetch

RUN pnpm install -r --offline
RUN pnpm build

CMD node dist/main.js
