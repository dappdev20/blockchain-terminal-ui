#!/bin/sh
BASIC_AUTH=$(echo "Cup2)Study" | htpasswd -ni planetcryptos) \
WHITELABEL_ID=planetcryptos-net \
WHITELABEL_HOST=www.planetcryptos.net \
DOCKER_TAG=develop \
KEEL_POLICY=force \
envtpl ./deployment.tpl.yaml