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
	mkdir -p ./postgresql/data
	chmod 700 ./postgresql/data
	$(DOCKER_COMPOSE) up -d --build


down:  ## Stop and remove the containers
	$(DOCKER_COMPOSE) down -v

clean: down

fclean: clean
	docker system prune -f --volumes
	docker network prune -f
	docker volume prune -f
	docker image prune -a -f
	docker container prune -f

reset_db: fclean
	rm -rf postgresql/data
	rm -rf grafana/data/grafana.db
	rm -rf django/frontend/migrations/0001_initial.py

remake: reset_db up

re: down clean up

handle_error:
	@make remake
	@exit 42