import { useState } from "react"

export default function App() {
  const [tab, setTab] = useState("quotes")

  return (
    <div style={{ padding: 30 }}>
      <h1>Punto Cero Control de Proyectos</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setTab("quotes")}>Cotizaciones</button>
        <button onClick={() => setTab("products")}>Productos</button>
        <button onClick={() => setTab("clients")}>Clientes</button>
        <button onClick={() => setTab("labor")}>Mano de Obra</button>
      </div>

      <hr />

      {tab === "quotes" && <div>Modulo Cotizaciones</div>}
      {tab === "products" && <div>Modulo Productos</div>}
      {tab === "clients" && <div>Modulo Clientes</div>}
      {tab === "labor" && <div>Modulo Mano de Obra</div>}
    </div>
  )
}
