// ==================== APPS SCRIPT BACKEND ====================
// Heritage Nusantara - Integrasi Google Sheets dengan Out of Stock, History, Waktu Selesai

const SHEET_NAME_ORDERS = "Pesanan";
const SHEET_NAME_MENU = "Menu";

function doGet(e) {
  const action = e?.parameter?.action || "";
  if (action === "getOrders") {
    return getOrders();
  } else if (action === "getStats") {
    return getStats();
  } else if (action === "getMenu") {
    return getMenu();
  } else if (action === "getAllOrders") {
    return getAllOrders();
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "Heritage API" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action;
  if (action === "newOrder") {
    return saveOrder(body);
  } else if (action === "updateStatus") {
    return updateOrderStatus(body.orderId, body.newStatus);
  } else if (action === "updateMenu") {
    return updateMenu(body.menu);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unknown action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// -------------------- HELPER SHEET --------------------
function getOrCreateSheet(name, headers) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// -------------------- ORDERS --------------------
function saveOrder(data) {
  const headers = ["ID Pesanan", "Waktu", "No. Meja", "Nama Item", "Qty", "Harga", "Subtotal", "Catatan", "Total", "Status", "Waktu Selesai"];
  const sheet = getOrCreateSheet(SHEET_NAME_ORDERS, headers);
  const orderId = "ORD-" + Utilities.getUuid().slice(0, 8).toUpperCase();
  const now = new Date();
  let totalOrder = 0;
  const rows = [];
  for (let item of data.items) {
    const subtotal = item.qty * item.price;
    totalOrder += subtotal;
    rows.push([
      orderId, now, data.tableNumber, item.name, item.qty, item.price, subtotal, item.notes || "", 0, "Baru", ""
    ]);
  }
  for (let i = 0; i < rows.length; i++) {
    rows[i][8] = totalOrder;
  }
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", orderId }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ORDERS);
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ orders: [] })).setMimeType(ContentService.MimeType.JSON);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const ordersMap = new Map();
  for (let row of data) {
    const id = row[0];
    if (!ordersMap.has(id)) {
      ordersMap.set(id, {
        id, time: row[1], table: row[2], total: row[8], status: row[9], items: []
      });
    }
    ordersMap.get(id).items.push({
      name: row[3], qty: row[4], price: row[5], subtotal: row[6], notes: row[7]
    });
  }
  const orders = Array.from(ordersMap.values()).reverse();
  return ContentService.createTextOutput(JSON.stringify({ orders })).setMimeType(ContentService.MimeType.JSON);
}

function getAllOrders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ORDERS);
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ orders: [] })).setMimeType(ContentService.MimeType.JSON);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const ordersMap = new Map();
  for (let row of data) {
    const id = row[0];
    if (!ordersMap.has(id)) {
      ordersMap.set(id, {
        id, time: row[1], table: row[2], total: row[8], status: row[9], items: [], completedTime: row[10] || null
      });
    }
    ordersMap.get(id).items.push({
      name: row[3], qty: row[4], price: row[5], subtotal: row[6], notes: row[7]
    });
  }
  const orders = Array.from(ordersMap.values()).reverse();
  return ContentService.createTextOutput(JSON.stringify({ orders })).setMimeType(ContentService.MimeType.JSON);
}

function updateOrderStatus(orderId, newStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ORDERS);
  if (!sheet) return;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      sheet.getRange(i + 1, 10).setValue(newStatus);
      if (newStatus === "Selesai") {
        sheet.getRange(i + 1, 11).setValue(new Date());
      }
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
}

function getStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ORDERS);
  let totalOrders = 0, totalRevenue = 0, todayOrders = 0, todayRevenue = 0, topItems = {};
  if (sheet) {
    const data = sheet.getDataRange().getValues();
    const today = new Date().toDateString();
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const orderDate = new Date(row[1]).toDateString();
      const orderTotal = row[8];
      const status = row[9];
      if (status === "Selesai") {
        totalOrders++;
        totalRevenue += orderTotal;
        if (orderDate === today) {
          todayOrders++;
          todayRevenue += orderTotal;
        }
      }
      const itemName = row[3];
      const qty = row[4];
      if (itemName) topItems[itemName] = (topItems[itemName] || 0) + qty;
    }
  }
  const topItemsArr = Object.entries(topItems).map(([name, qty]) => ({ name, qty })).sort((a,b)=>b.qty - a.qty).slice(0,5);
  const stats = { totalOrders, totalRevenue, todayOrders, todayRevenue, topItems: topItemsArr };
  return ContentService.createTextOutput(JSON.stringify({ stats })).setMimeType(ContentService.MimeType.JSON);
}

// -------------------- MENU (dengan outOfStock) --------------------
function getMenu() {
  const sheet = getOrCreateSheet(SHEET_NAME_MENU, ["category", "name", "price", "desc", "image", "bestSeller", "subcategory", "outOfStock"]);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const menu = { makanan: [], minuman: [], dessert: [] };
  for (let row of data) {
    const [cat, name, price, desc, image, bestSeller, subcat, outOfStock] = row;
    const item = { 
      name, 
      price: Number(price), 
      desc, 
      image, 
      bestSeller: bestSeller === true || bestSeller === "true", 
      category: subcat || cat,
      outOfStock: outOfStock === true || outOfStock === "true"
    };
    if (menu[cat]) menu[cat].push(item);
  }
  return ContentService.createTextOutput(JSON.stringify({ menu })).setMimeType(ContentService.MimeType.JSON);
}

function updateMenu(menuArray) {
  const sheet = getOrCreateSheet(SHEET_NAME_MENU, ["category", "name", "price", "desc", "image", "bestSeller", "subcategory", "outOfStock"]);
  sheet.clearContents();
  sheet.getRange(1,1,1,8).setValues([["category", "name", "price", "desc", "image", "bestSeller", "subcategory", "outOfStock"]]);
  const rows = [];
  for (let item of menuArray) {
    rows.push([
      item.category, 
      item.name, 
      item.price, 
      item.desc, 
      item.image, 
      item.bestSeller ? "true" : "false", 
      item.subcategory || item.category,
      item.outOfStock ? "true" : "false"
    ]);
  }
  if (rows.length) sheet.getRange(2, 1, rows.length, 8).setValues(rows);
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
}
