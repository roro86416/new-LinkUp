//前端 API 登入請求的入口
//自動帶 token、自動加 header、自動處理錯誤、自動解析 JSON

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // ✅ 如果後端有使用 cookies (可留著沒壞處)
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("登入已過期，請重新登入");
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `請求失敗，狀態碼: ${res.status}` }));
      throw new Error(errorData.message || `請求失敗: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json() as Promise<T>;
    }
    return null as T;
  }

  public get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public put<TResponse, TBody = unknown>(endpoint: string, body: TBody, options: RequestInit = {}) {
    return this.request<TResponse>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) });
  }

  public post<TResponse, TBody = unknown>(endpoint: string, body: TBody, options: RequestInit = {}) {
    return this.request<TResponse>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) });
  }

  public patch<TResponse, TBody = unknown>(endpoint: string, body: TBody, options: RequestInit = {}) {
    return this.request<TResponse>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) });
  }

  public delete<T, B = unknown>(endpoint: string, body?: B, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE", body: body ? JSON.stringify(body) : undefined, });
  }
}

export const apiClient = new ApiClient();