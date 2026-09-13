import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Server } from "http";
import { app } from "./server";

let server: Server;
let base = "";

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const addr = server.address();
  if (addr && typeof addr === "object") {
    base = "http://127.0.0.1:" + addr.port;
  }
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("api", () => {
  it("health check responds", async () => {
    const res = await fetch(base + "/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("rejects login with wrong password", async () => {
    const res = await fetch(base + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@coffee.com", password: "wrong" })
    });
    expect(res.status).toBe(401);
  });

  it("requires a token for orders", async () => {
    const res = await fetch(base + "/api/orders");
    expect(res.status).toBe(401);
  });
});
