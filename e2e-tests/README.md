# end to end tests with playwright and minikube

```
npx playwright install
```

The instructions below assume Headlamp is running in-cluster with minikube.

```bash
minikube addons enable headlamp
minikube service headlamp -n headlamp

# run in a separate terminal...
export HEADLAMP_TEST_URL= # from the "minikube service headlamp -n headlamp" command directly above.
export HEADLAMP_TOKEN=$(kubectl create token headlamp --duration 24h -n headlamp)

# To see the token to login via the web browser
echo $HEADLAMP_TOKEN
```


Now with those two environment variables set we can run the tests.

```bash
npx playwright test
```

## Run a single test

You can run a single test with the grep flag:

```shell
npx playwright test -g "404 page is present"
```

## If there is a failure, run it in a real browser?

```shell
npx playwright test -g "404 page is present" --headed
```
