import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { api } from "../api";
import type { Product } from "../api";
import { useCart } from "../cart";
export default function MenuScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const { add, count } = useCart();
  useEffect(() => {
    api.products().then(setProducts).catch((e) => setError(e.message));
  }, []);
  return (
<View style={styles.container}>
<Text style={styles.title}>Coffee.com</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
<FlatList
        data={products}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
<View style={styles.card}>
<Text style={styles.name}>{item.nameFa || item.name}</Text>
<Text style={styles.price}>{item.price.toLocaleString()} Toman</Text>
<TouchableOpacity
              style={styles.button}
              onPress={() =>
                add({
                  productId: item.id,
                  name: item.nameFa || item.name,
                  price: item.price
                })
              }
>
<Text style={styles.buttonText}>Add to cart</Text>
</TouchableOpacity>
</View>
        )}
      />
<Text style={styles.cartInfo}>Items in cart: {count}</Text>
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
  name: { fontSize: 18, fontWeight: "600" },
  price: { color: "#92400e", marginVertical: 6 },
  button: {
    backgroundColor: "#78350f",
    borderRadius: 8,
    padding: 10,
    alignItems: "center"
  },
  buttonText: { color: "#fff" },
  cartInfo: { textAlign: "center", marginTop: 8, color: "#44403c" },
  error: { color: "#b91c1c", marginBottom: 8 }
});
