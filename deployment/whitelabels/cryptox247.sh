#!/bin/sh
BASIC_AUTH=$(echo "Seat93[Sum" | htpasswd -ni cryptox) \
WHITELABEL_ID=cryptox247-io \
WHITELABEL_HOST=www.cryptox247.io \
envtpl ./deployment.tpl.yaml
echo "---"
BASIC_AUTH=$(echo "Seat93[Sum" | htpasswd -ni cryptox) \
WHITELABEL_ID=cryptox247-com \
WHITELABEL_HOST=www.cryptox247.com \
envtpl ./deployment.tpl.yaml

