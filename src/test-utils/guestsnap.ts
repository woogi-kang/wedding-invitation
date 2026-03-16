type CookieValue = {
  name: string;
  value: string;
};

type CookieSetCall = {
  name: string;
  value: string;
  options?: unknown;
};

export interface MockCookieStore {
  get: (name: string) => CookieValue | undefined;
  set: (name: string, value: string, options?: unknown) => void;
  delete: (name: string) => void;
  snapshot: () => Record<string, string>;
  setCalls: CookieSetCall[];
}

export function createMockCookieStore(
  initialValues: Record<string, string> = {}
): MockCookieStore {
  const store = new Map(Object.entries(initialValues));
  const setCalls: CookieSetCall[] = [];

  return {
    get(name) {
      const value = store.get(name);
      return value === undefined ? undefined : { name, value };
    },
    set(name, value, options) {
      store.set(name, value);
      setCalls.push({ name, value, options });
    },
    delete(name) {
      store.delete(name);
    },
    snapshot() {
      return Object.fromEntries(store.entries());
    },
    setCalls,
  };
}

export function createTestFile({
  name,
  type,
  content = 'test-file',
}: {
  name: string;
  type: string;
  content?: string | Uint8Array;
}): File {
  return new File([content], name, { type });
}
