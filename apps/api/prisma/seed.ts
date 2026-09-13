import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const products = [
  { id: "p1", name: "Espresso",       nameFa: "Espresso",       price: 45000, category: "coffee" },
  { id: "p2", name: "Latte",          nameFa: "Latte",          price: 65000, category: "coffee" },
  { id: "p3", name: "Cappuccino",     nameFa: "Cappuccino",     price: 65000, category: "coffee" },
  { id: "p4", name: "Turkish Coffee", nameFa: "Turkish Coffee", price: 55000, category: "coffee" },
  { id: "p5", name: "Cold Brew",      nameFa: "Cold Brew",      price: 75000, category: "coffee" },
  { id: "p6", name: "Cheesecake",     nameFa: "Cheesecake",     price: 85000, category: "dessert" }
];
async function main() {
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@coffee.com" },
    update: {},
    create: { email: "admin@coffee.com", password, name: "Admin", role: "ADMIN" }

 });
  for (const p of products) {
    await prisma.product.upsert({ where: { id: p.id }, update: p, create: p });
  }
  console.log("Seed done. Admin login: admin@coffee.com / admin123");
}
main().finally(() => prisma.$disconnect());
