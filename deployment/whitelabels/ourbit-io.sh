#!/bin/sh
BASIC_AUTH=$(echo "private!!!" | htpasswd -ni ourbit) \
WHITELABEL_ID=ourbit-io \
WHITELABEL_HOST=www.ourbit.io \
envtpl ./deployment.tpl.yaml