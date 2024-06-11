## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

# Using docker
## Build development with start watch
```bash
make build
make up
```

## Build production
Build docker container and push to docker registry
```bash
yarn build
docker build -f apps/api/Dockerfile --target production -t <name>/api:<version> .
docker build -f apps/monitor-service/Dockerfile --target production -t <name>/monitor:<version> .
docker build -f apps/worker-service/Dockerfile --target production -t <name>/worker:<version> .

docker push <name>/api:<version>
docker push <name>/monitor:<version>
docker push <name>/worker:<version>
```
## Run production
```bash
cd docker

# config env for production
cp .env.sample .env

# start docker compose
docker compose up -d
```

## Set up dev environment
Start local dev env
```bash
make up-deps

# start api module
yarn start:dev api

# start monitor service
yarn start:dev monitor-service

# start worker service
yarn start:dev worker-service

# stop deps
make down-deps
```
Start docker compose dev
```bash
docker compose -f docker-compose-dev.yml up -d
```

## License

Nest is [MIT licensed](LICENSE).