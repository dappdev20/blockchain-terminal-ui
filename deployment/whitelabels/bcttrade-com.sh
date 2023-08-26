#!/bin/sh
BASIC_AUTH=$(echo "Per66&such" | htpasswd -ni bcttrade-com) \
WHITELABEL_ID=bcttrade-com \
WHITELABEL_HOST=www.bcttrade.com \
envtpl ./deployment.tpl.yaml