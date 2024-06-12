FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD yarn start:dev polling-block

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY ./dist/apps/polling-block ./dist/apps/polling-block

CMD ["node", "dist/apps/polling-block/main.js"]