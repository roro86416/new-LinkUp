//這支檔案是 登入 API 的專用函式。

import { apiClient } from './apiClient';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/api/auth/login', data);
}
