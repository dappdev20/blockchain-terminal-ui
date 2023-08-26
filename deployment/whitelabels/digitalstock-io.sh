#!/bin/sh
BASIC_AUTH=$(echo "admin74" | htpasswd -ni admin) \
WHITELABEL_ID=digitalstock-io \
WHITELABEL_HOST=www.digitalstock.io \
envtpl ./deployment.tpl.yaml
