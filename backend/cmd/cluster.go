package main

import (
	"io/ioutil"
	"log"

	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	"k8s.io/client-go/rest"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
)

// @todo: Use a different way to avoid name clashes with other clusters
const OWN_CLUSTER_NAME = "main"

type Cluster struct {
	Name   string `json:"name"`
	Server string `json:"server,omitempty"`
	config *clientcmdapi.Cluster
}

func GetOwnCluster() (*Cluster, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}

	cluster := &clientcmdapi.Cluster{
		Server:                   config.Host,
		CertificateAuthority:     config.TLSClientConfig.CAFile,
		CertificateAuthorityData: config.TLSClientConfig.CAData,
	}

	return &Cluster{Name: OWN_CLUSTER_NAME, Server: config.Host, config: cluster}, nil
}

func (c *Cluster) getServer() *string {
	return &c.Server
}

func (c *Cluster) getName() *string {
	return &c.Name
}

func (c *Cluster) getCAData() []byte {
	if c.config.CertificateAuthority != "" {
		if pemBytes, err := ioutil.ReadFile(c.config.CertificateAuthority); err == nil {
			return pemBytes
		} else {
			log.Fatal("Failed to add certificate:", err)
		}
	}

	if caData := c.config.CertificateAuthorityData; len(caData) > 0 {
		return caData
	}

	return nil
}

func (c *Cluster) shouldVerifyTLS() bool {
	return !c.config.InsecureSkipTLSVerify
}
