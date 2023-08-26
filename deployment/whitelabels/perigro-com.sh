#!/bin/sh
BASIC_AUTH=$(echo "Big6*deep*" | htpasswd -ni demo) \
WHITELABEL_ID=perigro-com \
WHITELABEL_HOST=www.perigro.com \
envtpl ./deployment.tpl.yaml