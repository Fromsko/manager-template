export type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (
  response: Response,
  traceId: string,
) => Response | Promise<Response>;
export type ErrorInterceptor = (error: Error, traceId: string) => Error | Promise<Error>;

export interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  traceId: string;
}

class InterceptorManager {
  private readonly requestChain: RequestInterceptor[] = [];
  private readonly responseChain: ResponseInterceptor[] = [];
  private readonly errorChain: ErrorInterceptor[] = [];

  addRequest(fn: RequestInterceptor): () => void {
    this.requestChain.push(fn);
    return () => {
      const i = this.requestChain.indexOf(fn);
      if (i !== -1) this.requestChain.splice(i, 1);
    };
  }

  addResponse(fn: ResponseInterceptor): () => void {
    this.responseChain.push(fn);
    return () => {
      const i = this.responseChain.indexOf(fn);
      if (i !== -1) this.responseChain.splice(i, 1);
    };
  }

  addError(fn: ErrorInterceptor): () => void {
    this.errorChain.push(fn);
    return () => {
      const i = this.errorChain.indexOf(fn);
      if (i !== -1) this.errorChain.splice(i, 1);
    };
  }

  async runRequest(config: RequestConfig): Promise<RequestConfig> {
    let c = config;
    for (const fn of this.requestChain) {
      c = await fn(c);
    }
    return c;
  }

  async runResponse(response: Response, traceId: string): Promise<Response> {
    let r = response;
    for (const fn of this.responseChain) {
      r = await fn(r, traceId);
    }
    return r;
  }

  async runError(error: Error, traceId: string): Promise<Error> {
    let e = error;
    for (const fn of this.errorChain) {
      e = await fn(e, traceId);
    }
    return e;
  }
}

export const interceptors = new InterceptorManager();

let defaultInterceptorsInstalled = false;

function readAccessToken(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined;
  const raw = localStorage.getItem('auth-storage');
  if (!raw) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return undefined;
    const root = parsed as Record<string, unknown>;
    const tokens =
      (root.tokens as Record<string, unknown> | undefined) ??
      ((root.state as Record<string, unknown> | undefined)?.tokens as
        | Record<string, unknown>
        | undefined);
    const token = tokens?.accessToken;
    return typeof token === 'string' ? token : undefined;
  } catch {
    return undefined;
  }
}

export function setupDefaultInterceptors(): void {
  if (defaultInterceptorsInstalled) return;
  defaultInterceptorsInstalled = true;
  interceptors.addRequest((config) => {
    const token = readAccessToken();
    if (
      !token ||
      config.headers.Authorization !== undefined ||
      config.headers.authorization !== undefined
    ) {
      return config;
    }
    return {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${token}` },
    };
  });
}
