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

export function total(cart) {
  let t = 0;
  for (const { producto, qty } of cart.values()) t += producto.precio * qty;
  return t;
}

export const money = n => "$" + Number(n).toLocaleString("es-AR");

export function orderPayload(cart, nombre, email) {
  return {
    nombre,
    email,
    items: [...cart.values()].map(({ producto, qty }) => ({
      nombre: producto.nombre, precio: producto.precio, qty,
    })),
    total: total(cart),
  };
}
