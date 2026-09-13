import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { useCart } from "../cart";
import { api } from "../api";
import type { Order } from "../api";
export default function CartScreen() {
  const { items, remove, clear, total, count } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  async function checkout() {
    try {
      const placed = await api.placeOrder(
        items.map((i) => ({ productId: i.productId, qty: i.qty }))
      );
      setOrder(placed);
      clear();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      Alert.alert("Checkout failed", msg + " - log in from the Profile tab.");
    }
  }
  if (order) {
    return (
<View style={styles.container}>
<Text style={styles.title}>Order placed!</Text>
<Text>Order number: {order.id}</Text>
<Text>Total: {order.total.toLocaleString()} Toman</Text>
<TouchableOpacity style={styles.button} onPress={() => setOrder(null)}>
<Text style={styles.buttonText}>Back to cart</Text>
</TouchableOpacity>
</View>
    );
  }
  return (
<View style={styles.container}>
<Text style={styles.title}>Cart ({count})</Text>
<FlatList
        data={items}
        keyExtractor={(i) => i.productId}
        renderItem={({ item }) => (
<View style={styles.row}>
<Text>
              {item.name} x {item.qty}
</Text>
<TouchableOpacity onPress={() => remove(item.productId)}>
<Text style={styles.remove}>Remove</Text>
</TouchableOpacity>
</View>
        )}
        ListEmptyComponent={<Text>Your cart is empty.</Text>}
      />
  <Text style={styles.total}>Total: {total.toLocaleString()} Toman</Text>
      <TouchableOpacity
        style={[styles.button, items.length === 0 && { opacity: 0.4 }]}
        disabled={items.length === 0}
        onPress={checkout}
      >
        <Text style={styles.buttonText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fafaf9" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  total: { fontSize: 18, fontWeight: "700", marginVertical: 12 },
  button: {
    backgroundColor: "#15803d",
    borderRadius: 8,
    padding: 12,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  remove: { color: "#b91c1c" }
});
