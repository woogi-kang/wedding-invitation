import 'fake-indexeddb/auto';
import { vi, beforeEach } from 'vitest';

// Mock BroadcastChannel for multi-tab tests
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(_message: unknown): void {
    // No-op in tests
  }

  close(): void {
    // No-op in tests
  }

  addEventListener(_type: string, _listener: EventListener): void {
    // No-op in tests
  }

  removeEventListener(_type: string, _listener: EventListener): void {
    // No-op in tests
  }

  dispatchEvent(_event: Event): boolean {
    return true;
  }
}

globalThis.BroadcastChannel = MockBroadcastChannel as typeof BroadcastChannel;

// Mock window object for browser-only code
Object.defineProperty(globalThis, 'window', {
  value: globalThis,
  writable: true,
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
