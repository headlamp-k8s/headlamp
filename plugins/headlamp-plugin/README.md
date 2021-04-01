# @kinvolk/headlamp-plugin

The needed infrastructure for building Headlamp plugins. 
Headlamp plugins depend on this package.

See the [Headlamp plugins documentation on the web](
https://kinvolk.io/docs/headlamp/latest/development/plugins/)

This package is published to the npm package index separately from Headlamp.

## Commands

```
headlamp-plugin --help
headlamp-plugin build <package>   Build the plugin, or folder of
                                  plugins. <package> defaults to
                                  current working directory.
headlamp-plugin start             Watch for changes and build the plugin
headlamp-plugin create <name>     Create a new plugin folder with base code
headlamp-plugin extract           Copies folders of packages from plug
<pluginPackages> <outputPlugins>  inPackages/packageName/dist/main.js
                                  to outputPlugins/packageName/main.js
```

## Development notes

### How to test local changes

To test the usage of `npx @kinvolk/headlamp-plugin create myplugin` with 
local changes you not only need to `npm link` from inside the headlamp-plugin
package folder. You need to modify the bin/headlamp-plugin.js@create
function to call a `npm link @kinvolk/headlamp-plugin` before it 
calls `npm install` (from inside `headlamp-plugin create`). 
Uncomment the line that looks like this:

```javascript
const proc1 = child_process.spawnSync('npm', ['link', '@kinvolk/headlamp-plugin'], {cwd: dstFolder});
```

Whilst npx uses linked packages by default, npm install requires that you first use
`npm link packageName`. See the [npm link docs](
https://docs.npmjs.com/cli/v7/commands/npm-link) for more info on npm link.
