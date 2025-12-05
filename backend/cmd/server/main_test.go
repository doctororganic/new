package main

import (
  "encoding/json"
  "net/http"
  "net/http/httptest"
  "strings"
  "testing"

  "github.com/labstack/echo/v4"
)

func TestHealthCheck(t *testing.T) {
  e := echo.New()
  req := httptest.NewRequest(http.MethodGet, "/health", nil)
  rec := httptest.NewRecorder()
  c := e.NewContext(req, rec)
  if err := healthCheck(c); err != nil {
    t.Fatalf("handler error: %v", err)
  }
  if rec.Code != http.StatusOK {
    t.Fatalf("expected 200, got %d", rec.Code)
  }
  var body map[string]interface{}
  if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
    t.Fatalf("invalid json: %v", err)
  }
  if body["status"] != "healthy" {
    t.Fatalf("expected status healthy, got %v", body["status"])
  }
}

func TestCreateConditionInvalid(t *testing.T) {
  e := echo.New()
  req := httptest.NewRequest(http.MethodPost, "/api/v1/conditions", strings.NewReader(`{"name":"","type":"invalid"}`))
  req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
  rec := httptest.NewRecorder()
  c := e.NewContext(req, rec)
  err := createConditionHandler(c)
  if err == nil {
    t.Fatalf("expected error for invalid payload")
  }
}

func TestGenerateDataHandler(t *testing.T) {
  e := echo.New()
  req := httptest.NewRequest(http.MethodGet, "/api/v1/generate?count=3", nil)
  rec := httptest.NewRecorder()
  c := e.NewContext(req, rec)
  if err := generateDataHandler(c); err != nil {
    t.Fatalf("handler error: %v", err)
  }
  if rec.Code != http.StatusOK {
    t.Fatalf("expected 200, got %d", rec.Code)
  }
  var body map[string]interface{}
  if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
    t.Fatalf("invalid json: %v", err)
  }
  if int(body["count"].(float64)) != 3 {
    t.Fatalf("expected count 3, got %v", body["count"])
  }
}

func TestMealsPagination(t *testing.T) {
  e := echo.New()
  req := httptest.NewRequest(http.MethodGet, "/api/v1/meals?limit=50&offset=0", nil)
  rec := httptest.NewRecorder()
  c := e.NewContext(req, rec)
  if err := getMealsHandler(c); err != nil {
    t.Fatalf("handler error: %v", err)
  }
  if rec.Code != http.StatusOK {
    t.Fatalf("expected 200, got %d", rec.Code)
  }
  var body map[string]interface{}
  if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
    t.Fatalf("invalid json: %v", err)
  }
  if int(body["limit"].(float64)) != 50 {
    t.Fatalf("expected limit 50, got %v", body["limit"])
  }
}

