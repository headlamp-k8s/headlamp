package main

import (
	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
)

type Cluster struct {
	Name     string                 `json:"name"`
	Server   string                 `json:"server,omitempty"`
	AuthType string                 `json:"auth_type"`
	Metadata map[string]interface{} `json:"meta_data"`
}

type ClusterReq struct {
	Name   *string `json:"name"`
	Server *string `json:"server"`
	// InsecureSkipTLSVerify skips the validity check for the server's certificate.
	// This will make your HTTPS connections insecure.
	// +optional
	InsecureSkipTLSVerify bool `json:"insecure-skip-tls-verify,omitempty"`
	// CertificateAuthorityData contains PEM-encoded certificate authority certificates. Overrides CertificateAuthority
	// +optional
	CertificateAuthorityData []byte                 `json:"certificate-authority-data,omitempty"`
	Metadata                 map[string]interface{} `json:"meta_data"`
	KubeConfig               *string                `json:"kubeconfig,omitempty"`
}

type KubeconfigRequest struct {
	Kubeconfigs []string `json:"kubeconfigs"`
}
