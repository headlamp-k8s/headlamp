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
