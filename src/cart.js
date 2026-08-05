// Lógica pura del carrito — sin DOM, testeable. El carrito es un Map
// nombre -> { producto, qty }. Estas funciones lo mutan y calculan totales.

export function addItem(cart, producto) {
  const e = cart.get(producto.nombre) || { producto, qty: 0 };
  e.qty++;
  cart.set(producto.nombre, e);
  return cart;
}

export function removeItem(cart, nombre) {
  const e = cart.get(nombre);
  if (!e) return cart;
  if (--e.qty <= 0) cart.delete(nombre);
  return cart;
}

// Envío: gratis desde $12.000 de subtotal; abajo de eso, costo fijo.
export const FREE_SHIPPING_FROM = 12000;
export const SHIPPING_COST = 1500;

// Subtotal = suma de ítems (sin envío).
export function total(cart) {
  let t = 0;
  for (const { producto, qty } of cart.values()) t += producto.precio * qty;
  return t;
}

export function shipping(cart) {
  const sub = total(cart);
  return sub > 0 && sub < FREE_SHIPPING_FROM ? SHIPPING_COST : 0;
}

export function grandTotal(cart) {
  return total(cart) + shipping(cart);
}

export const money = n => "$" + Number(n).toLocaleString("es-AR");

export function orderPayload(cart, nombre, email) {
  return {
    nombre,
    email,
    items: [...cart.values()].map(({ producto, qty }) => ({
      nombre: producto.nombre, precio: producto.precio, qty,
    })),
    subtotal: total(cart),
    envio: shipping(cart),
    total: grandTotal(cart),
  };
}
