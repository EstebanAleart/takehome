# La Nonna — Menú + carrito con Google Sheets de backend

Menú de pizzería en Astro (estático) con carrito client-side, checkout simulado de
Mercado Pago y envío de la orden a una hoja de Google Sheets vía Apps Script.

**URL live:** https://estebanaleart.github.io/takehome/

> La primera vez hay que activar GitHub Pages apuntando a la rama `gh-pages`
> (Settings → Pages → Branch: `gh-pages`). El workflow la crea en cada push a `main`.

![La Nonna](public/hero.webp)

## Cómo preparar una pizza (los pasos, en corto)

Mezclá harina, agua, sal y un toque de levadura hasta formar una masa lisa y dejala
fermentar (24–48 h en frío quedan mejores). Estirá el bollo con las manos dejando el
borde más grueso, poné una base fina de salsa de tomate y la mozzarella, y horneala a
la temperatura más alta que dé tu horno (idealmente a la leña) unos pocos minutos,
hasta que el borde infle y se dore. Sacala, sumá la albahaca fresca y a comer.

## Cómo corre

```bash
npm install
npm run dev      # http://localhost:4321/takehome/
npm run build    # genera dist/ estático
npm test         # tests de la lógica del carrito (node:test)
```

## Arquitectura

- **`src/pages/index.astro`** — página única: hero, menú (masonry estilo Pinterest),
  carrito y modal de pago. Todo el JS del cliente vive en el `<script>` bundleado.
- **`src/cart.js`** — lógica pura del carrito (add/remove/total/payload), sin DOM,
  testeada en `test/cart.test.mjs`.
- **`public/menu.json`** — menú de respaldo (fallback) si no hay endpoint configurado.
- **`public/pizzas/*.webp`, `public/hero.webp`** — imágenes optimizadas a WebP
  (de ~3 MB por PNG a ~120 KB). Reconversión: `node scripts/optimize-images.mjs`.
- **`apps-script/Code.gs`** — Web App: `doGet` devuelve el menú, `doPost` agrega una
  fila a la hoja `ordenes`.

## Conectar Google Sheets (para escritura real)

1. Creá un Google Sheet con dos pestañas: `menu` (columnas `nombre`, `descripcion`,
   `precio`, y opcional `imagen`) y `ordenes`.
2. Extensiones → Apps Script, pegá `apps-script/Code.gs`, y Deploy → New deployment →
   Web app, con acceso "Cualquiera". Copiá la URL que termina en `/exec`.
3. Pegá esa URL en la constante `ENDPOINT` del `<script>` en `index.astro`.

Sin `ENDPOINT` la página corre en **modo demo**: lee `menu.json` y loguea la orden en
consola en vez de escribir en la hoja.

## Qué haría con otra hora

Conectaría el `ENDPOINT` real de Apps Script y probaría el ciclo completo de escritura
en la hoja (hoy quedó cableado y en modo demo por falta de credenciales). Sumaría
persistencia del carrito en `localStorage`, un estado de "sin stock" por producto leído
de la hoja, y validación/format de errores más fina en el POST (reintentos, timeout).
En diseño, cargaría el menú con `content-visibility` y `srcset` para servir imágenes por
densidad de pantalla, y agregaría un par de tests de integración del render del menú con
Playwright además de los unitarios que ya están.

## Supuestos

- **Astro obligatorio**: el spec lo pide explícito, así que descarté Next aunque se
  mencionó al pasar.
- **Mercado Pago simulado**: la integración real necesita backend con access token
  secreto (imposible de guardar seguro con Sheets/Apps Script) y procesar pagos reales
  queda fuera de alcance. El checkout imita el flujo (procesando → aprobado) y recién
  ahí hace el POST de la orden con `metodo`, `pago` y un `payment_id` simulado.
- **Sin endpoint en el repo**: no hardcodeo una URL de Apps Script (rotaría y expondría
  la hoja). Queda en modo demo con fallback a `menu.json`, y documentado cómo enchufarlo.
- **Envío como texto plano**: el POST usa `Content-Type: text/plain` a propósito, para
  esquivar el preflight CORS que las Web Apps de Apps Script no manejan.
- **Ítems aplanados**: cada orden guarda `items` como JSON (`nombre`, `precio`, `qty`)
  más `total` y timestamp.
- **`base: /takehome`**: pensado para servirse bajo ese subpath en GitHub Pages.
- **Menú de 6 pizzas con precios de ejemplo** en pesos argentinos.
- **Envío**: gratis desde $12.000 de subtotal; abajo de eso, costo fijo de **$1.500**
  (el monto no estaba en el spec, lo asumí). Se suma al total y se guarda en la orden.

## Tests

`npm test` corre 5 casos sobre la lógica del carrito (acumular cantidades, total,
quitar hasta cero, quitar inexistente, payload de la orden). Son la parte con lógica
real; el resto es render y wiring.
