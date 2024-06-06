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
docker build -f apps/onebox/Dockerfile --target production -t <name>/onebox:<version> .
docker build -f apps/monitor-service/Dockerfile --target production -t <name>/monitor:<version> .
docker build -f apps/worker-service/Dockerfile --target production -t <name>/worker:<version> .

docker push <name>/onebox:<version>
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

# start onebox module
yarn start:dev onebox

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

## Set up SSL from certbot
```bash
source .env
echo "Install certbot:"
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ufw allow 80
sudo certbot certonly --standalone -d $DOMAIN -m $EMAIL
sudo ufw delete allow 80
```

OR
```bash
sudo docker run -it --rm --name certbot -v "/etc/letsencrypt:/etc/letsencrypt" -v "/var/lib/letsencrypt:/var/lib letsencrypt" -p 80:80 certbot/certbot certonly

sudo ufw-docker allow certbot
```

## License

Nest is [MIT licensed](LICENSE).