#!/bin/sh
BASIC_AUTH=$(echo "admin33" | htpasswd -ni admin) \
WHITELABEL_ID=crypterminal-io \
WHITELABEL_HOST=www.crypterminal.io \
envtpl ./deployment.tpl.yaml
echo "---"
BASIC_AUTH=$(echo "admin33" | htpasswd -ni admin) \
WHITELABEL_ID=crypterminal-com \
WHITELABEL_HOST=www.crypterminal.com \
envtpl ./deployment.tpl.yaml