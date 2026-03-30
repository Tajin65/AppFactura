import { useMemo, useState } from "react";
import { initialData, today } from "./data/seeds";
import { computeLine, computePriceFromCost, fmtCurrency, round2, uid } from "./lib/finance";
import type { AppData, Product, Quote, QuoteItem } from "./types";

const DB_KEY = "pcs_project_control_db_v8";

export default function App() {
  const [db, setDb] = useState<AppData>(() => {
    const saved = localStorage.getItem(DB_KEY);
    if (!saved) return initialData;
    try {
      return { ...initialData, ...JSON.parse(saved) };
    } catch {
      return initialData;
    }
  });
  const [tab, setTab] = useState<"products" | "quotes" | "report">("products");

  const [productForm, setProductForm] = useState<Product>({
    id: "",
    partNumber: "",
    shortName: "",
    presentation: "PZA",
    model: "",
    brand: "",
    costCurrency: "MXN",
    listCurrency: "MXN",
    unitCost: 0,
    listPrice: 0,
    marginPercent: 25,
    description: "",
  });

  const [quoteForm, setQuoteForm] = useState<Quote>({
    id: "",
    folio: "",
    project: "",
    clientId: String(db.clients[0]?.idCliente || ""),
    employeeId: String(db.employees[0]?.idEmpleado || ""),
    quoteDate: today(),
    currency: "MXN",
    exchangeRate: 17,
    taxPercent: 16,
    shipping: 0,
    items: [],
  });

  const [draftItem, setDraftItem] = useState<QuoteItem>({ id: "", catalog: "", description: "", quantity: 1, unitCost: 0, unitPrice: 0 });

  const persist = (next: AppData) => {
    setDb(next);
    localStorage.setItem(DB_KEY, JSON.stringify(next));
  };

  const totals = useMemo(() => {
    const sales = db.quotes.reduce((acc, q) => acc + q.items.map(computeLine).reduce((s, i) => s + i.lineTotal, 0), 0);
    const costs = db.quotes.reduce((acc, q) => acc + q.items.map(computeLine).reduce((s, i) => s + i.lineCost, 0), 0);
    return { sales: round2(sales), costs: round2(costs), net: round2(sales - costs) };
  }, [db.quotes]);

  const saveProduct = () => {
    if (!productForm.partNumber || !productForm.shortName) return;
    persist({ ...db, products: [...db.products, { ...productForm, id: uid() }] });
    setProductForm({ ...productForm, id: "", partNumber: "", shortName: "", description: "" });
  };

  const addQuoteItem = () => {
    if (!draftItem.catalog || !draftItem.description) return;
    setQuoteForm({ ...quoteForm, items: [...quoteForm.items, { ...draftItem, id: uid() }] });
    setDraftItem({ id: "", catalog: "", description: "", quantity: 1, unitCost: 0, unitPrice: 0 });
  };

  const saveQuote = () => {
    const employee = db.employees.find((e) => String(e.idEmpleado) === String(quoteForm.employeeId));
    const seq = String(db.quotes.length + 1).padStart(3, "0");
    const folio = quoteForm.folio || `PCS${seq}${employee?.iniciales || "SALE"}${String(quoteForm.quoteDate).slice(2, 4)}`;
    persist({ ...db, quotes: [...db.quotes, { ...quoteForm, id: uid(), folio }] });
    setQuoteForm({ ...quoteForm, id: "", folio: "", project: "", items: [] });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "punto-cero-control.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Punto Cero Soluciones · Control</h1>
      <p>Vite app separada en módulos, lista para build/deploy en Railway.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("products")}>Productos</button>
        <button onClick={() => setTab("quotes")}>Cotizaciones</button>
        <button onClick={() => setTab("report")}>Reporte</button>
        <button onClick={exportJson}>Exportar JSON</button>
      </div>

      {tab === "products" && (
        <section>
          <h2>Alta de producto</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <input placeholder="Número de parte" value={productForm.partNumber} onChange={(e) => setProductForm({ ...productForm, partNumber: e.target.value })} />
            <input placeholder="Nombre corto" value={productForm.shortName} onChange={(e) => setProductForm({ ...productForm, shortName: e.target.value })} />
            <input placeholder="Marca" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
            <input
              type="number"
              placeholder="Costo"
              value={productForm.unitCost}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  unitCost: Number(e.target.value),
                  listPrice: computePriceFromCost(e.target.value, productForm.marginPercent),
                })
              }
            />
            <input
              type="number"
              placeholder="Margen %"
              value={productForm.marginPercent}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  marginPercent: Number(e.target.value),
                  listPrice: computePriceFromCost(productForm.unitCost, e.target.value),
                })
              }
            />
            <input type="number" placeholder="Precio" value={productForm.listPrice} onChange={(e) => setProductForm({ ...productForm, listPrice: Number(e.target.value) })} />
          </div>
          <textarea style={{ width: "100%", marginTop: 8 }} placeholder="Descripción" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
          <button onClick={saveProduct}>Guardar producto</button>

          <h3>Catálogo ({db.products.length})</h3>
          <table width="100%" cellPadding={6}>
            <thead>
              <tr>
                <th align="left">Parte</th><th align="left">Nombre</th><th align="left">Costo</th><th align="left">Precio</th>
              </tr>
            </thead>
            <tbody>
              {db.products.map((p) => (
                <tr key={p.id}><td>{p.partNumber}</td><td>{p.shortName}</td><td>{fmtCurrency(p.unitCost, p.costCurrency)}</td><td>{fmtCurrency(p.listPrice, p.listCurrency)}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "quotes" && (
        <section>
          <h2>Nueva cotización</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            <input placeholder="Proyecto" value={quoteForm.project} onChange={(e) => setQuoteForm({ ...quoteForm, project: e.target.value })} />
            <input type="date" value={quoteForm.quoteDate} onChange={(e) => setQuoteForm({ ...quoteForm, quoteDate: e.target.value })} />
            <input type="number" value={quoteForm.taxPercent} onChange={(e) => setQuoteForm({ ...quoteForm, taxPercent: Number(e.target.value) })} />
            <input type="number" value={quoteForm.shipping} onChange={(e) => setQuoteForm({ ...quoteForm, shipping: Number(e.target.value) })} />
          </div>
          <h3>Partida</h3>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr 1fr 1fr 1fr", gap: 8 }}>
            <input placeholder="Catálogo" value={draftItem.catalog} onChange={(e) => setDraftItem({ ...draftItem, catalog: e.target.value })} />
            <input placeholder="Descripción" value={draftItem.description} onChange={(e) => setDraftItem({ ...draftItem, description: e.target.value })} />
            <input type="number" value={draftItem.quantity} onChange={(e) => setDraftItem({ ...draftItem, quantity: Number(e.target.value) })} />
            <input type="number" value={draftItem.unitCost} onChange={(e) => setDraftItem({ ...draftItem, unitCost: Number(e.target.value) })} />
            <input type="number" value={draftItem.unitPrice} onChange={(e) => setDraftItem({ ...draftItem, unitPrice: Number(e.target.value) })} />
          </div>
          <button onClick={addQuoteItem}>Agregar partida</button>
          <button onClick={saveQuote} style={{ marginLeft: 8 }}>Guardar cotización</button>

          <ul>
            {quoteForm.items.map((it) => {
              const line = computeLine(it);
              return <li key={it.id}>{it.catalog} · {line.quantity} · {fmtCurrency(line.lineTotal, quoteForm.currency)}</li>;
            })}
          </ul>

          <h3>Cotizaciones guardadas ({db.quotes.length})</h3>
          <table width="100%" cellPadding={6}><thead><tr><th align="left">Folio</th><th align="left">Proyecto</th><th align="left">Subtotal</th></tr></thead><tbody>
            {db.quotes.map((q) => {
              const subtotal = q.items.map(computeLine).reduce((acc, i) => acc + i.lineTotal, 0);
              return <tr key={q.id}><td>{q.folio}</td><td>{q.project || "-"}</td><td>{fmtCurrency(subtotal, q.currency)}</td></tr>;
            })}
          </tbody></table>
        </section>
      )}

      {tab === "report" && (
        <section>
          <h2>Reporte</h2>
          <p>Ventas: <strong>{fmtCurrency(totals.sales, "MXN")}</strong></p>
          <p>Costos: <strong>{fmtCurrency(totals.costs, "MXN")}</strong></p>
          <p>Utilidad estimada: <strong>{fmtCurrency(totals.net, "MXN")}</strong></p>
        </section>
      )}
    </div>
  );
}
