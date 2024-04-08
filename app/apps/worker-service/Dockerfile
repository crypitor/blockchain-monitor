FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD yarn start:dev worker-service

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY ./dist/apps/worker-service ./dist/apps/worker-service

# COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/worker-service/main.js"]