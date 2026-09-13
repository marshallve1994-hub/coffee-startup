import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "../api";
import type { Order } from "../api";
export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.orders().then(setOrders).catch((e) => setError(e.message));
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My orders</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.status}>{item.status}</Text>
            {item.items.map((i) => (
              <Text key={i.id} style={styles.line}>
                {i.product?.nameFa || i.product?.name} x {i.qty}
              </Text>
            ))}
            <Text style={styles.total}>
              Total: {item.total.toLocaleString()} Toman
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No orders yet.</Text>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fafaf9" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },

 card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },
  orderId: { fontWeight: "700" },
  status: { color: "#92400e", marginBottom: 4 },
  line: { color: "#57534e" },
  total: { fontWeight: "600", marginTop: 6 },
  error: { color: "#b91c1c", marginBottom: 8 }
});
