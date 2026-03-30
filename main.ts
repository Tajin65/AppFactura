import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 3000);

const script = `
(function () {
  var STORE_KEY = "pcs_project_control_db_v9_railway";
  function uid() { return Math.random().toString(36).slice(2, 10); }
  function round2(v) { return Math.round((Number(v || 0) + Number.EPSILON) * 100) / 100; }
  function num(v) { return Number(v || 0); }
  function money(v, c) {
    var code = c || "MXN";
    return new Intl.NumberFormat(code === "USD" ? "en-US" : "es-MX", { style: "currency", currency: code }).format(num(v));
  }

  var seed = {
    products: [
      { id: "prod_1", partNumber: "EI60001003_V2", shortName: "H1Z2Z2-K/62930 IEC 6mm2", brand: "KIBOR CABLE", unitCost: 12, listPrice: 15, currency: "USD" },
      { id: "prod_2", partNumber: "11010124", shortName: "SigenStor EC 12.0 TPLV", brand: "Sigenergy", unitCost: 1000, listPrice: 1250, currency: "USD" }
    ],
    quotes: [],
    supplierInvoices: [],
    laborEstimates: []
  };

  var db;
  try { db = JSON.parse(localStorage.getItem(STORE_KEY) || "") || JSON.parse(JSON.stringify(seed)); }
  catch (_) { db = JSON.parse(JSON.stringify(seed)); }

  function persist() { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }

  function totals() {
    var sales = round2(db.quotes.reduce(function (a, q) { return a + num(q.subtotal); }, 0));
    var supplier = round2(db.supplierInvoices.reduce(function (a, i) { return a + num(i.beforeTax); }, 0));
    var labor = round2(db.laborEstimates.reduce(function (a, l) { return a + num(l.total); }, 0));
    var net = round2(sales - supplier - labor);
    return { sales: sales, supplier: supplier, labor: labor, net: net };
  }

  function renderTabs() {
    var tabs = ["products", "quotes", "supplier", "labor", "report"];
    var names = { products: "Productos", quotes: "Cotizaciones", supplier: "Facturas", labor: "Mano de obra", report: "Reporte" };
    var html = "";
    for (var i = 0; i < tabs.length; i++) {
      html += '<button class="tab' + (i === 0 ? ' active' : '') + '" data-tab="' + tabs[i] + '">' + names[tabs[i]] + '</button>';
    }
    document.getElementById("tabs").innerHTML = html;
    var buttons = document.querySelectorAll(".tab");
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].onclick = function () {
        for (var j = 0; j < buttons.length; j++) { buttons[j].classList.remove("active"); }
        this.classList.add("active");
        for (var t = 0; t < tabs.length; t++) {
          document.getElementById(tabs[t]).classList.toggle("hidden", tabs[t] !== this.getAttribute("data-tab"));
        }
      };
    }
  }

  function renderKpis() {
    var t = totals();
    var rows = [
      ["Ventas cotizadas", money(t.sales)],
      ["Costo proveedor", money(t.supplier)],
      ["Mano de obra", money(t.labor)],
      ["Utilidad estimada", money(t.net)]
    ];
    var html = "";
    for (var i = 0; i < rows.length; i++) {
      html += '<div class="card"><div class="muted">' + rows[i][0] + '</div><div style="font-size:22px;font-weight:800">' + rows[i][1] + '</div></div>';
    }
    document.getElementById("kpis").innerHTML = html;
  }

  function renderProducts() {
    var tableRows = "";
    for (var i = 0; i < db.products.length; i++) {
      var p = db.products[i];
      tableRows += '<tr><td>' + p.partNumber + '</td><td>' + p.shortName + '</td><td>' + (p.brand || "") + '</td><td class="right">' + money(p.unitCost, p.currency) + '</td><td class="right">' + money(p.listPrice, p.currency) + '</td></tr>';
    }
    document.getElementById("products").innerHTML =
      '<h3>Alta rápida de producto</h3>' +
      '<div class="row">' +
      '<div><label>Número de parte</label><input id="pPart"></div>' +
      '<div><label>Nombre corto</label><input id="pName"></div>' +
      '<div><label>Marca</label><input id="pBrand"></div>' +
      '<div><label>Costo</label><input id="pCost" type="number"></div>' +
      '<div><label>Precio</label><input id="pPrice" type="number"></div>' +
      '<div><label>Moneda</label><select id="pCur"><option>MXN</option><option>USD</option></select></div>' +
      '</div>' +
      '<div style="margin-top:10px"><button class="btn" id="addProd">Agregar producto</button></div>' +
      '<h3>Catálogo</h3>' +
      '<table><thead><tr><th>Parte</th><th>Nombre</th><th>Marca</th><th class="right">Costo</th><th class="right">Precio</th></tr></thead><tbody>' +
      tableRows +
      '</tbody></table>';

    document.getElementById("addProd").onclick = function () {
      var part = document.getElementById("pPart").value.trim();
      var name = document.getElementById("pName").value.trim();
      if (!part || !name) { alert("Captura número de parte y nombre"); return; }
      db.products.push({
        id: uid(),
        partNumber: part,
        shortName: name,
        brand: document.getElementById("pBrand").value,
        unitCost: num(document.getElementById("pCost").value),
        listPrice: num(document.getElementById("pPrice").value),
        currency: document.getElementById("pCur").value
      });
      persist();
      renderAll();
    };
  }

  function renderQuotes() {
    var rows = "";
    for (var i = 0; i < db.quotes.length; i++) {
      var q = db.quotes[i];
      rows += '<tr><td>' + q.folio + '</td><td>' + q.client + '</td><td>' + (q.project || '-') + '</td><td>' + q.currency + '</td><td class="right">' + money(q.subtotal, q.currency) + '</td><td class="right">' + money(q.total, q.currency) + '</td></tr>';
    }
    document.getElementById("quotes").innerHTML =
      '<h3>Nueva cotización</h3>' +
      '<div class="row">' +
      '<div><label>Folio</label><input id="qFolio" placeholder="PCS001AUTO26"></div>' +
      '<div><label>Cliente</label><input id="qClient"></div>' +
      '<div><label>Proyecto</label><input id="qProject"></div>' +
      '<div><label>Moneda</label><select id="qCur"><option>MXN</option><option>USD</option></select></div>' +
      '<div><label>Subtotal</label><input id="qSub" type="number"></div>' +
      '<div><label>IVA %</label><input id="qTax" type="number" value="16"></div>' +
      '</div>' +
      '<div style="margin-top:10px"><button class="btn" id="saveQuote">Guardar cotización</button></div>' +
      '<h3>Cotizaciones guardadas</h3>' +
      '<table><thead><tr><th>Folio</th><th>Cliente</th><th>Proyecto</th><th>Moneda</th><th class="right">Subtotal</th><th class="right">Total</th></tr></thead><tbody>' + rows + '</tbody></table>';

    document.getElementById("saveQuote").onclick = function () {
      var subtotal = num(document.getElementById("qSub").value);
      var taxPct = num(document.getElementById("qTax").value);
      var tax = round2(subtotal * (taxPct / 100));
      db.quotes.push({
        id: uid(),
        folio: document.getElementById("qFolio").value || ('PCS' + String(db.quotes.length + 1).padStart(3, '0') + 'AUTO26'),
        client: document.getElementById("qClient").value || "Sin cliente",
        project: document.getElementById("qProject").value,
        currency: document.getElementById("qCur").value,
        subtotal: subtotal,
        taxPercent: taxPct,
        total: round2(subtotal + tax)
      });
      persist();
      renderAll();
    };
  }

  function renderSupplier() {
    var rows = "";
    for (var i = 0; i < db.supplierInvoices.length; i++) {
      var inv = db.supplierInvoices[i];
      rows += '<tr><td>' + inv.invoiceNumber + '</td><td>' + inv.supplier + '</td><td>' + (inv.quoteFolio || '-') + '</td><td class="right">' + money(inv.beforeTax) + '</td></tr>';
    }
    document.getElementById("supplier").innerHTML =
      '<h3>Factura proveedor</h3>' +
      '<div class="row">' +
      '<div><label>Factura/UUID</label><input id="iNumber"></div>' +
      '<div><label>Proveedor</label><input id="iSupp"></div>' +
      '<div><label>Folio cotización</label><input id="iQuote"></div>' +
      '<div><label>Subtotal</label><input id="iSub" type="number"></div>' +
      '</div>' +
      '<div style="margin-top:10px"><button class="btn" id="saveInv">Guardar factura</button></div>' +
      '<h3>Facturas</h3>' +
      '<table><thead><tr><th>Factura</th><th>Proveedor</th><th>Cotización</th><th class="right">Subtotal</th></tr></thead><tbody>' + rows + '</tbody></table>';

    document.getElementById("saveInv").onclick = function () {
      db.supplierInvoices.push({
        id: uid(),
        invoiceNumber: document.getElementById("iNumber").value || "SIN-FOLIO",
        supplier: document.getElementById("iSupp").value || "N/D",
        quoteFolio: document.getElementById("iQuote").value,
        beforeTax: num(document.getElementById("iSub").value)
      });
      persist();
      renderAll();
    };
  }

  function renderLabor() {
    var rows = "";
    for (var i = 0; i < db.laborEstimates.length; i++) {
      var l = db.laborEstimates[i];
      rows += '<tr><td>' + (l.quoteFolio || '-') + '</td><td>' + (l.project || '-') + '</td><td class="right">' + money(l.total) + '</td></tr>';
    }
    document.getElementById("labor").innerHTML =
      '<h3>Estimación de mano de obra</h3>' +
      '<div class="row">' +
      '<div><label>Folio cotización</label><input id="lQuote"></div>' +
      '<div><label>Proyecto</label><input id="lProject"></div>' +
      '<div><label>Total mano de obra</label><input id="lTotal" type="number"></div>' +
      '</div>' +
      '<div style="margin-top:10px"><button class="btn" id="saveLab">Guardar estimación</button></div>' +
      '<h3>Estimaciones</h3>' +
      '<table><thead><tr><th>Cotización</th><th>Proyecto</th><th class="right">Total</th></tr></thead><tbody>' + rows + '</tbody></table>';

    document.getElementById("saveLab").onclick = function () {
      db.laborEstimates.push({
        id: uid(),
        quoteFolio: document.getElementById("lQuote").value,
        project: document.getElementById("lProject").value,
        total: num(document.getElementById("lTotal").value)
      });
      persist();
      renderAll();
    };
  }

  function renderReport() {
    var rows = "";
    for (var i = 0; i < db.quotes.length; i++) {
      var q = db.quotes[i];
      var supplier = db.supplierInvoices.filter(function (x) { return x.quoteFolio === q.folio; }).reduce(function (a, x) { return a + num(x.beforeTax); }, 0);
      var labor = db.laborEstimates.filter(function (x) { return x.quoteFolio === q.folio; }).reduce(function (a, x) { return a + num(x.total); }, 0);
      var net = round2(num(q.subtotal) - supplier - labor);
      var margin = q.subtotal ? round2((net / q.subtotal) * 100) : 0;
      rows += '<tr><td>' + q.folio + '</td><td>' + q.client + '</td><td class="right">' + money(q.subtotal, q.currency) + '</td><td class="right">' + money(supplier, q.currency) + '</td><td class="right">' + money(labor, q.currency) + '</td><td class="right">' + money(net, q.currency) + '</td><td class="right">' + margin + '%</td></tr>';
    }
    document.getElementById("report").innerHTML =
      '<h3>Reporte financiero por cotización</h3>' +
      '<table><thead><tr><th>Folio</th><th>Cliente</th><th class="right">Subtotal</th><th class="right">Proveedor</th><th class="right">MO</th><th class="right">Utilidad</th><th class="right">Margen</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function renderAll() {
    renderKpis();
    renderProducts();
    renderQuotes();
    renderSupplier();
    renderLabor();
    renderReport();
  }

  document.getElementById("exportJson").onclick = function () {
    var blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "punto-cero-control.json";
    a.click();
  };

  document.getElementById("importJsonBtn").onclick = function () {
    document.getElementById("importJson").click();
  };

  document.getElementById("importJson").onchange = function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (x) {
      try {
        db = JSON.parse(String(x.target.result || "{}"));
        persist();
        renderAll();
      } catch (_) {
        alert("JSON inválido");
      }
    };
    reader.readAsText(file);
  };

  document.getElementById("reset").onclick = function () {
    db = JSON.parse(JSON.stringify(seed));
    persist();
    renderAll();
  };

  renderTabs();
  renderAll();
})();
`;

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Punto Cero - Control Comercial</title>
  <style>
    :root { --bg:#f8fafc; --card:#fff; --text:#0f172a; --muted:#64748b; --line:#e2e8f0; --primary:#0f766e; }
    * { box-sizing: border-box; font-family: Inter, system-ui, sans-serif; }
    body { margin:0; background:var(--bg); color:var(--text); }
    .wrap{max-width:1200px;margin:0 auto;padding:20px}
    .top{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:end}
    .title{font-size:28px;font-weight:800;margin:6px 0}
    .muted{color:var(--muted);font-size:13px}
    .grid{display:grid;gap:12px}
    .kpis{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin:16px 0}
    .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}
    .tabs{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
    .tab{border:1px solid var(--line);background:#fff;padding:8px 12px;border-radius:999px;cursor:pointer}
    .tab.active{background:var(--text);color:#fff}
    .hidden{display:none}
    label{font-size:12px;color:var(--muted);display:block;margin-bottom:4px}
    input,select,textarea,button{width:100%;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:#fff}
    button{cursor:pointer;font-weight:600}
    .btn{background:var(--primary);color:#fff;border-color:var(--primary)}
    .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th,td{border-bottom:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}
    .right{text-align:right}
    .actions{display:flex;gap:8px;flex-wrap:wrap}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <div class="muted">Punto Cero Soluciones</div>
        <div class="title">Control Comercial (Railway Ready)</div>
      </div>
      <div class="actions">
        <button id="exportJson">Exportar JSON</button>
        <button id="importJsonBtn">Importar JSON</button>
        <input id="importJson" type="file" accept="application/json" class="hidden" />
        <button id="reset">Reiniciar</button>
      </div>
    </div>

    <div class="grid kpis" id="kpis"></div>
    <div class="tabs" id="tabs"></div>

    <section id="products" class="card"></section>
    <section id="quotes" class="card hidden"></section>
    <section id="supplier" class="card hidden"></section>
    <section id="labor" class="card hidden"></section>
    <section id="report" class="card hidden"></section>
  </div>
  <script>${script}</script>
</body>
</html>`;

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Punto Cero app listening on http://0.0.0.0:" + PORT);
});
