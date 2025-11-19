const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    //  JWT / cookie，可以一起帶
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<T>;
}