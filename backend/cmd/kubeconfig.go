package main

import (
	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
	"log"
)

type Context struct {
	Name     string
	cluster  Cluster
	authInfo *clientcmdapi.AuthInfo
}

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
		cluster := Cluster{key, clusterConfig.Server, clusterConfig}
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

func GetOwnContext() (*Context, error) {
	cluster, err := GetOwnCluster()
	if err != nil {
		return nil, err
	}

	return &Context{cluster.Name, *cluster, nil}, nil
}
