package telemetry

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/propagation"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/sdk/trace/tracetest"
)

func setupTracingProvider(t *testing.T) (*tracetest.SpanRecorder, *sdktrace.TracerProvider) {
	sr := tracetest.NewSpanRecorder()
	tp := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithSpanProcessor(sr),
	)

	t.Cleanup(func() {
		_ = tp.Shutdown(context.Background())
	})

	return sr, tp
}

func TestTracingMiddleware(t *testing.T) {
	sr, tp := setupTracingProvider(t)
	originalTP := otel.GetTracerProvider()
	otel.SetTracerProvider(tp)
	defer otel.SetTracerProvider(originalTP)

	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("test response"))
	})

	middleware := TracingMiddleware("test-service")

	handler := middleware(testHandler)

	req := httptest.NewRequest("GET", "/test-path", nil)
	w := httptest.NewRecorder()

	handler.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "test response", w.Body.String())

	spans := sr.Ended()
	require.Len(t, spans, 1, "Expected one span to be created")

	span := spans[0]
	assert.Equal(t, "test-service", span.Name())
	assert.NotZero(t, span.StartTime())
	assert.NotZero(t, span.EndTime())

	containsAttribute := func(key string, value interface{}) bool {
		for _, attr := range span.Attributes() {
			if string(attr.Key) == key {
				switch v := value.(type) {
				case string:
					return attr.Value.AsString() == v
				case int:
					return attr.Value.AsInt64() == int64(v)
				}
			}
		}
		return false
	}

	assert.True(t, containsAttribute("http.method", "GET"))
	assert.True(t, containsAttribute("http.target", "/test-path"))
	assert.True(t, containsAttribute("http.status_code", 200))
}

func TestTracingMiddlewareWithPropagation(t *testing.T) {
	sr, tp := setupTracingProvider(t)
	originalTP := otel.GetTracerProvider()
	otel.SetTracerProvider(tp)
	defer otel.SetTracerProvider(originalTP)

	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, span := otel.GetTracerProvider().Tracer("test").Start(r.Context(), "inner-span")
		span.End()

		w.WriteHeader(http.StatusOK)
	})

	middleware := TracingMiddleware("test-service")

	handler := middleware(testHandler)

	req := httptest.NewRequest("GET", "/test-path", nil)
	ctx, parentSpan := otel.Tracer("test").Start(context.Background(), "parent-span")
	defer parentSpan.End()

	otel.GetTextMapPropagator().Inject(ctx, propagation.HeaderCarrier(req.Header))

	w := httptest.NewRecorder()

	handler.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	spans := sr.Ended()
	require.GreaterOrEqual(t, len(spans), 2, "Expected at least two spans to be created")

	var middlewareSpan sdktrace.ReadOnlySpan
	var innerSpan sdktrace.ReadOnlySpan

	for _, s := range spans {
		if s.Name() == "test-service" {
			middlewareSpan = s
		} else if s.Name() == "inner-span" {
			innerSpan = s
		}
	}

	require.NotNil(t, middlewareSpan, "Middleware span not found")
	require.NotNil(t, innerSpan, "Inner span not found")

	assert.Equal(t, middlewareSpan.SpanContext().TraceID(), innerSpan.SpanContext().TraceID(),
		"Inner span should share trace ID with middleware span")
}

func TestStartSpan(t *testing.T) {
	sr, tp := setupTracingProvider(t)

	ctx, span := StartSpan(tp, "test-span")

	AddSpanAttributes(ctx, attribute.String("test.key", "test-value"))

	span.End()

	spans := sr.Ended()
	require.Len(t, spans, 1, "Expected one span to be created")

	roSpan := spans[0]
	assert.Equal(t, "test-span", roSpan.Name())

	found := false
	for _, attr := range roSpan.Attributes() {
		if attr.Key == attribute.Key("test.key") && attr.Value.AsString() == "test-value" {
			found = true
			break
		}
	}
	assert.True(t, found, "Expected to find attribute test.key=test-value")
}
