#!/bin/sh
# A humble test of the plugins/examples

set -e
set -o xtrace


cd ../examples
for i in * ; do
  if [ -d "$i" ]; then
    cd "$i"
    npm install
    npm run lint
    npm run format
    npm run build
    npm run tsc
    cd ..
  fi
done

