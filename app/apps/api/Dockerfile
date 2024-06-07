FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD yarn start:dev api

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY ./dist/apps/api ./dist/apps/api

COPY ./resources ./resources

CMD ["node", "dist/apps/api/main.js"]