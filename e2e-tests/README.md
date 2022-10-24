# end to end tests with playwright and minikube

```bash
HEADLAMP_TEST_URL=http://localhost:3000 HEADLAMP_TOKEN=... npx playwright test
```

The instructions below assume Headlamp is running in-cluster with minikube.

```bash
minikube addons enable headlamp
minikube service headlamp -n kube-system --url

# run in a separate terminal...
export HEADLAMP_TEST_URL= # from the command directly above.
export HEADLAMP_TOKEN=$(kubectl create token headlamp --duration 24h -n headlamp)
```
