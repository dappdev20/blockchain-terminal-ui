#!/bin/sh
BASIC_AUTH=$(echo "One80*Bag*" | htpasswd -ni mctp) \
WHITELABEL_ID=mycryptotradingplatform-com \
WHITELABEL_HOST=www.mycryptotradingplatform.com \
envtpl ./deployment.tpl.yaml