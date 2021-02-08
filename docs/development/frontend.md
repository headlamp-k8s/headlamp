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



## Dependencies

Here's a map of some dependencies we use, and why.


### material-ui

[Material-UI](https://material-ui.com/) is used for GUI components.

- src/components

[Material-UI lab](https://material-ui.com/components/about-the-lab/) is
used for a couple of components.

- frontend/src/components/common/EditorDialog.tsx TreeItem
- frontend/src/components/common/Autocomplete.tsx Autocomplete


### iconify

[iconify](https://github.com/iconify/iconify) is an icon framework we use.

- [@iconify/react](https://github.com/iconify/iconify/tree/master/packages/react)
- [@iconify/icons-mdi](https://www.npmjs.com/package/@iconify/icons-mdi) is the material design icon set we use.

There is also a website where you can 
[view the materialdesignicons](https://materialdesignicons.com/).


### redux

[Redux](https://redux.js.org/) is used for state management in the app.

- headlamp/frontend/src/redux
- @types/react-redux
- react-redux

### react-router

[react-router](https://reactrouter.com/) is used for navigational components.

- src/lib/router.tsx


### http-proxy-middleware

Used to proxy '/plugins' to http://localhost:4466' in development

headlamp/frontend/src/setupProxy.js is a file used by Create React App for dev proxy setup.
https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually

Could potentially be replaced with a package.json option.
```
  "proxy": "http://localhost:4466",
```

### semver

Used for comparing git versions.

- headlamp/frontend/src/components/Sidebar.tsx
- headlamp/frontend/src/lib/router.tsx (not used?)


### storybook

[Storybook](https://storybook.js.org/) is used for creating a style guide,
component documentation, and in the future automated regression testing.

Stories for a component live next to it within a "stories.tsx" file.
Component.stories.tsx

It's also possible to write .mdx files with more markdown.

- @storybook/addon-actions
- @storybook/addon-essentials
- @storybook/addon-links
- @storybook/node-logger
- @storybook/react


### Xterm.js

[Xterm.js](https://github.com/xtermjs/xterm.js#readme) is used to bring a
fully-featured terminal.

- frontend/src/components/common/Terminal.tsx


### ansi-to-react

[ansi-to-react](https://github.com/nteract/ansi-to-react#readme) is used for
log viewing with ansi colors.

- frontend/src/components/common/LogViewer.tsx


### Recharts

[Recharts](https://github.com/recharts/recharts) is used for our charts.

frontend/src/components/common/Chart.tsx


### js-yaml

[js-yaml](https://github.com/nodeca/js-yaml#readme) the parser/writer for yaml which 
is used for viewing and editing yaml. 

frontend/src/components/common/EditorDialog.tsx


### js-base64

[js-base64](https://github.com/dankogai/js-base64#readme) and 
[@types/js-base64](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/js-base64) 
are used for viewing base 64 encoded data.

- frontend/src/components/common/Resource.tsx
- frontend/src/lib/k8s/pod.ts


### javascript-time-ago

[javascript-time-ago](https://github.com/catamphetamine/javascript-time-ago#readme) 
is used for human readable times like "5 days".

- headlamp/frontend/src/lib/util.ts


### notistack

[notistack](https://iamhosseindhv.com/notistack/demos) we use for displaying
notifications.

- frontend/src/redux/actions/actions.tsx
- frontend/src/components/common/ActionsNotifier.tsx
- frontend/src/components/Sidebar.tsx
- frontend/src/redux/actions/actions.tsx


### @apidevtools/swagger-parser

[@apidevtools/swagger-parser](https://apitools.dev/swagger-parser/) is an API 
schema parser/validator for Swagger and OpenAPI

We use it to get documentation about different Kubernetes items to present to people
in the EditorDialog.

- frontend/src/lib/docs.ts


### react-scroll

[react-scroll](https://github.com/fisshy/react-scroll#readme) is a component 
for animating vertical scrolling.


### react-scripts

[react-scripts](https://github.com/facebook/create-react-app#readme) is 
part of the Create React App framework we use.
It handles lots of configuration for us.


### react-hotkeys-hook

[react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook#readme) 
is a React hook for using keyboard shortcuts in components.

- frontend/src/components/cluster/Chooser.tsx
- frontend/src/components/common/SectionFilterHeader.tsx


### monaco-editor

[The Monaco Editor](https://microsoft.github.io/monaco-editor/) is the code editor 
that powers VS Code.

- frontend/src/components/common/EditorDialog.tsx
- frontend/src/components/common/Resource.tsx
