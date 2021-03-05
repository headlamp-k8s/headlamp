package main

import (
	"context"
	"log"
	"strings"

	oidc "github.com/coreos/go-oidc"
	"golang.org/x/oauth2"
	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
)

type Context struct {
	Name     string
	cluster  Cluster
	authInfo *clientcmdapi.AuthInfo
}

type OauthConfig struct {
	Config   *oauth2.Config
	Verifier *oidc.IDTokenVerifier
	Ctx      context.Context
}

type OidcConfig struct {
	ClientID     string
	ClientSecret string
	IdpIssuerURL string
	Scopes       []string
}

var oidcConfigCache = make(map[string]*OidcConfig)

func GetContextsFromKubeConfigFile(kubeConfigPath string) ([]Context, error) {
	config, err := clientcmd.LoadFromFile(kubeConfigPath)
	if err != nil {
		return nil, err
	}

	contexts := []Context{}

	for key, value := range config.Contexts {
		clusterConfig := config.Clusters[value.Cluster]
		if clusterConfig == nil {
			log.Printf("Not adding context %v because cluster doesn't exist!\n", key)
			continue
		}

		authInfo := config.AuthInfos[value.AuthInfo]
		authType := ""

		if authInfo == nil && value.AuthInfo != "" {
			log.Printf("Not adding context: %v because user: %v could not be found!\n", key, value.AuthInfo)
			continue
		}

		if authInfo != nil {
			authProvider := authInfo.AuthProvider
			if authProvider != nil {
				authType = "oidc"

				var oidcConfig OidcConfig
				oidcConfig.ClientID = authProvider.Config["client-id"]
				oidcConfig.ClientSecret = authProvider.Config["client-secret"]
				oidcConfig.IdpIssuerURL = authProvider.Config["idp-issuer-url"]
				oidcConfig.Scopes = strings.Split(authProvider.Config["extra-scopes"], ",")

				oidcConfigCache[key] = &oidcConfig
			}
		}

		cluster := Cluster{key, clusterConfig.Server, clusterConfig, authType}

		contexts = append(contexts, Context{key, cluster, authInfo})
	}

	return contexts, nil
}

func (c *Context) getCluster() *Cluster {
	return &c.cluster
}

func (c *Context) getClientCertificate() string {
	if c.authInfo != nil {
		return c.authInfo.ClientCertificate
	}

	return ""
}

func (c *Context) getClientKey() string {
	if c.authInfo != nil {
		return c.authInfo.ClientKey
	}

	return ""
}

func (c *Context) getClientCertificateData() []byte {
	if c.authInfo != nil {
		return c.authInfo.ClientCertificateData
	}

	return nil
}

func (c *Context) getClientKeyData() []byte {
	if c.authInfo != nil {
		return c.authInfo.ClientKeyData
	}

	return nil
}

func GetOwnContext(config *HeadlampConfig) (*Context, error) {
	cluster, err := GetOwnCluster(config)
	if err != nil {
		return nil, err
	}

	return &Context{cluster.Name, *cluster, nil}, nil
}
