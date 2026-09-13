import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const app = express();
app.use(cors());
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
/* ---------------- validation schemas (Zod) ---------------- */
const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
const orderSchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), qty: z.number().int().positive() }))
    .min(1)

});
const productSchema = z.object({
  name: z.string().min(1),
  nameFa: z.string().min(1),
  price: z.number().int().positive(),
  category: z.string().default("coffee")
});
/* ---------------- auth helpers ---------------- */
type Role = "CUSTOMER" | "ADMIN";
interface AuthUser { id: string; role: Role }
declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}
function signToken(user: AuthUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}
function auth(roles: Role[] = ["CUSTOMER", "ADMIN"]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token" });
    try {
      const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
      if (!roles.includes(payload.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
/* ---------------- auth routes ---------------- */
app.post("/api/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already registered" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash }
  });
  res.json({
    token: signToken({ id: user.id, role: "CUSTOMER" }),
    user: { id: user.id, name, email, role: "CUSTOMER" }
  });
});
app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });
  const ok = user && (await bcrypt.compare(parsed.data.password, user.password));
  if (!ok) return res.status(401).json({ error: "Wrong email or password" });
  res.json({
    token: signToken({ id: user.id, role: user.role as Role }),
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});
/* ---------------- products ---------------- */
app.get("/api/products", async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: { id: "asc" }
  });
  res.json(products);
});
app.post("/api/products", auth(["ADMIN"]), async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const product = await prisma.product.create({ data: parsed.data });
  res.status(201).json(product);
});
/* ---------------- orders ---------------- */
app.post("/api/orders", auth(["CUSTOMER"]), async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid order" });
  const ids = parsed.data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const priceOf = new Map(products.map((p) => [p.id, p.price]));
  let total = 0;
  for (const item of parsed.data.items) {
    const price = priceOf.get(item.productId);
    if (price === undefined) {
      return res.status(400).json({ error: "Unknown product " + item.productId });
    }
    total += price * item.qty;
  }
  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      total,
      items: {
        create: parsed.data.items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          price: priceOf.get(i.productId)!
        }))
      }
    },
    include: { items: true }
  });
  res.status(201).json(order);
});
app.get("/api/orders", auth(["CUSTOMER", "ADMIN"]), async (req, res) => {
  const where = req.user!.role === "ADMIN" ? {} : { userId: req.user!.id };
  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json(orders);
});
/* ---------------- health check ---------------- */
app.get("/api/health", (_req, res) => res.json({ ok: true }));
/* ---------------- start server (skipped during tests) ---------------- */
const port = Number(process.env.PORT ?? 4000);
if (require.main === module) {
  app.listen(port, () => console.log("API ready at http://localhost:" + port));
}
