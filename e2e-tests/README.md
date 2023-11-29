# end to end tests with playwright and minikube

## Running e2e tests

These instructions assume Headlamp is running locally 
in development mode (with make run-backend & make run-frontend)

```bash
cd e2e-tests && npx playwright test
```

You can also test using a token, and change the cluster name too:
```bash
HEADLAMP_E2E_CLUSTER_NAME=my-little-cluster \
HEADLAMP_E2E_TEST_URL=http://localhost:3000 \
HEADLAMP_E2E_TOKEN=... \
npx playwright test
```

The tests are run on CI within .github/build-container.yml

## Writing e2e Tests

See [Writing Tests](https://playwright.dev/docs/writing-tests) playwright documentation.

