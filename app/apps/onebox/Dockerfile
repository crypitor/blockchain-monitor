FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN npm install -g @nestjs/cli

RUN yarn install

COPY . .

RUN yarn build

CMD yarn start:dev

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY ./dist/apps/onebox ./dist/apps/onebox

# COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/onebox/main.js"]