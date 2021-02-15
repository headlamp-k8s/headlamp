package main //nolint:testpackage

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

const staticTestPath = "headlamp_testdata/static_files/"

// Is supposed to return the index.html if there is no static file.
func TestSpaHandlerMissing(t *testing.T) {
	req, err := http.NewRequest("GET", "/headlampxxx", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := spaHandler{staticPath: staticTestPath, indexPath: "index.html", baseURL: "/headlamp"}
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	indexExpected := "The index."

	if !strings.HasPrefix(rr.Body.String(), indexExpected) {
		t.Errorf("handler returned unexpected body: got :%v: want :%v:",
			rr.Body.String(), indexExpected)
	}
}

// Works with a baseURL to get the index.html.
func TestSpaHandlerBaseURL(t *testing.T) {
	req, err := http.NewRequest("GET", "/headlamp/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := spaHandler{staticPath: staticTestPath, indexPath: "index.html", baseURL: "/headlamp"}
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	indexExpected := "The index."
	if !strings.HasPrefix(rr.Body.String(), indexExpected) {
		t.Errorf("handler returned unexpected body: got :%v: want :%v:",
			rr.Body.String(), indexExpected)
	}
}

// Works with a baseURL to get other files.
func TestSpaHandlerOtherFiles(t *testing.T) {
	req, err := http.NewRequest("GET", "/headlamp/example.css", nil) //nolint:noctx
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := spaHandler{staticPath: staticTestPath, indexPath: "index.html", baseURL: "/headlamp"}
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expectedCSS := ".somecss"
	if !strings.HasPrefix(rr.Body.String(), expectedCSS) {
		t.Errorf("handler returned unexpected body: got :%v: want :%v:",
			rr.Body.String(), expectedCSS)
	}
}
