COMPOSE_FILE := ./docker-compose.yml
DOCKER_COMPOSE := docker-compose -f $(COMPOSE_FILE)

# Default target
.DEFAULT_GOAL := up
SHELLFLAGS = -e -u
SHELL := /bin/bash

build:  ## Build the Docker image
	$(DOCKER_COMPOSE) build
	
compose:
	$(DOCKER_COMPOSE) up

up:  ## Build and start the containers in detached mode
	mkdir -p django/media
	chmod +x django/docker-entrypoint.sh
	mkdir -p postgresql/data
	$(DOCKER_COMPOSE) up -d --build


down:  ## Stop and remove the containers
	$(DOCKER_COMPOSE) down -v

clean: ## Remove all stopped containers, networks, and volumes
	$(DOCKER_COMPOSE) down -v
	docker system prune -f --volumes
	docker network prune -f
	docker volume prune -f
	docker image prune -a -f
	docker container prune -f

fclean: down clean
	rm -rf postgresql/data

re: down clean up

handle_error:
	@make down
	@exit 42