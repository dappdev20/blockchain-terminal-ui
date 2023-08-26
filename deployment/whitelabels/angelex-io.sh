#!/bin/sh
BASIC_AUTH=$(echo "Pay67:Swim" | htpasswd -ni angelex) \
WHITELABEL_ID=angelex-io \
WHITELABEL_HOST=www.angelex.io \
envtpl ./deployment.tpl.yaml