package main

import (
	"io/ioutil"
	"log"

	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
)

// @todo: Use a different way to avoid name clashes with other clusters
const OWN_CLUSTER_NAME = "_main_"

type Cluster struct {
	Name   string `json:"name"`
	Server string `json:"server,omitempty"`
	config *clientcmdapi.Cluster
}

func GetClustersFromKubeConfigFile(kubeConfigPath string) ([]Cluster, error) {
	config, err := clientcmd.LoadFromFile(kubeConfigPath)
	if err != nil {
		return nil, err
	}

	clusters := []Cluster{}

	for key, value := range config.Clusters {
		if value.Server == "" {
			log.Fatalf("Please make sure all configured clusters have a URL!")
		}
		// @todo: Create a name from the URL instead of failing here
		if key == "" {
			log.Fatalf("Please make sure the cluster with URL %v has a name configured!", value.Server)
		}
		clusters = append(clusters, Cluster{key, value.Server, value})
	}

	return clusters, nil
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
