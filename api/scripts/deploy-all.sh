#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

fnDist="dist/src/functions"
cd $fnDist
for fn in */; do
  FNS+=(${fn%?})
done
cd ../../../

cp package.json dist/package.json

printf "%s\n" "${FNS[@]}" | cut -d' ' -f1 | xargs -n 1 -L 1 -P 25 -I {} bash -c "${DIR}/deploy.sh \$1" _ {}