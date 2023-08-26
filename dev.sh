#!/bin/sh
if [ ! -f .cache/tls/dev.bct.trade.crt ]; then
  docker-compose up self-signed-certificate-generator
fi

docker-compose up nginx bct-development