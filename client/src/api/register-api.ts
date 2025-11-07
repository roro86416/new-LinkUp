export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface RegisterResponse {
  message: string;
  userId?: number;
}

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  try {
    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });

    let result;
    try {
      result = await res.json();
    } catch {
      const text = await res.text();
      throw new Error(`Unexpected response: ${text}`);
    }

    if (!res.ok) throw new Error(result.message || "Registration failed");
    return result;
  } catch (err: unknown) {
    return { message: (err as Error).message };
  }
}
