import { test } from "node:test";
import assert from "node:assert/strict";
import { addItem, removeItem, total, shipping, grandTotal, orderPayload, SHIPPING_COST, FREE_SHIPPING_FROM } from "../src/cart.js";

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

test("carrito vacío no cobra envío", () => {
  const c = new Map();
  assert.equal(shipping(c), 0);
  assert.equal(grandTotal(c), 0);
});

test("subtotal bajo el umbral cobra envío", () => {
  const c = new Map();
  addItem(c, M); // 8900 < 12000
  assert.equal(shipping(c), SHIPPING_COST);
  assert.equal(grandTotal(c), 8900 + SHIPPING_COST);
});

test("subtotal en/por encima del umbral es envío gratis", () => {
  const c = new Map();
  addItem(c, M);
  addItem(c, P); // 19400 >= 12000
  assert.equal(total(c), 19400);
  assert.equal(shipping(c), 0);
  assert.equal(grandTotal(c), 19400);
});

test("el umbral exacto ya es gratis", () => {
  const c = new Map();
  addItem(c, { nombre: "Exacta", precio: FREE_SHIPPING_FROM });
  assert.equal(shipping(c), 0);
});

test("orderPayload aplana items e incluye subtotal, envío y total", () => {
  const c = new Map();
  addItem(c, M); // subtotal 8900 → con envío
  const o = orderPayload(c, "Ana", "ana@mail.com");
  assert.equal(o.nombre, "Ana");
  assert.equal(o.email, "ana@mail.com");
  assert.equal(o.subtotal, 8900);
  assert.equal(o.envio, SHIPPING_COST);
  assert.equal(o.total, 8900 + SHIPPING_COST);
  assert.deepEqual(o.items, [{ nombre: "Margherita", precio: 8900, qty: 1 }]);
});
