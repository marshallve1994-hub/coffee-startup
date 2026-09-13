import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartProvider } from "./src/cart";
import MenuScreen from "./src/screens/MenuScreen";
import CartScreen from "./src/screens/CartScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import LoginScreen from "./src/screens/LoginScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
                Menu: "cafe",
                Cart: "cart",
                Orders: "receipt",
                Profile: "person"
              };
              return (
                <Ionicons name={icons[route.name]} size={size} color={color} />
              );
            }
          })}
        >
          <Tab.Screen name="Menu" component={MenuScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Orders" component={OrdersScreen} />
          <Tab.Screen name="Profile" component={LoginScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
