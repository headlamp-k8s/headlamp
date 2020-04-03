# Contribution Guidelines

This section serves as an introduction on how to contribute to Headlamp; getting started, development practices, filing issues, etc..
It assumes you have cloned this repository (or your own Github fork).

Any contributions to the project are accepted under the terms of the project's
license ([Apache 2.0](../LICENSE)).

## Filing an issue or feature request

Please use the [project's issue tracker](https://github.com/kinvolk/headlamp/issues) for filing any bugs you find or features
you think are useful.

### Complex contributions

If you have a complex contribution in mind (meaning changes in the architecture
or a lot of LOC changed), it is advisable to first file a Github issue and
discuss the implementation with the project's maintainers.

## Build the code

Headlamp is composed by a `backend` and a `frontend`.

You can build both the `backend` and `frontend` by running.

```bash
make
```

Or individually:

```bash
make backend
```

and

```bash
make frontend
```

## Run the code

The quickest way to get the `backend` and `frontend` running for development is
the following (respectively):

```bash
make run-backend
```

and in a different terminal instance:

```bash
make run-frontend
```

## Build a Docker image

The following command builds a Docker image for Headlamp from the current
source. It will run the `frontend` from a `backend`'s static server, and
options can be appended to the main command as arguments.

```bash
make image
```

### Coding style

The coding style for `backend` and `frontend` should be consistent.
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

The title of the commit message should be a brief _what_ the changes do.
The body of the commit message should be about _why_ the change was needed,
and it is needed almost all of the times, except for very obvious and small
changes (typos, lint fixes, etc.).

Keep commits atomic as much as possible, i.e. if there are changes that are
unrelated to the _why_ explanation for the commit, they probably belong to
another commit. This keeps things independent and easier to review (and
"independent" changes are not lost when a commit has to be reverted).

For anything that is not covered in this section, please refer to this
[article](https://chris.beams.io/posts/git-commit/) on how to write very good
 commit messages.

### Commit format

```
<area>: <Description of changes>

Detailed information about the commit message goes here
```

The `<area>` part of the commit for now is either `backend`, `frontend`, or
`docs`.

The title and body of the commit message should not exceed 72 characters in
length.

Please wrap the body of commit message at 72 chars.

Here are a few example commit messages:

Bad:
```
Fix dialog

Adds a cancel button to the dialog.
```

Good:
```
frontend: Add cancel button to the EditDialog

The EditDialog should have an explicit way to cancel the changes, so
these changes add a new button that will cancel the changes and close
the mentioned dialog.
```
