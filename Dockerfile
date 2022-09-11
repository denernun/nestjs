FROM node:16-alpine As development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci --legacy-peer-deps
COPY --chown=node:node . .
RUN npm run build
USER node
