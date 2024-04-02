FROM node:18-alpine

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

CMD node apps/server/dist/main.js
