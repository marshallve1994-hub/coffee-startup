"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Order } from "@/lib/api";
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.orders().then(setOrders).catch((e) => setError(e.message));
  }, []);
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My orders</h1>
      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}
      {orders.length === 0 && !error && (
        <p className="text-stone-500">No orders yet.</p>
      )}
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-bold">{o.id}</span>
            <span className="text-amber-700">{o.status}</span>
          </div>
          {o.items.map((i) => (
            <p key={i.id} className="text-sm text-stone-600">
              {i.product?.nameFa || i.product?.name} x {i.qty}
            </p>
          ))}
          <p className="font-semibold mt-2">
            Total: {o.total.toLocaleString()} Toman

</p>
</div>
      ))}
</main>
  );
}
