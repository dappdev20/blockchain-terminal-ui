#!/bin/sh
BASIC_AUTH=$(echo "wave68&Row" | htpasswd -ni mycryptolabs) \
WHITELABEL_ID=mycryptolabs-ca \
WHITELABEL_HOST=www.mycryptolabs.ca \
envtpl ./deployment.tpl.yaml
echo "---"
BASIC_AUTH=$(echo "wave68&Row" | htpasswd -ni mycryptolabs) \
WHITELABEL_ID=crypto273-com \
WHITELABEL_HOST=www.crypto273.com \
envtpl ./deployment.tpl.yaml
