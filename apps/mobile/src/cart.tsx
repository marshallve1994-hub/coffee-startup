import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}
interface CartValue {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (productId: string) => void;
  clear: () => void;
  total: number;
  count: number;
}
const CartContext = createContext<CartValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const add = (item: Omit<CartItem, "qty">) =>
    setItems((prev) => {
      const found = prev.find((i) => i.productId === item.productId);
      if (found) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.productId !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

 const count = items.reduce((s, i) => s + i.qty, 0);
  return (
<CartContext.Provider value={{ items, add, remove, clear, total, count }}>
      {children}
</CartContext.Provider>
  );
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
