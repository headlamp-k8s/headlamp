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


## Build the app

You can build the app for Linux, Windows or Mac.

Do so on the platform you are building for. That is build the mac app on a Mac, 
and the linux app on a linux box.

First we need to 
```bash
make backend frontend
```

Then choose the relevant command.

```bash
make app-linux
```

```bash
make app-windows
```

```bash
make app-mac
```

See the generated app files in app/dist/


## Build a container image

The following command builds a container image for Headlamp from the current
source. It will run the `frontend` from a `backend`'s static server, and
options can be appended to the main command as arguments.

```bash
make image
```


### Running the container image

With docker you can run the Headlamp image(`ghcr.io/kinvolk/headlamp:latest`).
Note, the mount arguments add folders that are referenced in the ~/.kube
folders - you may need to add other folders if your config refers
to more folders.

```bash
docker run --network="host" -p 127.0.0.1:4466:4466/tcp --mount type=bind,source="/home/rene/.minikube",target=$HOME/.minikube --mount type=bind,source="$HOME/.kube",target=/root/.kube ghcr.io/kinvolk/headlamp:latest /headlamp/server -html-static-dir /headlamp/frontend -plugins-dir=/headlamp/plugins
```

If you want to make a new container image called `kinvolk/headlamp:development`
you can run it like this:

```bash
$ DOCKER_IMAGE_VERSION=development make image
...
Successfully tagged kinvolk/headlamp:development

$ docker run --network="host" -p 127.0.0.1:4466:4466/tcp --mount type=bind,source="/home/rene/.minikube",target=$HOME/.minikube --mount type=bind,source="$HOME/.kube",target=/root/.kube kinvolk/headlamp:development /headlamp/server -html-static-dir /headlamp/frontend -plugins-dir=/headlamp/plugins
```

Then go to https://localhost:4466 in your browser.


### Minikube "in-cluster"

These instructions are for if you want to use Headlamp running "in-cluster",
and test it locally on minikube with a local container image.

We assume you've already setup a minikube
(probably with `minikube start --driver=docker`).


#### Container image in the minikub docker environment

First we have to make the container image in the minikube docker environment.
This is needed because minikube looks for container images in there, not
ones made in the local docker environment.

```bash
$ eval $(minikube docker-env)
$ DOCKER_IMAGE_VERSION=development make image
```


#### Create a deployment yaml.

```bash
$ kubectl create deployment headlamp -n kube-system --image=kinvolk/headlamp:development -o yaml --dry-run -- /headlamp/server -html-static-dir /headlamp/frontend -in-cluster -plugins-dir=/headlamp/plugins > minikube-headlamp.yaml
```

To use the local container image we change the `imagePullPolicy` to Never.
Making kubectl use local images - which is what you want in development.


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: headlamp
  name: headlamp
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: headlamp
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: headlamp
    spec:
      containers:
      - command:
        - /headlamp/server
        - -html-static-dir
        - /headlamp/frontend
        - -in-cluster
        - -plugins-dir=/headlamp/plugins
        image: kinvolk/headlamp:development
        name: headlamp
        imagePullPolicy: Never
        resources: {}
status: {}
```

Now we create the deployment.

```bash
$ kubectl apply -f minikube-headlamp.yaml
```

Then we expose the deployment, and get a URL where we can see it.

```bash
$ kubectl expose deployment headlamp -n kube-system --type=NodePort --port=4466
service/headlamp exposed

$ kubectl get service headlamp -n kube-system
NAME       TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
headlamp   NodePort   10.99.144.210   <none>        4466:30712/TCP   6m57s

$ minikube service headlamp -n kube-system --url
http://192.168.49.2:30342
```

Go to the URL printed by minikube in your browser, and get your token to login.


### Shipping plugins in the Docker image

Since the Headlamp server has an option (`-plugins-dir`) for indicating where to find any plugins,
a deployment of Headlamp using the Docker image can mount a plugins folder
and point to it by using the mentioned option.

An alternative is to build an image that ships some plugins in it. For that,
just create a ".plugins" folder in the Headlamp project directory as the Dockerfile
will include it and point to it by default.
