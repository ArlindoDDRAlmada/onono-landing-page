const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export type User = { id: number; email: string; name: string; role: string };
export type TokenOut = { access_token: string; user: User };

export function saveAuth({ access_token, user }: TokenOut) {
  localStorage.setItem("onono_token", access_token);
  localStorage.setItem("onono_user", JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("onono_user");
  return raw ? (JSON.parse(raw) as User) : null;
}

export function clearAuth() {
  localStorage.removeItem("onono_token");
  localStorage.removeItem("onono_user");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("onono_token") : null;
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    throw new Error(typeof detail === "string" ? detail : `Erro ${res.status}`);
  }
  return res.json() as Promise<T>;
}
