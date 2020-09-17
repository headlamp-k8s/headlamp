package main

import (
	"fmt"
	"io/ioutil"
	"log"

	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	"k8s.io/client-go/rest"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
)

// @todo: Use a different way to avoid name clashes with other clusters.
const OwnClusterName = "main"

type Cluster struct {
	Name     string `json:"name"`
	Server   string `json:"server,omitempty"`
	config   *clientcmdapi.Cluster
	AuthType string `json:"auth_type"`
}

func GetClusterOidcConfig(clusterName string) (*OidcConfig, error) {
	if oidcConfig, ok := oidcConfigCache[clusterName]; ok {
		return oidcConfig, nil
	}

	return nil, fmt.Errorf("couln't find auth config for cluster %s", clusterName)
}

func GetOwnCluster(headlampConfig *HeadlampConfig) (*Cluster, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}

	authProvider := ""

	if headlampConfig.oidcIdpIssuerURL != "" {
		authProvider = "oidc"

		var oidcConfig OidcConfig

		oidcConfig.ClientID = headlampConfig.oidcClientID
		oidcConfig.ClientSecret = headlampConfig.oidcClientSecret
		oidcConfig.IdpIssuerURL = headlampConfig.oidcIdpIssuerURL

		oidcConfigCache[OwnClusterName] = &oidcConfig
	}

	cluster := &clientcmdapi.Cluster{
		Server:                   config.Host,
		CertificateAuthority:     config.TLSClientConfig.CAFile,
		CertificateAuthorityData: config.TLSClientConfig.CAData,
	}

	return &Cluster{Name: OwnClusterName, Server: config.Host, config: cluster, AuthType: authProvider}, nil
}

func (c *Cluster) getServer() *string {
	return &c.Server
}

func (c *Cluster) getName() *string {
	return &c.Name
}

func (c *Cluster) getCAData() []byte {
	if c.config.CertificateAuthority != "" {
		pemBytes, err := ioutil.ReadFile(c.config.CertificateAuthority)
		if err == nil {
			return pemBytes
		}

		log.Fatal("Failed to add certificate:", err)
	}

	if caData := c.config.CertificateAuthorityData; len(caData) > 0 {
		return caData
	}

	return nil
}

func (c *Cluster) shouldVerifyTLS() bool {
	return !c.config.InsecureSkipTLSVerify
}
