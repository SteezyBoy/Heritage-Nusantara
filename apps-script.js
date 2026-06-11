// ================================================================
// HERITAGE NUSANTARA - Google Apps Script
// Paste SELURUH kode ini ke Google Apps Script
// Panduan: lihat PANDUAN-SETUP.md
// ================================================================

const SHEET_NAME_ORDERS = "Pesanan";
const SHEET_NAME_MENU   = "Menu";
const ADMIN_PASSWORD    = "heritage2026"; // Ganti password sesuai keinginan

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === "newOrder")   return handleNewOrder(data);
    if (data.action === "updateMenu") return handleUpdateMenu(data);
    return respond({ status: "error", message: "Unknown action" });
  } catch(err) {
    return respond({ status: "error", message: err.toString() });
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === "getOrders") return handleGetOrders(e);
    if (action === "getMenu")   return handleGetMenu(e);
    if (action === "getStats")  return handleGetStats(e);
    return respond({ status: "error", message: "Unknown action" });
  } catch(err) {
    return respond({ status: "error", message: err.toString() });
  }
}

// ── HELPERS ──────────────────────────────────────────────────────
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#ff5400")
      .setFontColor("#ffffff")
      .setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ── ORDER HANDLERS ────────────────────────────────────────────────
function handleNewOrder(data) {
  const headers = [
    "ID Pesanan","Waktu","No. Meja","Nama Item","Qty","Harga Satuan",
    "Subtotal","Catatan","Total Order","Status"
  ];
  const sheet = getOrCreateSheet(SHEET_NAME_ORDERS, headers);

  const orderId   = "ORD-" + new Date().getTime();
  const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  const tableNum  = data.tableNumber || "-";
  const total     = data.items.reduce((s, i) => s + i.price * i.qty, 0);

  data.items.forEach((item, idx) => {
    sheet.appendRow([
      orderId,
      timestamp,
      tableNum,
      item.name,
      item.qty,
      item.price,
      item.price * item.qty,
      item.notes || "-",
      idx === 0 ? total : "",   // total hanya di baris pertama
      "Baru"                     // status default
    ]);
  });

  // Auto-format kolom harga
  const lastRow = sheet.getLastRow();
  const startRow = lastRow - data.items.length + 1;
  sheet.getRange(startRow, 6, data.items.length, 3)
       .setNumberFormat("\"Rp \"#,##0");

  // Warnai baris baru
  sheet.getRange(startRow, 1, data.items.length, headers.length)
       .setBackground("#fff7ed");

  return respond({ status: "ok", orderId: orderId });
}

function handleGetOrders(e) {
  const sheet = getOrCreateSheet(SHEET_NAME_ORDERS, [
    "ID Pesanan","Waktu","No. Meja","Nama Item","Qty","Harga Satuan",
    "Subtotal","Catatan","Total Order","Status"
  ]);

  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return respond({ status: "ok", orders: [] });

  // Kelompokkan per ID pesanan
  const orderMap = {};
  rows.slice(1).forEach(row => {
    const id = row[0];
    if (!id) return;
    if (!orderMap[id]) {
      orderMap[id] = {
        id:        id,
        time:      row[1],
        table:     row[2],
        total:     row[8] || 0,
        status:    row[9],
        items:     []
      };
    }
    orderMap[id].items.push({
      name:     row[3],
      qty:      row[4],
      price:    row[5],
      subtotal: row[6],
      notes:    row[7]
    });
    if (row[8]) orderMap[id].total = row[8];
    orderMap[id].status = row[9];
  });

  const orders = Object.values(orderMap).reverse();
  return respond({ status: "ok", orders: orders });
}

function handleGetStats(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ORDERS);
  if (!sheet) return respond({ status: "ok", stats: {} });

  const rows = sheet.getDataRange().getValues().slice(1);
  const today = new Date().toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });

  let totalRevenue = 0, todayRevenue = 0, totalOrders = 0, todayOrders = new Set();
  const itemCount = {}, orderIds = new Set();

  rows.forEach(row => {
    const id = row[0]; if (!id) return;
    const rowDate = new Date(row[1]).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });
    const subtotal = Number(row[6]) || 0;
    const itemName = row[3];
    const qty = Number(row[4]) || 0;

    totalRevenue += subtotal;
    itemCount[itemName] = (itemCount[itemName] || 0) + qty;

    if (!orderIds.has(id)) {
      orderIds.add(id);
      totalOrders++;
    }
    if (rowDate === today) {
      todayRevenue += subtotal;
      todayOrders.add(id);
    }
  });

  const topItems = Object.entries(itemCount)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  return respond({
    status: "ok",
    stats: {
      totalRevenue,
      todayRevenue,
      totalOrders,
      todayOrders: todayOrders.size,
      topItems
    }
  });
}

// ── MENU HANDLERS ─────────────────────────────────────────────────
function handleGetMenu(e) {
  const sheet = getOrCreateSheet(SHEET_NAME_MENU, [
    "Kategori","Nama","Harga","Deskripsi","Gambar","Best Seller"
  ]);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return respond({ status: "ok", menu: [] });

  const menu = rows.slice(1).map(r => ({
    category:   r[0],
    name:       r[1],
    price:      Number(r[2]),
    desc:       r[3],
    image:      r[4],
    bestSeller: r[5] === true || r[5] === "TRUE" || r[5] === "true"
  }));
  return respond({ status: "ok", menu: menu });
}

function handleUpdateMenu(data) {
  const sheet = getOrCreateSheet(SHEET_NAME_MENU, [
    "Kategori","Nama","Harga","Deskripsi","Gambar","Best Seller"
  ]);
  // Hapus semua data (kecuali header), tulis ulang
  if (sheet.getLastRow() > 1)
    sheet.getRange(2, 1, sheet.getLastRow()-1, 6).clearContent();

  const rows = data.menu.map(item => [
    item.category, item.name, item.price,
    item.desc, item.image, item.bestSeller
  ]);
  if (rows.length > 0)
    sheet.getRange(2, 1, rows.length, 6).setValues(rows);

  return respond({ status: "ok" });
}

// ── UPDATE STATUS ─────────────────────────────────────────────────
function updateOrderStatus(orderId, newStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ORDERS);
  if (!sheet) return;
  const rows = sheet.getDataRange().getValues();
  rows.forEach((row, i) => {
    if (i === 0) return;
    if (row[0] === orderId) {
      sheet.getRange(i+1, 10).setValue(newStatus);
      const color = newStatus === "Selesai" ? "#dcfce7"
                  : newStatus === "Diproses" ? "#fef9c3" : "#fff7ed";
      sheet.getRange(i+1, 1, 1, 10).setBackground(color);
    }
  });
}
