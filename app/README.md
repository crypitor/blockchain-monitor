## Installation

```bash
$ yarn
```

## Running the only API app

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
## Quick start local Development with docker
update .env.docker files
```bash
make up-dev
```

## Quick start Production with docker
update .env.docker files
```bash
cd docker

# config env for production and Update config for for network
cp .env.sample .env

# start docker compose
docker compose up -d
```

## Build production image
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

## Set up dev environment without docker
Update .env with env.sample

```bash
make up-deps

# start api module
yarn start:dev api

# start polling block module
yarn start:dev polling-block

# start monitor service
yarn start:dev monitor-service

# start worker service
yarn start:dev worker-service

# stop deps
make down-deps
```

## License

Crypitor is [MIT licensed](LICENSE).