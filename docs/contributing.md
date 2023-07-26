---
title: Contribution Guidelines
linktitle: Contributing
---

This section has information on how to contribute to Headlamp. It assumes you have cloned
this repository (or your own Github fork).

Any contributions to the project are accepted under the terms of the project's
license ([Apache 2.0](../LICENSE)).

## Code of Conduct

Please refer to the Kinvolk [Code of Conduct](https://github.com/kinvolk/contribution/blob/master/CODE_OF_CONDUCT.md).

## Development practices

The Headlamp project follows the [Kinvolk Contribution Guidelines](https://github.com/kinvolk/contribution)
which promotes good and consistent contribution practices across Kinvolk's
projects. Before start contributing, and in addition to this section, please
read those guidelines.

## Filing an issue or feature request

Please use the [project's issue tracker](https://github.com/headlamp-k8s/headlamp/issues) for filing any bugs you find or features
you think are useful.

### Security issues

For filing security issues that are sensitive and should not be public, please
send an email to security@headlamp.dev .

## Translations

If you want to contribute to the internationalization of Headlamp, please refer to the
dedicated [i18n docs](./development/).

### Complex contributions

If you have a complex contribution in mind (meaning changes in the architecture
or a lot of LOC changed), it is advisable to first file a Github issue and
discuss the implementation with the project's maintainers.

## Coding style

The coding style for the `backend` and `frontend` should be consistent.
For helping and verifying that, we have go and js linters.

For linting the `backend` and `frontend`, use the following commands
(respectively):

```bash
make backend-lint
```

```bash
make frontend-lint
```

The linters are also run in the CI system, so any PRs you create will be
tested for compliance with the coding style.

To speed up a review from the project's maintainers, please make sure that
the CI checks are passing for your PR.

## Commit guidelines

For the general guidelines on making PRs/commits easier to review, please check
out Kinvolk's
[contribution guidelines on git](https://github.com/kinvolk/contribution/tree/master/topics/git.md).


## Testing

The frontend is tested via Storybook related snapshots. So new components should have
an associated story when possible.

For running the frontend tests, use the following command:

```bash
make frontend-test
```

The backend uses go's testing and can be run by using the following command:

```bash
make backend-test
```

Tests will run as part of the CI after a Pull Request is open.
