// Apps Script pegado a un Google Sheet con dos pestañas: "menu" y "ordenes".
// menu:    nombre | descripcion | precio
// ordenes: timestamp | nombre | email | items | total
const SS = SpreadsheetApp.getActive();

function doGet() {
  const [head, ...rows] = SS.getSheetByName('menu').getDataRange().getValues();
  const items = rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
  return ContentService.createTextOutput(JSON.stringify(items))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const o = JSON.parse(e.postData.contents);
  // ordenes: timestamp | nombre | email | items(JSON) | subtotal | envio | total | metodo | pago | payment_id
  SS.getSheetByName('ordenes').appendRow([
    new Date(), o.nombre, o.email, JSON.stringify(o.items),
    o.subtotal, o.envio, o.total,
    o.metodo || '', o.pago || '', o.payment_id || '',
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
