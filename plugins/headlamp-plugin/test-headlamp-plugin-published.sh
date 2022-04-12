#!/bin/sh
# Tests published @kinvolk/headlamp-plugin package.
#
# ./test-headlamp-plugin-published.sh 0.4.1-rc1
#
# Assumes being run within the plugins/headlamp-plugin folder

set -e
set -o xtrace

plugin_version=$1
if [ ! -z $1 ]; then
    echo "Testing plugin_version:$plugin_version"
else
    echo ""
    echo "plugin_version as first argument required. Example: 0.4.1-rc1"
    echo ""
    exit 1
fi

# To make sure there's no package.json affecting things go to
cd /tmp
TMPDIR=$(mktemp -d)
echo $TMPDIR
mkdir -p $TMPDIR
cd $TMPDIR
# clean up tmp folder on exit
trap "exit 1"           HUP INT PIPE QUIT TERM
trap 'echo Cleaning up tmp folder:"$TMPDIR" && rm -rf "$TMPDIR"' EXIT

npm install @kinvolk/headlamp-plugin@$plugin_version

npx @kinvolk/headlamp-plugin create headlamp-myfancy
cd headlamp-myfancy

# test headlamp-plugin build
npm run build
stat dist/main.js

# test headlamp-plugin build folder
cd ..
rm -rf headlamp-myfancy
npx @kinvolk/headlamp-plugin create headlamp-myfancy
npx @kinvolk/headlamp-plugin build headlamp-myfancy
stat headlamp-myfancy/dist/main.js

# test extraction works
npx @kinvolk/headlamp-plugin extract ./ .plugins
stat .plugins/headlamp-myfancy/main.js

# test format command and that default code is formatted correctly
rm -rf headlamp-myfancy
npx @kinvolk/headlamp-plugin create headlamp-myfancy
cd headlamp-myfancy
npm run format

# test lint command and default code is lint free
npm run lint 
npm run lint-fix

# test type script error checks
npm run tsc
