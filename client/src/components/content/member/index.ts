const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const api = {
  async request(endpoint: string, options: RequestInit = {}) {
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

    if (response.status === 401) {
      // 💡 關鍵：在這裡集中處理 401 錯誤
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // 強制重定向到登入頁
      throw new Error('登入已過期，請重新登入');
    }

    return response;
  },
};

export default api;