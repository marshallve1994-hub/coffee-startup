import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { api } from "../api";
import { setToken } from "../auth";
export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loggedIn, setLoggedIn] = useState(false);
  async function submit() {
    try {
      const res =
        mode === "login"
          ? await api.login({ email, password })
          : await api.register({ name, email, password });
      await setToken(res.token);
      setLoggedIn(true);
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Error");
    }
  }
  if (loggedIn) {
    return (
<View style={styles.container}>
<Text style={styles.title}>You are logged in</Text>
<TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await setToken(null);
            setLoggedIn(false);
          }}
>
<Text style={styles.buttonText}>Log out</Text>
</TouchableOpacity>
</View>
    );
  }
  return (
<View style={styles.container}>
<Text style={styles.title}>
        {mode === "login" ? "Log in" : "Register"}
</Text>
      {mode === "register" && (
<TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
    />
      )}
<TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
<TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
<TouchableOpacity style={styles.button} onPress={submit}>
<Text style={styles.buttonText}>
          {mode === "login" ? "Log in" : "Create account"}
</Text>
</TouchableOpacity>
<TouchableOpacity
        onPress={() => setMode(mode === "login" ? "register" : "login")}
>
<Text style={styles.switch}>
          {mode === "login"
            ? "New here? Create an account"
            : "Have an account? Log in"}
</Text>
</TouchableOpacity>
</View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fafaf9"
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  button: {
    backgroundColor: "#78350f",
    borderRadius: 8,
    padding: 12,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  switch: { color: "#92400e", textAlign: "center", marginTop: 16 }
});
