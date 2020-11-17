# Headlamp <img align="right" width=384 src="docs/headlamp_light.svg">

Headlamp is an easy-to-use and extensible Kubernetes web UI.

Headlamp was created to be a Kubernetes web UI that has the traditional functionality of other
web UIs/dashboards available (i.e. to list and view resources) as well as other features.

<div align="center">
  <img src="https://raw.githubusercontent.com/kinvolk/headlamp/screenshots/videos/headlamp_quick_run.gif" width="80%">
</div>

## Features

  * Vendor independent / generic Kubernetes UI
  * UI controls reflecting user roles (no deletion/update if not allowed)
  * Multi-cluster
  * Extensible through plugins
  * Clean & modern UI
  * Works in-cluster, or locally as a desktop app
  * Cancellable creation/update/deletion operations
  * Logs, exec, and resource editor with documentation
  * Read-write / interactive (actions based on permissions)

## Screenshots

<table>
    <tr>
        <td width="33%"><img src="https://raw.githubusercontent.com/kinvolk/headlamp/screenshots/screenshots/cluster_overview.png"></td>
        <td width="33%"><img src="https://raw.githubusercontent.com/kinvolk/headlamp/screenshots/screenshots/cluster_chooser.png"></td>
    </tr>
    <tr>
        <td width="33%"><img src="https://raw.githubusercontent.com/kinvolk/headlamp/screenshots/screenshots/nodes.png"></td>
        <td width="33%"><img src="https://raw.githubusercontent.com/kinvolk/headlamp/screenshots/screenshots/resource_edition.png"></td>
    </tr>
    <tr>
        <td width="33%"><img src="https://raw.githubusercontent.com/kinvolk/headlamp/screenshots/screenshots/editor_documentation.png"></td>
        <td width="33%"><img src="https://raw.githubusercontent.com/kinvolk/headlamp/screenshots/screenshots/terminal.png"></td>
    </tr>
</table>

## Quickstart

If you want to deploy Headlamp in your cluster, check out the instructions on running it [in-cluster](https://kinvolk.io/docs/headlamp/latest/installation/in-cluster/).

If you have a kube config already, you can quickly try Headlamp locally as a
[desktop application](https://kinvolk.io/docs/headlamp/latest/installation/desktop/). **Make sure** you have a kube config
set up with your favorite clusters and in the default path so Headlamp can use it.

### Accessing

Headlamp uses [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac) for checking
whether and how users can access resources. If you try Headlamp with a token that has very limited
permissions, you may not be able to view your cluster resources correctly.

See the documentation on [how to easily get a Service Account token](https://kinvolk.io/docs/headlamp/latest/installation#create-a-service-account-token) for your cluster.

## Get involved

Check out our [guidelines](https://kinvolk.io/docs/headlamp/latest/contributing/) on how to contribute to the project.

## Roadmap

If you are interested in the direction of the project, we maintain a
[Roadmap](https://github.com/kinvolk/headlamp/projects/2) for it with the
biggest changes planned so far.

## License

Headlamp is released under the terms of the [Apache 2.0](./LICENSE) license.
