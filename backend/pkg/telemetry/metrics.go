package telemetry

import (
	"fmt"
	"net/http"
	"time"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
)

// MetricsServer for Prometheus metrics.
func StartMetricsServer(port int) (*http.Server, error) {
	if port <= 0 {
		return nil, fmt.Errorf("invalid port for metrics server: %d", port)
	}

	mux := http.NewServeMux()
	mux.Handle("/metrics", promhttp.Handler())

	server := &http.Server{
		Addr:              fmt.Sprintf(":%d", port),
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Printf("Error starting metrics server: %v\n", err)
		}
	}()

	fmt.Printf("Metrics server started on port %d\n", port)

	return server, nil
}

type Metrics struct {
	RequestCounter       metric.Int64Counter
	RequestDuration      metric.Float64Histogram
	ActiveRequestsGauge  metric.Int64UpDownCounter
	ClusterProxyRequests metric.Int64Counter
	PluginLoadCount      metric.Int64Counter
	ErrorCounter         metric.Int64Counter
}

// NewMetrics creates and registers common metrics.
func NewMetrics() (*Metrics, error) {
	meter := otel.Meter("headlamp")

	requestCounter, err := meter.Int64Counter(
		"http.server.request_count",
		metric.WithDescription("Total number of HTTP requests"),
	)
	if err != nil {
		return nil, err
	}

	requestDuration, err := meter.Float64Histogram(
		"http.server.duration",
		metric.WithDescription("Duration of HTTP requests"),
		metric.WithUnit("ms"),
	)
	if err != nil {
		return nil, err
	}

	activeRequests, err := meter.Int64UpDownCounter(
		"http.server.active_requests",
		metric.WithDescription("Number of active HTTP requests"),
	)
	if err != nil {
		return nil, err
	}

	clusterProxyRequests, err := meter.Int64Counter(
		"headlamp.cluster_proxy.requests",
		metric.WithDescription("Total number of cluster proxy requests"),
	)
	if err != nil {
		return nil, err
	}

	pluginLoadCount, err := meter.Int64Counter(
		"headlamp.plugin.load_count",
		metric.WithDescription("Number of plugin loads"),
	)
	if err != nil {
		return nil, err
	}

	errorCounter, err := meter.Int64Counter(
		"headlamp.errors",
		metric.WithDescription("Count of errors"),
	)
	if err != nil {
		return nil, err
	}

	return &Metrics{
		RequestCounter:       requestCounter,
		RequestDuration:      requestDuration,
		ActiveRequestsGauge:  activeRequests,
		ClusterProxyRequests: clusterProxyRequests,
		PluginLoadCount:      pluginLoadCount,
		ErrorCounter:         errorCounter,
	}, nil
}

// RequestCounterMiddleware creates middleware that counts HTTP requests.
func (m *Metrics) RequestCounterMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		m.ActiveRequestsGauge.Add(r.Context(), 1)

		attrs := []attribute.KeyValue{
			attribute.String("http.method", r.Method),
			attribute.String("http.target", r.URL.Path),
		}

		m.RequestCounter.Add(r.Context(), 1, metric.WithAttributes(attrs...))

		wrapper := newResponseWriter(w)

		next.ServeHTTP(wrapper, r)

		statusAttr := attribute.Int("http.status_code", wrapper.statusCode)
		m.RequestCounter.Add(r.Context(), 1, metric.WithAttributes(append(attrs, statusAttr)...))

		m.ActiveRequestsGauge.Add(r.Context(), -1)
	})
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func newResponseWriter(w http.ResponseWriter) *responseWriter {
	return &responseWriter{
		ResponseWriter: w,
		statusCode:     http.StatusOK,
	}
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}
