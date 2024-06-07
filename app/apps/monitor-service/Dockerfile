FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD yarn start:dev monitor-service

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY ./dist/apps/monitor-service ./dist/apps/monitor-service

CMD ["node", "dist/apps/monitor-service/main.js"]