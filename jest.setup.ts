import "@testing-library/jest-dom";

// Polyfill fetch and related globals for Firebase / network requests in tests
if (typeof global.fetch === "undefined") {
  global.fetch = globalThis.fetch;
  global.Request = globalThis.Request;
  global.Response = globalThis.Response;
  global.Headers = globalThis.Headers;
}