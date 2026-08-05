# Transcripción — Take-home con Claude (Claude Code)

Transcripción de la conversación con Claude Code mientras construía el take-home.
Incluye los prompts, las correcciones sobre la marcha y los callejones sin salida
(el usuario fue mandando mensajes en medio del trabajo, por eso el ida y vuelta es
tan picado). Modo "Ponytail" activo: sesgo a la solución más simple que funcione.

---

**Usuario:** [Pega la consigna completa del take-home: menú de restaurante con carrito
y Google Sheets de backend, stack Astro + Apps Script, entregables README/chat.md, etc.]
`usa el repo takehome`

**Claude:** Reviso el repo `takehome` (git limpio, sin commits) y las herramientas
(node 24, npm 11, `gh` sin login).

**Usuario:** vamos a hacerlo rapidito .. que funcione y chau .. hacelo en next

**Usuario:** ahh no astro dice no ?

**Claude:** Sí, el spec pide Astro explícitamente, así que voy con Astro (ya lo había
arrancado). Creo `package.json`, `astro.config.mjs` (base `/takehome`), `.gitignore`,
el `apps-script/Code.gs` (`doGet` menú / `doPost` orden) y el workflow de GitHub Pages.

**Usuario:** hacelo todo completo .. ni lo voy a revisar asi que hacelo testea y manda a main

**Claude:** Armo la página `index.astro` con menú + carrito + envío de orden, todo
client-side vanilla (sin framework de islas, no hace falta). Menú desde el endpoint de
Apps Script con fallback a `menu.json`.

**Usuario:** segui las indicaciones que me pasaron

**Usuario:** gracias

**Usuario:** usa alguna skill de ahi para el diseño .. cortala con super ia.. algo mas para marketing

**Claude:** Instalo dependencias, compilo (OK) y cargo la skill `design-systems-library`.
El usuario no nombró marca y pidió no frenar a preguntar, así que elijo **Airbnb**
(cálido, coral, fotográfico). Reescribo la página con ese lenguaje visual (canvas
blanco, acento Rausch #ff385c, Inter, esquinas redondeadas, hero de marketing).

**Callejón sin salida #1 (bug de la barra):** Al verificar en el navegador, el menú
quedaba en "Cargando menú…". Network: `GET /takehomemenu.json → 404`. El `BASE` venía
sin barra final (`/takehome` en vez de `/takehome/`). Fix: normalizar la barra.

**Usuario:** dame el promp para una imagen de pizza mejor .. por favor .. o para generar el menu con chatgpt ya

**Usuario:** quita los icon de ia que son una mierda ..

**Claude:** Saco todos los emoji (cards, hero, pills, footer). En su lugar, tiles de
gradiente limpios y soporte para una columna opcional `imagen` con foto real.

**Usuario:** Hecho con 🍅 y mucho fuego — esa frase es una mierda .. pone otra cosa

**Claude:** Cambio la frase del footer por "Masa madre, horno a leña, ingredientes de
estación".

**Usuario:** hacelo mobile first .. acomoda todos los estilos .. estan hechos una mierda .. select botones todo por favor

**Usuario:** los agregar son una mierda tambien

**Callejón sin salida #2 (scoping de Astro):** Los botones "Agregar" salían grises sin
estilo. Causa raíz: Astro **scopea** el `<style>` y los elementos que inyecto por JS no
reciben ese scope. Fix: `<style is:global>`. De paso reescribo todo mobile-first
(breakpoints 720/960) con controles pulidos (touch targets, focus rings, steppers).

**Claude:** Verifico en el navegador: agregar → total → enviar → carrito vacío + éxito.
Extraje la lógica del carrito a `src/cart.js` (puro) y la testeé con `node:test` (5/5).

**Usuario:** cash out .. simula mercado pago ... necesitas credenciales de prueba ?

**Claude:** No, no necesito credenciales. Lo simulo entero client-side (la integración
real necesita backend con token secreto y procesar pagos reales queda fuera de alcance).
Implemento un checkout estilo MP: el botón abre un modal, al "Pagar" muestra
"procesando → aprobado" y recién ahí hace el POST de la orden con estado de pago.

**Usuario:** ojo que con los scroll tiene comportamientos raros ..se mueve

**Claude:** Confirmado con JS directo que "Agregar" funciona (Margherita ×2 = $17.800);
el "carrito vacío" que veía antes era artefacto de la automatización del navegador con
los scrolls/reloads, no bug del código.

**Usuario:** [Adjunta 7 imágenes de pizzas + horno] ahi tenes las imagenes .. webp por favor sino es una mierda como carga

**Usuario:** falta el menu no ? armalo con esas imagenes los precios y ya

**Claude:** Encuentro los PNG en Downloads (~3 MB c/u). No hay `cwebp` ni `sharp`;
instalo `sharp` (devDep), escribo `scripts/optimize-images.mjs` y convierto los 7 PNG a
WebP con resize (pizzas 700px, hero 1600px, q78) → ~120 KB c/u. Cableo cada imagen al
menú (`menu.json` con `imagen`) y al hero, usando `<img loading="lazy">` real.

**Callejón sin salida #3 (misma barra, otra vez):** El hero no se veía —
`url(/takehomehero.webp)`. El `BASE` del frontmatter también venía sin barra. Fix:
normalizar también ahí.

**Usuario:** mejora el diseño para pizzeria

**Usuario:** pone el icon de mp no seas rata

**Usuario:** diseño como pinterest

**Usuario:** la imgen del hero no se ve

**Usuario:** saca la navbar arriba que no sirve de nada pone La Nonna al lado de la imagen del hero .. y lo de envio gratis tambien

**Usuario:** cuando termines comit y push

**Claude:** Consolido todo:
- Saco la navbar; muevo "La Nonna" y "Envío gratis" al hero, al lado de la imagen.
- Diseño de pizzería: tipografía serif de display (Fraunces), canvas crema cálido,
  sello "A la leña" sobre cada foto, rojo tomate como acento.
- Menú **masonry estilo Pinterest** (`columns: 165px`, cards con foto protagonista).
- Logo de **Mercado Pago** (SVG: óvalo azul + apretón de manos) en el botón de pago
  (ahora azul MP) y en el header del modal.
- Arreglo el hero (era el mismo bug de la barra, ya normalizado).

**Verificación:** El pane del navegador dejó de compositar frames, así que verifico por
DOM + red: las 6 imágenes cargan a 700px, `hero.webp` 200 OK, 2 logos MP presentes,
masonry a 165px, nav eliminada, brand + envío en el hero. Tests 5/5. Build OK.

**Claude:** Escribo README (URL live, cómo preparar una pizza, qué haría con otra hora,
supuestos), este `chat.md`, actualizo `Code.gs` para guardar `metodo`/`pago`/`payment_id`,
y hago commit + push a `main`.
