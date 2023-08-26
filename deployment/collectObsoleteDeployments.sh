#!/bin/sh
for FEATURE in $(kubectl get deployment -n ui-features | grep 'd$' | grep -v '\s*1d$' | grep -o 'terminal\S*')
do
  FEATURE=$(echo $FEATURE | sed "s/^terminal\-ui\-//") envtpl ./deployment.tpl.yaml | kubectl delete -f -
done