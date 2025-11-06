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
  try {
    const res = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Login failed");
    return result;
  } catch (err: unknown) {
    return { message: (err as Error).message };
  }
}
