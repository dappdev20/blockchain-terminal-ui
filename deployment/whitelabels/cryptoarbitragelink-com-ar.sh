#!/bin/sh
BASIC_AUTH=$(echo "Eye2{May{{" | htpasswd -ni cryptoarb) \
WHITELABEL_ID=cryptoarbitragelink-com-ar \
WHITELABEL_HOST=www.cryptoarbitragelink.com.ar \
envtpl ./deployment.tpl.yaml