---
title: Contribution Guidelines
sidebar_label: Contributing
sidebar_position: 4
---

This section has information on how to contribute to Headlamp. It assumes you have cloned
this repository (or your own Github fork).
Any contributions to the project are accepted under the terms of the project's
license ([Apache 2.0](https://github.com/headlamp-k8s/headlamp/blob/main/LICENSE)).

## Code of Conduct

Please refer to the Kinvolk [Code of Conduct](https://github.com/kinvolk/contribution/blob/master/CODE_OF_CONDUCT.md).

## Development practices

The Headlamp project follows the [Kinvolk Contribution Guidelines](https://github.com/kinvolk/contribution),
which promotes good and consistent contribution practices across Kinvolk's
projects. Before starting to contribute, and in addition to this section, please
read those guidelines.

## Community Monthly Call

We hold a monthly call to discuss the project, the roadmap, and the community.

You can find Headlamp's list of upcoming events in its [CNCF calendar](https://zoom-lfx.platform.linuxfoundation.org/meetings/headlamp?view=list).

The next Community Call will be held on October 24th, 2024 at [5:00 PM CEST](https://zoom-lfx.platform.linuxfoundation.org/meetings/headlamp?view=month&occurrence=1729782000).

## Filing an issue or feature request

Please use the [project's issue tracker](https://github.com/headlamp-k8s/headlamp/issues) for filing any bugs you find or features
you think are useful.

### Guidelines for Submitting an Issue

When submitting an issue, follow these guidelines to help maintainers address it efficiently:

**Search for Existing Issues:**

- Use the issue tracker to see if your issue already exists. If it does, consider adding your input to the existing issue instead of opening a new one.
- Use the template for issues depending on if the issue is a bug or feature

### Security issues

For filing security issues that are sensitive and should not be public, please
send an email to <security@headlamp.dev> .

## Submitting a Pull Request (PR)

Follow these steps when submitting a PR to ensure it meets the project’s standards.

### 1. Run Tests and Format Your Code

Navigate to the `frontend` folder and run the following commands:

- `cd frontend`
- `npm run test` – Run the test suite.
- `npm run tsc` – Check for TypeScript errors.
- `npm run format` – Format your code to match the project’s style.

These steps ensure your code is functional, well-typed, and formatted consistently.

---

### 2. Follow Commit Guidelines

Use **atomic commits** to keep each commit focused on a single change. Follow this structure for your commit messages:

We accept scope formats written in paring of `broad scope` and `location scope` for the project, alternatively we also accept just the `broad scope`.

`<scope>: <concise description>`

Both the title and the body of the commit message shoud not exceed
72 characters in length.
i.e. Please keep the title length under 72
characters, and the wrap the body of the message at 72 characters.

#### Examples:

**Good**

- `frontend HomeButton: Fix home button not navigating home`
- `backend: Add new API route for Helm chart details`

**Bad**

- `updates the manifest`
- `Init feature added.`
- `this adds new colors to the dashboard`

For more detailed commit practices, see Kinvolk's [Git contribution guidelines](https://github.com/kinvolk/contribution/tree/master/topics/git.md).

---

### 3. Write a Descriptive PR Description

When opening a PR, make sure to:

- **Summarize your changes** and **why** they are needed.
- **Link to the related issue** via `fixes #ISSUE_NUMBER`, if applicable.
- **Provide steps to test** the changes.

Example:

**This PR fixes the home button bug where the button did not navigate back to the homepage.**

**Steps to Test:**

1. Click on the 'Home' button in the sidebar.
2. Verify that it navigates to the main screen.

---

### 4. Use Labels for Organization

Add relevant labels to your PR to help with triaging and prioritization:

Example:

- enhancement
- documentation

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

## Complex contributions

If you have a complex contribution in mind (meaning changes in the architecture
or a lot of LOC changed), it is advisable to first file a GitHub issue and
discuss the implementation with the project's maintainers via [#headlamp](https://kubernetes.slack.com/messages/headlamp) Slack channel.

## Translations

If you want to contribute to the internationalization of Headlamp, please refer to the
dedicated [i18n docs](./development/).

## Commit guidelines

For general guidelines on making PRs/commits easier to review, please check
out Kinvolk's
[contribution guidelines on git](https://github.com/kinvolk/contribution/tree/master/topics/git.md).

## Testing

The frontend is tested via Storybook-related snapshots. So new components should have
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
