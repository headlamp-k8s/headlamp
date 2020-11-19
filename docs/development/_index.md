---
title: Development
---

This is a quickstart guide for building and running Headlamp for development.

Please make sure you read the [Contribution Guidelines](../contributing.md) as well
before starting to contribute to the project.

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

### Shipping plugins in the Docker image

Since the Headlamp server has an option (`-plugins-dir`) for indicating where to find any plugins,
a deployment of Headlamp using the Docker image can mount a plugins folder
and point to it by using the mentioned option.

An alternative is to build an image that ships some plugins in it. For that,
just create a plugins folder in the Headlamp project directory as the Dockerfile
will include it and point to it by default.
