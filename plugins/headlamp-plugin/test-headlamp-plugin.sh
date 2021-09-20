#!/bin/sh
# A simple test for the headlamp-plugin command line tool.
# Assumes being run within the plugins/headlamp-plugin folder

set -e
rm -rf headlamp-myfancy

npm install
# Use "link" to test the repo version of the headlamp-plugin tool.
npm link
node bin/headlamp-plugin.js create --link headlamp-myfancy
cd headlamp-myfancy
npm run build
stat dist/main.js
cd ..
rm -rf headlamp-myfancy
node bin/headlamp-plugin.js create --link headlamp-myfancy
node bin/headlamp-plugin.js build headlamp-myfancy
stat headlamp-myfancy/dist/main.js
