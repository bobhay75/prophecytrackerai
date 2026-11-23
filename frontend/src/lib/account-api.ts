export class ApiError extends Error {
  constructor(message: string, public code: string, public status: number) { super(message); }
}
export const API_URL = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/index.php`;
export async function api<T>(action: string, body?: unknown, csrf?: string, query: Record<string, string> = {}): Promise<T> {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 35000);
  try {
    const response = await fetch(`${API_URL}?${new URLSearchParams({ ...query, action })}`, {
      method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf || '' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    if (text.length > 2 * 1024 * 1024) throw new Error('The account response was too large.');
    let data: { ok?: boolean; code?: string; message?: string };
    try { data = JSON.parse(text); } catch { throw new ApiError('The account service is not installed at this address. Public observations remain available.', 'setup_required', response.status); }
    if (!response.ok || !data.ok) throw new ApiError(data.message || 'The request could not be completed.', data.code || 'request_failed', response.status);
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) throw new ApiError('The request timed out. For a purchase, check the existing payment before starting another.', 'timeout', 0);
    throw new ApiError('The account service could not be reached. Check your connection and try again.', 'network', 0);
  } finally { clearTimeout(timer); }
}
