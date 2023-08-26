#!/bin/sh
BASIC_AUTH=$(echo "admin87" | htpasswd -ni admin) \
WHITELABEL_ID=bctotc-io \
WHITELABEL_HOST=www.bctotc.io \
envtpl ./deployment.tpl.yaml