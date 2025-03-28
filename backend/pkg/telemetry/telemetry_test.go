package telemetry

import (
	"context"
	"errors"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"
)

func TestCreateReosurce(t *testing.T) {
	cfg := Config{
		ServiceName:    "test-service",
		ServiceVersion: "1.0.0",
	}

	res, err := createResource(cfg)
	require.NoError(t, err)
	assert.NotNil(t, res)

	// Verify resource attributes
	attrs := res.Attributes()

	var serviceNameFound, serviceVersionFound, environmentFound bool

	// Check for expected attributes

	for _, attr := range attrs {
		switch attr.Key {
		case semconv.ServiceNameKey:
			assert.Equal(t, "test-service", attr.Value.AsString())
			serviceNameFound = true
		case semconv.ServiceVersionKey:
			assert.Equal(t, "1.0.0", attr.Value.AsString())
			serviceVersionFound = true
		case attribute.Key("environment"):
			assert.Equal(t, "production", attr.Value.AsString())
			environmentFound = true
		}
	}

	assert.True(t, serviceNameFound, "Service name attribute not found")
	assert.True(t, serviceVersionFound, "Service version attribute not found")
	assert.True(t, environmentFound, "Environment attribute not found")
}

func TestCreateTracingExporter(t *testing.T) {
	tests := []struct {
		name         string
		config       Config
		expectError  bool
		exporterType string
	}{
		{
			name: "stdout exporter",
			config: Config{
				StdoutTraceEnabled: true,
			},
			expectError:  false,
			exporterType: "*stdouttrace.Exporter",
		},
		{
			name: "OTLP exporter",
			config: Config{
				OTLPEndpoint: "localhost:4317",
			},
			expectError:  false,
			exporterType: "otlptrace.Exporter",
		},
		{
			name: "jaeger fallback to OTLP",
			config: Config{
				JaegerEndpoint: "http://localhost:14268/api/traces",
			},
			expectError:  false,
			exporterType: "otlptrace.Exporter",
		},
		{
			name:         "default to stdout",
			config:       Config{},
			expectError:  false,
			exporterType: "*stdouttrace.Exporter",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			exporter, err := createTracingExporter(tc.config)

			if tc.expectError {
				assert.Error(t, err)
				assert.Nil(t, exporter)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, exporter)

				ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancel()
				err = exporter.Shutdown(ctx)
				assert.NoError(t, err)
			}
		})
	}
}

func TestCreateOTLPExporter(t *testing.T) {
	if os.Getenv("CI") != "" {
		t.Skip("Skipping OTPL exporter test in CI environment")
	}

	tests := []struct {
		name        string
		config      Config
		expectError bool
	}{
		{
			name: "gRPC exporter",
			config: Config{
				OTLPEndpoint: "localhost:4317",
				UseOTLPHTTP:  false,
			},
			expectError: false,
		},
		{
			name: "HTTP exporter",
			config: Config{
				OTLPEndpoint: "localhost:4318",
				UseOTLPHTTP:  true,
			},
			expectError: false,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			exporter, err := createOTLPExporter(tc.config)

			if err != nil && !errors.Is(err, context.DeadlineExceeded) {
				t.Logf("Got error creating OTPL exporter: %v", err)
			}

			if exporter != nil {
				ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancel()
				_ = exporter.Shutdown(ctx)
			}
		})
	}
}

func TestCreateStdoutExporter(t *testing.T) {
	exporter, err := createStdoutExporter()
	assert.NoError(t, err)
	assert.NotNil(t, exporter)

	_, ok := exporter.(*stdouttrace.Exporter)
	assert.True(t, ok, "Expected a stdouttrace.Exporter")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = exporter.Shutdown(ctx)
	assert.NoError(t, err)
}
