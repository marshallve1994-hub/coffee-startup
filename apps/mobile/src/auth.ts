import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "token";
export async function setToken(token: string | null) {
  if (token) await AsyncStorage.setItem(KEY, token);
  else await AsyncStorage.removeItem(KEY);
}
export async function getToken() {
  return AsyncStorage.getItem(KEY);
}
