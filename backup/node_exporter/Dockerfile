FROM debian:bullseye-slim

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install wget

RUN rm -rf /var/lib/apt/lists/*

WORKDIR /
RUN wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
RUN tar xvfz node_exporter-1.7.0.linux-amd64.tar.gz

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
