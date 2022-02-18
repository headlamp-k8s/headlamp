#!/bin/sh
# A simple test for the headlamp-plugin command line tool.
# Assumes being run within the plugins/headlamp-plugin folder

set -e
set -o xtrace

rm -rf headlamp-myfancy
rm -rf .plugins/headlamp-myfancy
rm -f kinvolk-headlamp-plugin-*.tgz


npm install

# Make a package file of headlamp-plugin we can test
npm run build
npm pack

# Use "link" to test the repo version of the headlamp-plugin tool.
npm link
node bin/headlamp-plugin.js create headlamp-myfancy --link
cd headlamp-myfancy
npm install ../kinvolk-headlamp-plugin-*.tgz

# test headlamp-plugin build
node ../bin/headlamp-plugin.js build
stat dist/main.js

# test headlamp-plugin build folder
cd ..
rm -rf headlamp-myfancy
node bin/headlamp-plugin.js create headlamp-myfancy --link
cd headlamp-myfancy
npm install ../kinvolk-headlamp-plugin-*.tgz
cd ..
node bin/headlamp-plugin.js build headlamp-myfancy
stat headlamp-myfancy/dist/main.js

# test extraction works
node bin/headlamp-plugin.js extract ./ .plugins
stat .plugins/headlamp-myfancy/main.js

# test format command and that default code is formatted correctly
rm -rf headlamp-myfancy
node bin/headlamp-plugin.js create headlamp-myfancy --link
cd headlamp-myfancy
npm install ../kinvolk-headlamp-plugin-*.tgz
npm run format

# test lint command and default code is lint free
npm run lint 
npm run lint-fix
