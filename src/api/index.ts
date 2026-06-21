/**
 * Centralized API configuration for backend-express
 */
export const API_BASE = 'https://zxfile-backend-express.vercel.app'

/**
 * Fetch wrapper that always includes credentials (JWT cookie) and base URL
 */
export async function api(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
  })
}

/**
 * POST JSON helper
 */
export async function apiPost<T = unknown>(path: string, body: T, options: RequestInit = {}): Promise<Response> {
  return api(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * POST FormData helper (for file uploads — do NOT set Content-Type, browser does it with boundary)
 */
export async function apiUpload(path: string, formData: FormData): Promise<Response> {
  return api(path, {
    method: 'POST',
    body: formData,
  })
}
