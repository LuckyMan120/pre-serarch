#!/bin/bash
set -euo pipefail

fnName=$1

cd dist

entry=$(echo "${fnName%/}" | sed -r 's/(-|_)([a-z])/\U\2/g')

gcloud functions \
  deploy ${fnName%/} \
  --entry-point=${entry} \
  --runtime=nodejs10 \
  --trigger-http \
  --env-vars-file ../.env.yaml.local \
  --allow-unauthenticated
