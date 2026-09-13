import { API_URL } from "./config";
import { getToken } from "./auth";
async function request(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed");
  }
  return data;

}
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
export const api = {
  register: (body: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  products: (): Promise<Product[]> => request("/products"),
  placeOrder: (items: { productId: string; qty: number }[]) =>
    request("/orders", { method: "POST", body: JSON.stringify({ items }) }),
  orders: (): Promise<Order[]> => request("/orders")
};
