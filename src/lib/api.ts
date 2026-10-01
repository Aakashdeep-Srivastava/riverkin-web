/**
 * Tiny fetch wrapper around the RiverKin API.
 *
 * Base URL comes from NEXT_PUBLIC_API_URL (baked in at build time). This is only
 * a thin helper — real endpoints and response types come from `npm run gen:api`.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Fetch JSON from the API. Throws `ApiError` on non-2xx responses.
 *
 * @param path  Path starting with "/" (e.g. "/sites").
 * @param init  Standard fetch init.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(0, 'NEXT_PUBLIC_API_URL is not set');
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `Request to ${path} failed (${res.status})`);
  }

  return (await res.json()) as T;
}
