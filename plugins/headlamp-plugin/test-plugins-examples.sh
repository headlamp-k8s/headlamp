#!/bin/sh
# A humble test of the plugins/examples

set -e
set -o xtrace

# rm -f kinvolk-headlamp-plugin-*.tgz
npm run build
npm pack

cd ../examples
for i in * ; do
  if [ -d "$i" ]; then
    cd "$i"
    npm install
    # Use dev headlamp-plugin
    npm install `ls -t ../../headlamp-plugin/kinvolk-headlamp-plugin-*.tgz | head -1`
    npm run lint
    npm run format
    npm run build
    npm run tsc
    cd ..
  fi
done

