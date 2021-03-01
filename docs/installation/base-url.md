---
title: Run Headlamp with a base-url
linkTitle: Base URL
---

Normally Headlamp runs at the root of the domain. Hower you can also ask 
to run it at a base-url like "/headlamp" for example.

- default at the root of the domain: `http://headlamp.example.com/`.
- base-url `http://example.com/headlamp/` 


## How to use with a base-url


### Dev mode

```bash
./backend/server -dev -base-url /headlamp
PUBLIC_URL="/headlamp" make run-frontend
```

Then go to http://localhost:3000/headlamp/ in your browser.


### Static build mode

```bash
cd frontend && npm install && npm run build && cd ..
./backend/server -dev -base-url /headlamp -html-static-dir frontend/build
```

Then go to http://localhost:4466/headlamp/ in your browser.


### Docker mode

Append `--base-url /headlamp` to the docker run command. Note the extra "-".


### Kubernetes

You can modify your kubernetes deployment file to add `-base-url /headlamp`
to the containers args.

```yaml
        args:
          - "-in-cluster"
          - "-plugins-dir=/headlamp/plugins"
          - "-base-url=/headlamp"
```
