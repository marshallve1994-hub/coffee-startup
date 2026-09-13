import type { Metadata } from "next";
import "@fontsource/vazirmatn";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
export const metadata: Metadata = {
  title: "Coffee.com - Online Coffee Shop",
  description: "Order coffee online"

};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
