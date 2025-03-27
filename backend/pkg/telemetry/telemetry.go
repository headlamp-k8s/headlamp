package telemetry

import (
	"context"
	"fmt"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/exporters/prometheus"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
)

// Config defines the configuration options for telemetry initialization.
// It controls how tracing and metrics are collected and where they are exported.
type Config struct {
	// ServiceName is the name of the service being monitored (required)
	ServiceName string
	// ServiceVersion is the version of the service being monitored
	ServiceVersion string
	// TracingEnabled determines if distributed tracing is enabled
	TracingEnabled bool
	// MetricsEnabled determines if metrics collection is enabled
	MetricsEnabled bool
	// JaegerEndpoint is the endpoint for Jaeger tracing backend
	// Setting this will also set OTLPEndpoint if it's not already set
	JaegerEndpoint string
	// OTLPEndpoint is the endpoint for OTLP-compatible tracing backends
	OTLPEndpoint string
	// UseOTLPHTTP determines whether to use HTTP (true) or gRPC (false) for OTLP export
	UseOTLPHTTP bool
	// StdoutTraceEnabled enables logging of traces to stdout (useful for debugging)
	StdoutTraceEnabled bool
	// PrometheusPort is the port where Prometheus metrics will be exposed
	PrometheusPort int
	// SamplingRate controls the fraction of traces that are sampled
	SamplingRate float64
}

// Telemetry is the main struct that manages the lifecycle of telemetry components.
// It holds the trace and meter providers and provides methods for shutdown.
type Telemetry struct {
	config         Config
	tracerProvider *trace.TracerProvider
	meterProvider  *metric.MeterProvider
	shutdown       func(context.Context) error
}

// NewTelemetry creates and initializes a new Telemetry instance based on the provided configuration.
// It sets up tracing and metrics collection according to the config.
// Returns a configured Telemetry instance and any error encountered during initialization.
// If initialization fails, all resources are properly cleaned up.
func NewTelemetry(cfg Config) (*Telemetry, error) {
	if cfg.ServiceName == "" {
		return nil, fmt.Errorf("service name cannot be empty")
	}

	t := &Telemetry{
		config: cfg,
	}

	res, err := createResource(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create telemetry resource: %w", err)
	}

	// Initialize trace provider if tracing is enabled
	if cfg.TracingEnabled {
		if err := setupTracing(t, res, cfg); err != nil {
			return nil, fmt.Errorf("failed to setup tracing %w", err)
		}
	}

	// Initialize metrics provider if metrics are enabled
	if cfg.MetricsEnabled && cfg.PrometheusPort > 0 {
		if err := setupMetrics(t, res); err != nil {
			// Clean up trace provider if metrics setup fails
			if t.tracerProvider != nil {
				ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancel()

				_ = t.tracerProvider.Shutdown(ctx)
			}

			return nil, fmt.Errorf("failed to setup metrics: %w", err)
		}
	} else if cfg.MetricsEnabled && cfg.PrometheusPort <= 0 {
		return nil, fmt.Errorf("metrics enabled but invalid Prometheus port: %d", cfg.PrometheusPort)
	}

	setupShutdownFunction(t)

	return t, nil
}

// createResource creates an OpenTelemetry resource with service information.
// The resource contains identifying information about the service being monitored,
// including its name, version, and deployment environment.
func createResource(cfg Config) (*resource.Resource, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := resource.New(
		ctx,
		resource.WithAttributes(
			semconv.ServiceName(cfg.ServiceName),
			semconv.ServiceVersion(cfg.ServiceVersion),
			attribute.String("environment", "production"),
		),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create OpenTelemetry resource: %w", err)
	}

	return res, nil
}

// setupTracing initializes the tracing components.
func setupTracing(t *Telemetry, res *resource.Resource, cfg Config) error {
	exporter, err := createTracingExporter(cfg)
	if err != nil {
		return err
	}

	sampler := createSampler(cfg.SamplingRate)

	tp := trace.NewTracerProvider(
		trace.WithSampler(sampler),
		trace.WithBatcher(exporter),
		trace.WithResource(res),
	)

	if tp == nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		_ = exporter.Shutdown(ctx)

		return fmt.Errorf("tracer provider initialization returned nil")
	}

	t.tracerProvider = tp
	otel.SetTracerProvider(tp)

	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	return nil
}

// createTracingExporter creates a span exporter based on the configuration.
func createTracingExporter(cfg Config) (trace.SpanExporter, error) {
	if cfg.StdoutTraceEnabled {
		exporter, err := createStdoutExporter()
		if err != nil {
			return nil, fmt.Errorf("failed to create stdout exporter: %w", err)
		}

		return exporter, nil
	}

	if cfg.JaegerEndpoint != "" {
		if cfg.OTLPEndpoint == "" {
			cfg.OTLPEndpoint = "localhost:4317"
		}
	}

	if cfg.OTLPEndpoint != "" {
		exporter, err := createOTLPExporter(cfg)
		if err != nil {
			return nil, fmt.Errorf("failed to create OTLP exporter with endpoint %s: %w",
				cfg.OTLPEndpoint, err)
		}

		return exporter, nil
	}

	exporter, err := createStdoutExporter()
	if err != nil {
		return nil, fmt.Errorf("failed to create default stdout exporter: %w", err)
	}

	return exporter, nil
}

// createStdoutExporter creates a stdout span exporter.
func createStdoutExporter() (trace.SpanExporter, error) {
	return stdouttrace.New(stdouttrace.WithPrettyPrint())
}

// createOTLPExporter creates an OTLP exporter with HTTP or gRPC.
func createOTLPExporter(cfg Config) (trace.SpanExporter, error) {
	var client otlptrace.Client

	if cfg.UseOTLPHTTP {
		client = otlptracehttp.NewClient(
			otlptracehttp.WithEndpoint(cfg.OTLPEndpoint),
			otlptracehttp.WithInsecure(),
		)
	} else {
		client = otlptracegrpc.NewClient(
			otlptracegrpc.WithEndpoint(cfg.OTLPEndpoint),
			otlptracegrpc.WithInsecure(),
		)
	}

	return otlptrace.New(context.Background(), client)
}

// createSampler creates a sampler based on the sampling rate.
func createSampler(samplingRate float64) trace.Sampler {
	if samplingRate >= 1.0 {
		return trace.AlwaysSample()
	}

	if samplingRate <= 0.0 {
		return trace.NeverSample()
	}

	return trace.TraceIDRatioBased(samplingRate)
}

// setupMetrics initializes the metrics components.
func setupMetrics(t *Telemetry, res *resource.Resource) error {
	promExporter, err := prometheus.New()
	if err != nil {
		return fmt.Errorf("failed to initialize Prometheus exporter: %w", err)
	}

	mp := metric.NewMeterProvider(
		metric.WithReader(promExporter),
		metric.WithResource(res),
	)
	if mp == nil {
		return fmt.Errorf("meter provider initialization returned nil")
	}

	t.meterProvider = mp
	otel.SetMeterProvider(mp)

	return nil
}

func setupShutdownFunction(t *Telemetry) {
	t.shutdown = func(ctx context.Context) error {
		var err1, err2 error
		if t.tracerProvider != nil {
			err1 = t.tracerProvider.Shutdown(ctx)
		}

		if t.meterProvider != nil {
			err2 = t.meterProvider.Shutdown(ctx)
		}

		if err1 != nil {
			return err1
		}

		return err2
	}
}

func (t *Telemetry) Shutdown(ctx context.Context) error {
	if t.shutdown != nil {
		return t.shutdown(ctx)
	}

	return nil
}

// Default configuration for telemetry.
func DefaultConfig() Config {
	return Config{
		ServiceName:        "headlamp",
		ServiceVersion:     "1.0.0",
		TracingEnabled:     true,
		MetricsEnabled:     true,
		OTLPEndpoint:       "localhost:4317",
		StdoutTraceEnabled: true,
		PrometheusPort:     9090,
		SamplingRate:       1.0,
	}
}
