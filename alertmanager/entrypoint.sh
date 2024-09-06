#!/bin/sh

sed -i "s|\${TO_REPLACE}|$ALERT_WEBHOOK|g" /etc/alertmanager/alertmanager.yml

exec prometheus-alertmanager --config.file=/etc/alertmanager/alertmanager.yml
