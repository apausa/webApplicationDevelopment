// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/**
 * these polyfills provide browser apis that are needed for testing next.js
 * routes in a node.js environment, where they're not natively available.
 */

// Response polyfill
const createMockResponse = (body, init = {}) => ({
  body,
  init,
  status: init.status ?? 200,
  ok: (init.status ?? 200) >= 200 && (init.status ?? 200) < 300,
  headers: new Map(Object.entries(init.headers ?? {})),
});

const MockResponse = function MockResponse(body, init) {
  return createMockResponse(body, init);
};

MockResponse.json = (data) => createMockResponse(JSON.stringify(data), {
  status: 200,
  headers: { 'content-type': 'application/json' },
});

MockResponse.error = () => createMockResponse(null, { status: 500 });

// Request polyfill
const MockRequest = function MockRequest(url, init = {}) {
  return {
    url,
    init,
    json: async () => init.body || {},
    text: async () => JSON.stringify(init.body || {}),
  };
};

// Headers polyfill
const MockHeaders = class extends Map {
  constructor(init) {
    super();

    if (!init) return;

    const initializers = {
      array: (arr) => arr.forEach(([key, value]) => this.set(key, value)),
      map: (map) => map.forEach((value, key) => this.set(key, value)),
      object: (obj) => Object.entries(obj).forEach(([key, value]) => this.set(key, value)),
    };

    if (Array.isArray(init)) initializers.array(init);
    else if (init instanceof Map) initializers.map(init);
    else initializers.object(init);
  }
};

Object.assign(global, {
  Response: MockResponse,
  Request: MockRequest,
  Headers: MockHeaders,
});
