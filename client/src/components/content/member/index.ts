const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Dispatch a global event for the UserContext to handle logout
        window.dispatchEvent(new CustomEvent('auth-error'));
        throw new Error('登入已過期，請重新登入');
      }

      // Try to parse the JSON error body from the backend
      try {
        const errorData = await response.json();
        // Throw an error with the specific message from the backend
        throw new Error(errorData.message || `請求失敗，狀態碼: ${response.status}`);
      } catch (e) {
        // If the body isn't JSON, throw a generic error
        throw new Error(`請求失敗，狀態碼: ${response.status}`);
      }
    }

    // If the request is successful, check for a JSON body
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    // For responses without a body (e.g., 204 No Content)
    return undefined as T;
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};

export default api;