#!/bin/sh
# A simple test for the headlamp-plugin command line tool.
# Assumes being run within the plugins/headlamp-plugin folder

set -e
set -o xtrace

rm -rf headlamp-myfancy
rm -rf .plugins/headlamp-myfancy


npm install
# Use "link" to test the repo version of the headlamp-plugin tool.
npm link
node bin/headlamp-plugin.js create headlamp-myfancy
cd headlamp-myfancy
npm link @kinvolk/headlamp-plugin

# test headlamp-plugin build
node ../bin/headlamp-plugin.js build
stat dist/main.js

# test headlamp-plugin build folder
cd ..
rm -rf headlamp-myfancy
node bin/headlamp-plugin.js create headlamp-myfancy
cd headlamp-myfancy
npm link @kinvolk/headlamp-plugin
cd ..
node bin/headlamp-plugin.js build headlamp-myfancy
stat headlamp-myfancy/dist/main.js

# test extraction works
node bin/headlamp-plugin.js extract ./ .plugins
stat .plugins/headlamp-myfancy/main.js
