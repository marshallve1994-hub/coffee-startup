"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Product, Order } from "@/lib/api";
import { useCart } from "@/lib/cart";
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);
  const { items, add, remove, clear, total, count } = useCart();
  useEffect(() => {
    api.products().then(setProducts).catch((e) => setError(e.message));
  }, []);
  async function checkout() {
    setError("");
    try {
      const order = await api.placeOrder(
        items.map((i) => ({ productId: i.productId, qty: i.qty }))
      );
      setPlaced(order);
      clear();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      setError(msg === "No token" ? "Please log in first (open /login)" : msg);
    }
  }
  if (placed) {
    return (
<main className="max-w-xl mx-auto p-6 text-center">
<h1 className="text-2xl font-bold mb-4">Order placed!</h1>
<p className="mb-2">Order number: {placed.id}</p>
<p className="mb-6">Total: {placed.total.toLocaleString()} Toman</p>
<button
          onClick={() => setPlaced(null)}
          className="bg-amber-700 text-white px-4 py-2 rounded-lg"
>
          Back to menu
</button>
</main>
    );
  }
  return (
<main className="max-w-5xl mx-auto p-6">
<header className="flex items-center justify-between mb-8">
<h1 className="text-3xl font-extrabold">Coffee.com</h1>
<a href="/orders" className="text-amber-700 underline">
          My orders
</a>
</header>
      {error && (
<p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}
<div className="grid md:grid-cols-3 gap-6">
<section className="md:col-span-2">
<h2 className="text-xl font-bold mb-4">Menu</h2>
<div className="grid sm:grid-cols-2 gap-4">
            {products.map((p) => (
<div key={p.id} className="bg-white rounded-xl shadow p-4">
<h3 className="font-bold">{p.nameFa || p.name}</h3>
<p className="text-amber-700 font-semibold">
                  {p.price.toLocaleString()} Toman
</p>
<button
                  onClick={() =>
                    add({
                      productId: p.id,
                      name: p.nameFa || p.name,
                      price: p.price
                    })
                  }
                  className="mt-3 w-full bg-amber-800 text-white py-2 rounded-lg"
>
                  Add to cart
</button>
</div>
            ))}
</div>
</section>
<aside className="bg-white rounded-xl shadow p-4 h-fit">
<h2 className="text-xl font-bold mb-4">Cart ({count})</h2>
          {items.length === 0 && <p className="text-stone-500">Cart is empty</p>}
          {items.map((i) => (
<div
              key={i.productId}
              className="flex justify-between items-center mb-2"
>
<span>
                {i.name} x {i.qty}
</span>
<button
                onClick={() => remove(i.productId)}
                className="text-red-600 text-sm"
>
                Remove
</button>
</div>
          ))}
<hr className="my-3" />
<p className="font-bold mb-3">
            Total: {total.toLocaleString()} Toman
</p>
<button
            onClick={checkout}
            disabled={items.length === 0}
            className="w-full bg-green-700 text-white py-2 rounded-lg
                       disabled:opacity-40"
>
            Checkout
</button>
</aside>
</div>
</main>
  );
}
