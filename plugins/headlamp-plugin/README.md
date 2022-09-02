# @kinvolk/headlamp-plugin

The needed infrastructure for building Headlamp plugins.
Headlamp plugins depend on this package.

See the [Headlamp plugins documentation on the web](https://kinvolk.io/docs/headlamp/latest/development/plugins/)

This package is published to the npm package index separately from Headlamp.

## Commands

```
headlamp-plugin --help
headlamp-plugin create <name>     Create a new plugin folder with base code
headlamp-plugin build <package>   Build the plugin, or folder of
                                  plugins. <package> defaults to
                                  current working directory.
headlamp-plugin start             Watch for changes and build the plugin
headlamp-plugin upgrade <package> Upgrade the plugin to latest headlamp-plugin.
                                  Audits, formats, lints and type checks.
                                  <package> defaults to current working
                                  directory. Can also be a folder of packages.
headlamp-plugin extract           Copies folders of packages from plug
<pluginPackages> <outputPlugins>  inPackages/packageName/dist/main.js
                                  to outputPlugins/packageName/main.js
```

## Development notes

### Generate types

`@kinvolk/headlamp-plugin` ships type declarations from the `frontend` module.
To generate the declarations, run `npm run build`.

### How to test local changes to headlamp-plugin

Developing headlamp-plugin itself? Want to test your changes?

#### Integration tests

See test-headlamp-plugin.js for some basic integration tests.

See test-headlamp-plugin-published.js for testing published packages.

#### linking to use local version of headlamp-plugin

Use your changes inside a plugin with an npm feature called linking:

1. Run `npm link` within the src/plugins/headlamp-plugins folder.
2. Create the plugin with link: `npx --yes @kinvolk/headlamp-plugin create myplugin --link`
3. Develop your plugin using your local headlamp-plugin changes.

This internally does a `npm link @kinvolk/headlamp-plugin`, so the development
version is linked rather than using a released version from npm.

Why is this needed? Whilst npx uses linked packages by default,
npm install requires that you first use `npm link packageName`. See the
[npm link docs](https://docs.npmjs.com/cli/v7/commands/npm-link)
for more info on npm link.

##### Testing "headlamp-plugin create" changes

For the "create" command npx and linking doesn't work. Instead, for this one command,
you can call the script directly.

```bash
cd plugins/headlamp-plugin
node ./bin/headlamp-plugin.js create myplugin --link
```
