#!/bin/sh
BASIC_AUTH=$(echo "Boy65#Ship" | htpasswd -ni atc) \
WHITELABEL_ID=arbitragetheexchanges-com \
WHITELABEL_HOST=www.arbitragetheexchanges.com \
envtpl ./deployment.tpl.yaml