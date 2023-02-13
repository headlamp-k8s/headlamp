---
title: Frontend
weight: 5
---

The frontend is written in Typescript and React, as well as a few other important modules like:
* Material UI
* React Router
* Redux
* Redux Sagas

## Building and running

The frontend can be quickly built using:

```bash
make frontend
```

Once built, it can be run in development mode (auto-refresh) using:


```bash
make run-frontend
```

This command leverages the `create-react-app`'s start script that launches
a development server for the frontend (by default at `localhost:3000`).


## API documentation

API documentation for TypeScript is done with [typedoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://github.com/tgreyuk/typedoc-plugin-markdown), and is configured in tsconfig.json

```bash
make docs
```

The API output mardown is generated in docs/development/api and is not 
committed to git, but is shown on the website at
[headlamp/latest/development/api](https://kinvolk.io/docs/headlamp/latest/development/api/)


## Storybook

Components can be discovered, developed and tested inside the 'storybook'.

From within the [Headlamp](https://github.com/headlamp-k8s/headlamp/) repo run:

```bash
make storybook
```

If you are adding new stories, please wrap your story components with the `TestContext` helper
component as it sets up the store, memory router, and other utilities that may be needed for
current or future stories:

```jsx
<TestContext>
  <YourComponentTheStoryIsAbout />
</TestContext>
```

## Accessibility (a11y)

### Developer console warnings and errors

axe-core is used to detect some a11y issues at runtime when running
Headlamp in developer mode. This detects more issues than testing
components via eslint or via unit tests.

Any issues found are reported in the developer console.

To disable the alert message during development, use the following:
```bash
REACT_APP_SKIP_A11Y=true make run-frontend
```
