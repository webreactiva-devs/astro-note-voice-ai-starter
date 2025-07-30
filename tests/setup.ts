import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { server } from "./mocks/server";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Store original URL constructor
const OriginalURL = globalThis.URL;

// Mock window.URL.createObjectURL and revokeObjectURL while preserving constructor
Object.defineProperty(window, "URL", {
  value: class extends OriginalURL {
    static createObjectURL = vi.fn(() => "mocked-object-url");
    static revokeObjectURL = vi.fn();
  },
});

// Ensure global URL constructor is available
if (typeof globalThis.URL === "undefined") {
  globalThis.URL = OriginalURL;
}

// Mock window.alert
Object.defineProperty(window, "alert", {
  value: vi.fn(),
});

// Mock AudioContext
global.AudioContext = class MockAudioContext {
  state: string;

  constructor() {
    this.state = "running";
  }

  createMediaStreamSource() {
    return {
      connect: vi.fn(),
    };
  }

  createAnalyser() {
    return {
      fftSize: 2048,
      connect: vi.fn(),
    };
  }

  close() {
    return Promise.resolve();
  }
} as any;

// Mock navigator.mediaDevices
Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getUserMedia: vi.fn(() =>
      Promise.resolve({
        getTracks: () => [{ stop: vi.fn() }],
        getAudioTracks: () => [{ stop: vi.fn() }],
        addListener: vi.fn(),
        removeListener: vi.fn(),
        stop: vi.fn(),
      })
    ),
  },
});

// Mock MediaRecorder
global.MediaRecorder = class MockMediaRecorder {
  state: string;
  ondataavailable: ((event: any) => void) | null;
  onstop: (() => void) | null;

  constructor() {
    this.state = "inactive";
    this.ondataavailable = null;
    this.onstop = null;
  }

  start() {
    this.state = "recording";
    // Trigger data available after a short delay
    setTimeout(() => {
      if (this.ondataavailable) {
        this.ondataavailable({
          data: new Blob(["test"], { type: "audio/webm" }),
        });
      }
    }, 10);
  }

  stop() {
    this.state = "inactive";
    if (this.onstop) this.onstop();
  }

  pause() {
    this.state = "paused";
  }

  resume() {
    this.state = "recording";
  }

  static isTypeSupported() {
    return true;
  }
} as any;
