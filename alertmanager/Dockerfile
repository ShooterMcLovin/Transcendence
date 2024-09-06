FROM debian:bullseye-slim

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install prometheus-alertmanager

RUN rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/alertmanager/

COPY alertmanager.yml /etc/alertmanager/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
