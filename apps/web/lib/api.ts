export interface Product {
  id: string;
  name: string;
  nameFa: string;
  price: number;
  category: string;
}
export interface OrderItem {
  id: string;
  qty: number;
  price: number;
  product?: Product;
}
export interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}
const TOKEN_KEY = "token";
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed");
  }
  return data;
}

export const api = {
  register: (body: { name: string; email: string; password: string }) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  products: (): Promise<Product[]> => request("/api/products"),
  placeOrder: (items: { productId: string; qty: number }[]) =>
    request("/api/orders", { method: "POST", body: JSON.stringify({ items }) }),
  orders: (): Promise<Order[]> => request("/api/orders")
};
