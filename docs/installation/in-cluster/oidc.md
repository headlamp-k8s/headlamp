---
title: Accessing using OpenID Connect
sidebar_label: OIDC
---

Headlamp supports OIDC for cluster users to effortlessly log in using a "Sign in" button.

![screenshot the login dialog for a cluster](./oidc_button.png)

To use OIDC, Headlamp needs the following arguments from your OIDC provider:

- the client ID: `-oidc-client-id` or env var `HEADLAMP_CONFIG_OIDC_CLIENT_ID`
- the client secret: `-oidc-client-secret` or env var `HEADLAMP_CONFIG_OIDC_CLIENT_SECRET`
- the issuer URL: `-oidc-idp-issuer-url` or env var `HEADLAMP_CONFIG_OIDC_IDP_ISSUER_URL`
- (optionally) the callback URL: `-oidc-callback-url` or env var `HEADLAMP_CONFIG_OIDC_CALLBACK_URL`
- (optionally) the OpenID scopes: `-oidc-scopes` or env var `HEADLAMP_CONFIG_OIDC_SCOPES`

### Callback URL

You must tell your OIDC provider the callback URL that Headlamp will use after login. This is your Headlamp URL plus `/oidc-callback`, for example:

```
https://YOUR_URL/oidc-callback
```

> **Note:** If you're running Headlamp behind an ingress or load balancer (e.g., NGINX, AWS ALB/NLB), make sure it forwards the `X-Forwarded-Proto` header. Otherwise, Headlamp may generate the callback URL using `http` instead of `https`, which can cause a mismatch with your OIDC provider.
>
> For [NGINX ingress](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), you can add:
>
> ```yaml
> nginx.ingress.kubernetes.io/configuration-snippet: |
>   proxy_set_header X-Forwarded-Proto $scheme;
> ```

### Provider logout

Provider logout targets Headlamp's server-owned OIDC contexts, including the
single-provider in-cluster configuration. Stateless kubeconfig contexts retain
local-only logout; their user-scoped provider redirect flow and sequencing
multiple independent providers are outside this feature's scope.

When the OIDC provider advertises an `end_session_endpoint`, Headlamp uses it to end the
provider session during logout. This prevents the next sign-in from silently reusing the
previous provider session.

In the desktop app, logout opens an isolated window using the backend's cookie
session. Provider pages have no desktop preload or Node.js access; the main
Headlamp window stays on its trusted application page.

Logout hints are retained for the configured session lifetime, rather than the
shorter access-token lifetime. Logout invalidates the first token-cookie chunk
and clears any other chunks visible to that endpoint. Cookies hidden by their
path expire naturally; readers cannot authenticate without the first chunk, and
new tokens use terminal markers to exclude stale suffixes. This avoids emitting
the maximum possible number of deletion headers on every logout response.
Large provider tokens still require appropriately sized proxy response-header
buffers; chunking is not a guarantee that every token fits a 4 KiB response.

Set `-oidc-callback-url` to the registered Headlamp login callback URL, for example:

```
-oidc-callback-url=https://YOUR_URL/oidc-callback
```

Headlamp uses this configured URL as the trusted origin for the post-logout return. Register
`https://YOUR_URL/encoded-clusters/<base64url-cluster>/login` as an allowed post-logout
redirect URI with the provider for each OIDC cluster. For example, the cluster name `main`
uses `https://YOUR_URL/encoded-clusters/bWFpbg/login`. If Headlamp uses a base path, include
it in both URLs; for example, a base path of `/headlamp` uses
`https://YOUR_URL/headlamp/oidc-callback` and
`https://YOUR_URL/headlamp/encoded-clusters/bWFpbg/login`.

If `-oidc-callback-url` is not configured, Headlamp still ends the provider session but does
not request an automatic redirect back to Headlamp. Providers without an
`end_session_endpoint` retain the existing local-only logout behavior.

To clear the local Headlamp session without ending the provider session, set
`-oidc-skip-logout=true` or the `HEADLAMP_CONFIG_OIDC_SKIP_LOGOUT` environment variable to
`true`.

### Scopes

Besides the mandatory _openid_ scope, Headlamp also requests the optional _profile_ and _email_
[scopes](https://openid.net/specs/openid-connect-basic-1_0.html#Scopes).
Scopes can be overridden by using the `-oidc-scopes` option. Remember to include the default ones if you need them when using that option. For example, to keep the defaults and add GitHub's `repo` scope:

`-oidc-scopes=profile,email,repo`

**Note:** Before Headlamp 0.3.0, a scope _groups_ was also included, as it's used by Dex and other services, but since it's not part of the default spec, it was removed in the mentioned version.

### Token Validation Overrides

If your OIDC provider issues an `access_token` from a different issuer URL or clientID audience than its `id_token` (e.g. Azure Entra ID), use the following parameters to configure token validation:

- `-oidc-validator-client-id=<clientID audience to validate in token>` or env var `HEADLAMP_CONFIG_OIDC_VALIDATOR_CLIENT_ID` — the clientID Headlamp should verify in the `aud` field of the token.
- `-oidc-validator-idp-issuer-url=<issuerURL to use in validation>` or env var `HEADLAMP_CONFIG_OIDC_VALIDATOR_IDP_ISSUER_URL` — the issuer URL Headlamp should verify in the `iss` field of the token.

### Use Access Tokens instead of ID Tokens

By default, Headlamp uses the `id_token` returned after authentication. For some providers like Azure Entra ID, the `access_token` is required for Kubernetes cluster authorization. To switch:

- `-oidc-use-access-token=true` or env var `HEADLAMP_CONFIG_OIDC_USE_ACCESS_TOKEN`

### Multi-cluster: broadcast the OIDC token across sibling clusters

When a single Headlamp instance serves several Kubernetes clusters that all trust the **same** OIDC application (same issuer URL and client ID), an operator can opt in to broadcasting the auth cookie to every matching sibling cluster after a successful login. This eliminates per-cluster re-authentication for the common deployment shape where one OIDC app (Okta, Keycloak, Dex, Entra ID, etc.) is registered with every `kube-apiserver` in the fleet.

- `-oidc-use-token-broadcast=true` or env var `HEADLAMP_CONFIG_OIDC_USE_TOKEN_BROADCAST`

**Precondition.** A sibling cluster receives the broadcast only when its kubeconfig context's OIDC auth-provider has BOTH a non-empty `idp-issuer-url` AND a non-empty `client-id` that match the source cluster's. Contexts using a different auth-provider (e.g. `gcp`, `azure`) or a static token are skipped silently.

**Scope.** Broadcasting fires at initial OIDC login and broadcasts whichever token is in use (the `id_token`, or the `access_token` when `-oidc-use-access-token=true`). Token-refresh broadcasting is tracked as a follow-up. Because token refresh happens independently per cluster, sibling cookies diverge as soon as any one cluster refreshes its token; until refresh broadcasting lands, the affected clusters fall back to per-cluster re-login (commonly ~1h on EKS / Okta with default settings).

**Caveats to be aware of before enabling.**

- The flag is **disabled by default**; existing deployments see zero behavior change.
- Audience mismatches are not detected here. A target apiserver's accepted audiences come from its OIDC client ID (`--oidc-client-id`) or the `audiences` list in a structured [AuthenticationConfiguration](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#using-authentication-configuration); if a target is configured to require a different or additional audience than the source, the broadcast cookie may be set but the target apiserver could reject the token. Align deployment configuration in that case.
- When `-oidc-use-access-token=true`, the broadcast carries the `access_token` rather than the `id_token`. Unlike the `id_token`, an access token's audience is provider-specific and is frequently **not** the client ID (many IdPs — Okta, Entra ID, Auth0 — set it to a resource/API identifier). Matching issuer + client ID therefore does not by itself guarantee the access token is accepted by a sibling apiserver; ensure the access-token audience is honored fleet-wide before relying on broadcast with this flag.
- Each target cluster receives one or more `Set-Cookie` headers per login, so enabling this with very large multi-cluster kubeconfigs may approach browser and proxy cookie count / size limits.
- Pre-existing chunk-cookie limitation: stale chunk cookies on cluster paths are not actively cleared during login because cookies live under `/clusters/<cluster>` while OIDC login completes on `/oidc-callback`. In the rare case a re-issued token uses fewer chunks than the previous one, the affected cluster(s) may need a one-time re-login.

### Provider Tutorials

For step-by-step setup guides with specific providers, see:

- [Keycloak in Minikube](./keycloak/index.md)
- [Azure Entra ID in AKS](./azure-entra-id/index.md)
- [Dex and OAuth2-Proxy](./dex/index.md), or [Dex as Headlamp's OIDC provider](./dex/index.md#connect-headlamp-directly-to-dex)
- [OpenUnison](./openunison/index.md)

### Troubleshooting

#### OIDC sign-in succeeds but the cluster rejects your token

If you can sign in via OIDC but are returned to the "Sign in" screen with a message that the cluster rejected your token (and cannot load cluster resources), the cluster's **API server** is most likely not configured to trust the same OIDC provider as Headlamp. Headlamp only forwards the token to the API server, and the API server is what accepts or rejects it, so it must be OIDC-aware with a matching issuer, client ID, and audience.

Make sure the API server is configured for the same OIDC provider (via its `--oidc-issuer-url` / `--oidc-client-id` flags or the equivalent [structured authentication configuration](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#configuring-the-api-server)), so that `--oidc-issuer-url` matches Headlamp's `-oidc-idp-issuer-url` and `--oidc-client-id` matches Headlamp's `-oidc-client-id`.

Managed control planes (e.g. AKS, EKS, GKE) may not accept arbitrary OIDC flags on the API server. If that is the case, use the provider's managed identity/OIDC integration instead. When the API server rejects the token, Headlamp logs a warning containing `API server rejected the forwarded bearer token (401)`.

For other common issues including real-time updates not working and large JWT token handling, see the [OIDC troubleshooting guide](./oidc-troubleshooting.md).
