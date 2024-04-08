SHELL := /bin/bash

include .env

default: up

## 


## ▄▄▄▄▄▄▄▄▄▄▄  ▄▄        ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄       ▄ 
##▐░░░░░░░░░░░▌▐░░▌      ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░▌     ▐░▌
##▐░█▀▀▀▀▀▀▀█░▌▐░▌░▌     ▐░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌ ▐░▌   ▐░▌ 
##▐░▌       ▐░▌▐░▌▐░▌    ▐░▌▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌  ▐░▌ ▐░▌  
##▐░▌       ▐░▌▐░▌ ▐░▌   ▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌   ▐░▐░▌   
##▐░▌       ▐░▌▐░▌  ▐░▌  ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░▌       ▐░▌    ▐░▌    
##▐░▌       ▐░▌▐░▌   ▐░▌ ▐░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌   ▐░▌░▌   
##▐░▌       ▐░▌▐░▌    ▐░▌▐░▌▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌  ▐░▌ ▐░▌  
##▐░█▄▄▄▄▄▄▄█░▌▐░▌     ▐░▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌ ▐░▌   ▐░▌ 
##▐░░░░░░░░░░░▌▐░▌      ▐░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░▌     ▐░▌
## ▀▀▀▀▀▀▀▀▀▀▀  ▀        ▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀  ▀       ▀                                                    
##                           
## Commands:
##
## help		: Prints this help screen.
## up		: Builds the application container and starts it with logging.
## up-silent	: Builds the application container and starts it in background mode, no active logging.
## down		: Removes the docker containers.
## stop		: Stops the running containers.
## shell		: SSH into the main app container.
##
.PHONY: help
help : Makefile
	@sed -n 's/^##//p' $<

.PHONY: up
up:
	@echo "Building application and starting container..."
	docker compose -f docker-compose-dev.yml up

.PHONY: build
build:
	@echo "Re-building container and installing dependancies..."
	docker compose -f docker-compose-dev.yml down && TARGET=development docker compose -f docker-compose-dev.yml build --no-cache && docker compose -f docker-compose-dev.yml up

.PHONY: up-silent
up-silent:
	@echo "Building application and starting container in background mode..."
	docker compose -f docker-compose-dev.yml up -d

.PHONY: log
log:
	@echo "Building application and starting container in background mode..."
	docker compose -f docker-compose-dev.yml logs onebox monitor worker -f -n 10

.PHONY: down
down:
	@echo "Shutting down and removing containers for onebox..."
	@docker compose -f docker-compose-dev.yml down

.PHONY: stop
stop:
	@echo "Stopping containers for onebox..."
	@docker compose -f docker-compose-dev.yml stop

.PHONY: shell
shell:
	@docker exec -ti onebox /bin/sh

.PHONY: shell-db
shell-db:
	@docker exec -ti mongo mongosh -u ${DB_USERNAME} -p ${DB_PASSWORD}

.PHONY: db
db:
	@echo "-------------------------------------------------------------------------"
	@echo "### Host machine URL (use to access mongo outside Docker Containers e.g: MongoDB Compass GUI) ###"
	@echo 'mongodb://${DB_USERNAME}:${DB_PASSWORD}@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.0'
	@echo "-------------------------------------------------------------------------"
	@echo "### Localhost URL ###"
	@echo 'mongodb://${DB_USERNAME}:${DB_PASSWORD}@mongo:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.0'
	@echo "-------------------------------------------------------------------------"

.PHONY: up-prod
up-prod:
	# @echo "Init prod environment..."
	# sudo certbot certonly --standalone -d $API_DOMAIN -m $EMAIL
	@echo "Building application and starting container..."
	docker compose -f docker compose-prod.yml up -d

.PHONY: down-prod
down-prod:
	@echo "Building application and starting container..."
	docker compose -f docker compose-prod.yml down

.PHONY: build
build-prod:
	@echo "Re-building container and installing dependancies..."
	docker compose -f docker compose-prod.yml down && docker compose -f docker compose-prod.yml build --no-cache && docker compose -f docker compose-prod.yml up


.PHONY: up-deps
up-deps:
	@echo "Start dependencies..."
	docker compose -f docker/docker compose-deps.yml --env-file .env up -d

.PHONY: down-deps
down-deps:
	@echo "Start dependencies..."
	docker compose -f docker/docker compose-deps.yml --env-file .env down -v
# https://stackoverflow.com/a/6273809/1826109
%:
	@: