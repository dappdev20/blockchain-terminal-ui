#!/bin/sh
BASIC_AUTH=$(echo "Heat7-Us--" | htpasswd -ni cryptolabb) \
WHITELABEL_ID=cryptolabb-com \
WHITELABEL_HOST=terminal.cryptolabb.com \
envtpl ./deployment.tpl.yaml