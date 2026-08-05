import { test } from "node:test";
import assert from "node:assert/strict";
import { addItem, removeItem, total, orderPayload } from "../src/cart.js";

const M = { nombre: "Margherita", precio: 8900 };
const P = { nombre: "Pepperoni", precio: 10500 };

test("addItem acumula cantidades del mismo producto", () => {
  const c = new Map();
  addItem(c, M);
  addItem(c, M);
  assert.equal(c.get("Margherita").qty, 2);
  assert.equal(c.size, 1);
});

test("total suma precio * cantidad", () => {
  const c = new Map();
  addItem(c, M);
  addItem(c, M);
  addItem(c, P);
  assert.equal(total(c), 8900 * 2 + 10500);
});

test("removeItem baja cantidad y borra al llegar a cero", () => {
  const c = new Map();
  addItem(c, M);
  addItem(c, M);
  removeItem(c, "Margherita");
  assert.equal(c.get("Margherita").qty, 1);
  removeItem(c, "Margherita");
  assert.equal(c.has("Margherita"), false);
});

test("removeItem sobre inexistente no rompe", () => {
  const c = new Map();
  assert.doesNotThrow(() => removeItem(c, "Fantasma"));
  assert.equal(total(c), 0);
});

test("orderPayload aplana items y calcula total", () => {
  const c = new Map();
  addItem(c, M);
  addItem(c, P);
  const o = orderPayload(c, "Ana", "ana@mail.com");
  assert.equal(o.nombre, "Ana");
  assert.equal(o.email, "ana@mail.com");
  assert.equal(o.total, 8900 + 10500);
  assert.deepEqual(o.items, [
    { nombre: "Margherita", precio: 8900, qty: 1 },
    { nombre: "Pepperoni", precio: 10500, qty: 1 },
  ]);
});
