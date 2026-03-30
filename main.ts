import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Download,
  Plus,
  Trash2,
  Receipt,
  Wallet,
  Briefcase,
  Save,
  Upload,
  Calculator,
  Eye,
  Copy,
  Pencil,
  Link2,
  HardHat,
} from "lucide-react";

type CurrencyCode = "MXN" | "USD";

const currencyMx = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});
const currencyUs = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);
const round2 = (n: number | string) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
const toNumber = (value: unknown) => Number(value || 0);
const fmtCurrency = (amount: number | string, code: CurrencyCode = "MXN") =>
  (code === "USD" ? currencyUs : currencyMx).format(toNumber(amount));

type Product = {
  id: string;
  partNumber: string;
  shortName: string;
  presentation: string;
  model: string;
  brand: string;
  manufacturer: string;
  leadTime: string;
  costCurrency: CurrencyCode;
  listCurrency: CurrencyCode;
  supplierSku: string;
  content: number;
  substitutes: string;
  discontinued: boolean;
  unitCost: number;
  listPrice: number;
  marginPercent: number;
  description: string;
  imagePath: string;
  notes: string;
  category: string;
  active: boolean;
};

type Contact = {
  idContacto: number;
  idCliente: number | string;
  nombre: string;
  puesto: string;
  email: string;
  telefono: string;
  notas: string;
  activo: boolean;
};

type Employee = {
  idEmpleado: number;
  nombre: string;
  apellidos: string;
  fullName: string;
  iniciales: string;
  cargo: string;
  email: string;
  firma: string;
  telefonoTrabajo: string;
  signatureImage: string;
  privilegio: number;
  activo: boolean;
};

type Client = {
  idCliente: number;
  nombreComp: string;
  direccion: string;
  telefono: string;
  email: string;
  credito: number;
  ciudad: string;
  estado: string;
  pais: string;
  notas: string;
  activo: boolean;
};

type QuoteItem = {
  id: string;
  productId?: string;
  part: number;
  catalog: string;
  quantity: number;
  presentation: string;
  description: string;
  model: string;
  brand: string;
  unitCost: number;
  unitPrice: number;
  unitCostOriginal: number;
  unitPriceOriginal: number;
  costCurrency: CurrencyCode;
  priceCurrency: CurrencyCode;
  marginPercent: number;
  currency: CurrencyCode;
  lineCurrency?: CurrencyCode;
  lineTotal?: number;
  lineCostTotal?: number;
  lineProfit?: number;
};

type Quote = {
  id: string;
  exchangeRate: number;
  exchangeRateDate: string;
  contactId: string;
  clientId: string;
  employeeId: string;
  folio: string;
  project: string;
  client: string;
  seller: string;
  attention: string;
  customerNumber: string;
  quoteDate: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  creditTerms: string;
  deliveryTime: string;
  currency: CurrencyCode;
  taxPercent: number;
  shipping: number;
  notes: string;
  status: string;
  items: QuoteItem[];
};

type SupplierInvoiceItem = {
  id: string;
  quantity: number;
  unitCode: string;
  productServiceCode: string;
  sku: string;
  description: string;
  unit: string;
  unitPrice: number;
  amount: number;
  taxObject: string;
  matchedQuoteItemId?: string;
  matchedQuoteCatalog?: string;
};

type SupplierInvoice = {
  id: string;
  invoiceNumber: string;
  uuid: string;
  supplier: string;
  supplierRfc: string;
  customerName: string;
  customerRfc: string;
  project: string;
  quoteFolio: string;
  date: string;
  currency: CurrencyCode;
  exchangeRate: number | string;
  paymentMethod: string;
  paymentForm: string;
  beforeTax: number;
  tax: number;
  withTax: number;
  xmlFileName: string;
  items: SupplierInvoiceItem[];
  notes: string;
};

type PayrollPayment = {
  id: string;
  employee: string;
  project: string;
  date: string;
  amount: number;
  type: string;
  notes: string;
};

type LaborRole = {
  id: string;
  roleName: string;
  dailySalary: number;
  imssPercent: number;
  infonavitPercent: number;
  sarPercent: number;
  aguinaldoPercent: number;
  vacationPercent: number;
  toolCostDaily: number;
  safetyCostDaily: number;
  active: boolean;
};

type LaborLine = {
  id: string;
  roleId: string;
  roleName: string;
  people: number;
  days: number;
  dailyBaseCost: number;
  totalCost: number;
};

type LaborEstimate = {
  id: string;
  quoteFolio: string;
  project: string;
  date: string;
  transportCost: number;
  lodgingCost: number;
  foodCost: number;
  miscCost: number;
  notes: string;
  lines: LaborLine[];
};

type AppData = {
  products: Product[];
  employees: Employee[];
  clients: Client[];
  contacts: Contact[];
  quotes: Quote[];
  supplierInvoices: SupplierInvoice[];
  payrollPayments: PayrollPayment[];
  laborRoles: LaborRole[];
  laborEstimates: LaborEstimate[];
};

type QuoteComputed = Quote & {
  subtotal: number;
  costSubtotal: number;
  tax: number;
  total: number;
  quoteGrossProfit: number;
  supplierCost: number;
  payrollCost: number;
  laborCost: number;
  estimatedNet: number;
  realMarginPercent: number;
};

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const seedProducts: Product[] = [
  {
    id: "prod_1",
    partNumber: "EI60001003_V2",
    shortName: "H1Z2Z2-K/62930 IEC 6mm2",
    presentation: "BOBINA",
    model: "H1Z2Z2-K/62930 IEC",
    brand: "KIBOR CABLE",
    manufacturer: "KIBOR CABLE",
    leadTime: "15",
    costCurrency: "USD",
    listCurrency: "USD",
    supplierSku: "EI60001003_V2",
    content: 1,
    substitutes: "",
    discontinued: false,
    unitCost: 12,
    listPrice: 15,
    marginPercent: 25,
    description: "Conductor Stranded Tinned Copper",
    imagePath: "",
    notes: "",
    category: "Cable",
    active: true,
  },
  {
    id: "prod_2",
    partNumber: "11010124",
    shortName: "SigenStor EC 12.0 TPLV",
    presentation: "PZA",
    model: "11010124",
    brand: "Sigenergy",
    manufacturer: "Sigenergy",
    leadTime: "30",
    costCurrency: "USD",
    listCurrency: "USD",
    supplierSku: "11010124",
    content: 1,
    substitutes: "",
    discontinued: false,
    unitCost: 1000,
    listPrice: 1250,
    marginPercent: 25,
    description: "Sigen Energy Controller 12.0 kW Three Phase Low Voltage",
    imagePath: "",
    notes: "",
    category: "Sigenergy",
    active: true,
  },
];

const seedContacts: Contact[] = [
  { idContacto: 1, idCliente: 15, nombre: "Consuelo", puesto: "Administración", email: "", telefono: "", notas: "Contacto principal", activo: true },
  { idContacto: 2, idCliente: 17, nombre: "Heidi", puesto: "Administración", email: "", telefono: "", notas: "Contacto principal", activo: true },
];

const seedEmployees: Employee[] = [
  {
    idEmpleado: 1,
    nombre: "Alejandro",
    apellidos: "Chi",
    fullName: "Alejandro Chi",
    iniciales: "ACHI",
    cargo: "Ventas",
    email: "a.chi@puntocerosoluciones.mx",
    firma: "Alejandro Chi",
    telefonoTrabajo: "4421713108",
    signatureImage: "",
    privilegio: 1,
    activo: true,
  },
  {
    idEmpleado: 2,
    nombre: "Jose Marcos",
    apellidos: "Martinez Oropeza",
    fullName: "Jose Marcos Martinez Oropeza",
    iniciales: "JMMO",
    cargo: "Ventas",
    email: "m.martinez@puntocerosoluciones.mx",
    firma: "Jose Marcos Martinez Oropeza",
    telefonoTrabajo: "",
    signatureImage: "",
    privilegio: 1,
    activo: true,
  },
];

const seedClients: Client[] = [
  {
    idCliente: 15,
    nombreComp: "Consuelo",
    direccion: "Paseo del Encino 5, CP. 76910, Corregidora, Querétaro, México",
    telefono: "",
    email: "",
    credito: 15,
    ciudad: "Corregidora",
    estado: "Querétaro",
    pais: "México",
    notas: "Condominio Abedul",
    activo: true,
  },
  {
    idCliente: 17,
    nombreComp: "Heidi",
    direccion: "Tulipanes, Tabachines, 76902 El Pueblito, Qro., Corregidora, Querétaro, México",
    telefono: "",
    email: "",
    credito: 0,
    ciudad: "Corregidora",
    estado: "Querétaro",
    pais: "México",
    notas: "Condominio Tulipanes",
    activo: true,
  },
];

const seedLaborRoles: LaborRole[] = [
  { id: "role_1", roleName: "Instalador", dailySalary: 500, imssPercent: 30, infonavitPercent: 5, sarPercent: 2, aguinaldoPercent: 4.5, vacationPercent: 4, toolCostDaily: 120, safetyCostDaily: 40, active: true },
  { id: "role_2", roleName: "Ayudante", dailySalary: 350, imssPercent: 30, infonavitPercent: 5, sarPercent: 2, aguinaldoPercent: 4.5, vacationPercent: 4, toolCostDaily: 70, safetyCostDaily: 30, active: true },
  { id: "role_3", roleName: "Supervisor", dailySalary: 800, imssPercent: 30, infonavitPercent: 5, sarPercent: 2, aguinaldoPercent: 4.5, vacationPercent: 4, toolCostDaily: 80, safetyCostDaily: 35, active: true },
];

const initialData: AppData = {
  products: seedProducts,
  employees: seedEmployees,
  clients: seedClients,
  contacts: seedContacts,
  quotes: [],
  supplierInvoices: [],
  payrollPayments: [],
  laborRoles: seedLaborRoles,
  laborEstimates: [],
};

function csvEscape(value: unknown) {
  const str = String(value ?? "");
  return `"${str.replaceAll('"', '""')}"`;
}

function exportArrayToCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return alert("No hay datos para exportar.");
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function computePriceFromCost(cost: number | string, marginPercent: number | string) {
  return round2(toNumber(cost) * (1 + toNumber(marginPercent) / 100));
}

function computeMarginFromCostAndPrice(cost: number | string, price: number | string) {
  if (!toNumber(cost)) return 0;
  return round2(((toNumber(price) - toNumber(cost)) / toNumber(cost)) * 100);
}

function convertCurrencyAmount(amount: number | string, fromCurrency: string, toCurrency: string, exchangeRate: number | string) {
  const amt = toNumber(amount);
  const rate = toNumber(exchangeRate);
  if (!amt) return 0;
  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) return round2(amt);
  if (!rate) return round2(amt);
  if (fromCurrency === "USD" && toCurrency === "MXN") return round2(amt * rate);
  if (fromCurrency === "MXN" && toCurrency === "USD") return round2(amt / rate);
  return round2(amt);
}

function getFirstByLocalName(root: Document, localName: string): Element | null {
  const all = root.getElementsByTagName("*");
  for (const node of Array.from(all)) {
    if (node.localName === localName) return node;
  }
  return null;
}

function normalizeCatalog(value: string) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function parseCfdiXmlText(xmlText: string): Omit<SupplierInvoice, "id"> {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");
  const parseError = xml.getElementsByTagName("parsererror")[0];
  if (parseError) throw new Error("XML inválido");

  const comprobante = getFirstByLocalName(xml, "Comprobante");
  const emisor = getFirstByLocalName(xml, "Emisor");
  const receptor = getFirstByLocalName(xml, "Receptor");
  const timbre = getFirstByLocalName(xml, "TimbreFiscalDigital");
  const impuestos = getFirstByLocalName(xml, "Impuestos");
  const conceptos = Array.from(xml.getElementsByTagName("*")).filter((n) => n.localName === "Concepto");

  const serie = comprobante?.getAttribute("Serie") || "";
  const folio = comprobante?.getAttribute("Folio") || "";
  const uuid = timbre?.getAttribute("UUID") || "";
  const subtotal = Number(comprobante?.getAttribute("SubTotal") || 0);
  const total = Number(comprobante?.getAttribute("Total") || 0);
  const currency = (comprobante?.getAttribute("Moneda") || "MXN") as CurrencyCode;
  const exchangeRate = comprobante?.getAttribute("TipoCambio") || "";
  const date = (comprobante?.getAttribute("Fecha") || today()).slice(0, 10);
  const paymentMethod = comprobante?.getAttribute("MetodoPago") || "";
  const paymentForm = comprobante?.getAttribute("FormaPago") || "";

  let taxAmount = Number(impuestos?.getAttribute("TotalImpuestosTrasladados") || 0);
  if (!taxAmount) {
    taxAmount = Array.from(xml.getElementsByTagName("*")).filter((n) => n.localName === "Traslado").reduce((acc, t) => acc + Number(t.getAttribute("Importe") || 0), 0);
  }
  if (!taxAmount) taxAmount = round2(total - subtotal);

  const items: SupplierInvoiceItem[] = conceptos.map((node, idx) => ({
    id: `xml_item_${idx + 1}`,
    quantity: Number(node.getAttribute("Cantidad") || 0),
    unitCode: node.getAttribute("ClaveUnidad") || "",
    productServiceCode: node.getAttribute("ClaveProdServ") || "",
    sku: node.getAttribute("NoIdentificacion") || "",
    description: node.getAttribute("Descripcion") || "",
    unit: node.getAttribute("Unidad") || "",
    unitPrice: Number(node.getAttribute("ValorUnitario") || 0),
    amount: Number(node.getAttribute("Importe") || 0),
    taxObject: node.getAttribute("ObjetoImp") || "",
  }));

  return {
    invoiceNumber: [serie, folio].filter(Boolean).join("/") || uuid || "SIN-FOLIO",
    uuid,
    supplier: emisor?.getAttribute("Nombre") || "",
    supplierRfc: emisor?.getAttribute("Rfc") || "",
    customerName: receptor?.getAttribute("Nombre") || "",
    customerRfc: receptor?.getAttribute("Rfc") || "",
    project: "",
    quoteFolio: "",
    date,
    currency,
    exchangeRate,
    paymentMethod,
    paymentForm,
    beforeTax: subtotal,
    tax: round2(taxAmount),
    withTax: total,
    xmlFileName: "",
    items,
    notes: "",
  };
}

function computeLine(item: QuoteItem): QuoteItem {
  const quantity = toNumber(item.quantity);
  const unitCost = toNumber(item.unitCost);
  const unitPrice = toNumber(item.unitPrice);
  const lineTotal = round2(quantity * unitPrice);
  const lineCostTotal = round2(quantity * unitCost);
  return {
    ...item,
    quantity,
    unitCost,
    unitPrice,
    lineTotal,
    lineCostTotal,
    lineProfit: round2(lineTotal - lineCostTotal),
    marginPercent: computeMarginFromCostAndPrice(unitCost, unitPrice),
  };
}

function computeLaborRoleDailyCost(role: LaborRole) {
  const salary = toNumber(role.dailySalary);
  const burdens = salary * ((toNumber(role.imssPercent) + toNumber(role.infonavitPercent) + toNumber(role.sarPercent) + toNumber(role.aguinaldoPercent) + toNumber(role.vacationPercent)) / 100);
  return round2(salary + burdens + toNumber(role.toolCostDaily) + toNumber(role.safetyCostDaily));
}

function computeLaborEstimateTotal(estimate: LaborEstimate) {
  const linesTotal = round2((estimate.lines || []).reduce((acc, line) => acc + toNumber(line.totalCost), 0));
  return round2(linesTotal + toNumber(estimate.transportCost) + toNumber(estimate.lodgingCost) + toNumber(estimate.foodCost) + toNumber(estimate.miscCost));
}

function QuotePreview({ quote, employee }: { quote: QuoteComputed | Quote; employee?: Employee }) {
  const items = (quote.items || []).map(computeLine);
  const subtotal = round2(items.reduce((acc, item) => acc + (item.lineTotal || 0), 0));
  const tax = round2(subtotal * (toNumber(quote.taxPercent) / 100));
  const total = round2(subtotal + tax + toNumber(quote.shipping));

  return (
    <div className="mx-auto max-w-5xl bg-white p-8 text-slate-900">
      <div className="flex items-start justify-between gap-8 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold">PUNTO CERO SOLUCIONES</h1>
          <p className="mt-2 text-sm text-slate-600">Paseo del Condado 7, Corregidora, Qro.</p>
          <p className="text-sm text-slate-600">Tel: +52 4421713108</p>
          <p className="text-sm text-slate-600">RFC: CTS151026M23</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">COTIZACIÓN</p>
          <p className="text-2xl font-bold">#{quote.folio}</p>
          <p className="mt-2 text-sm">Fecha: {quote.quoteDate}</p>
          <p className="text-sm">Moneda: {quote.currency}</p>
          <p className="text-sm">TC: {quote.exchangeRate}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-500">Cliente</p>
          <p className="mt-1 font-medium">{quote.client}</p>
          <p className="text-sm">Atención: {quote.attention || quote.client}</p>
          {quote.contactEmail ? <p className="text-sm">Email: {quote.contactEmail}</p> : null}
          {quote.contactPhone ? <p className="text-sm">Tel: {quote.contactPhone}</p> : null}
          <p className="text-sm">Dirección: {quote.address || "-"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Proyecto</p>
          <p className="mt-1 font-medium">{quote.project || "-"}</p>
          <p className="text-sm">Vendedor: {quote.seller}</p>
          <p className="text-sm">Crédito: {quote.creditTerms || "-"}</p>
          <p className="text-sm">Tiempo de entrega: {quote.deliveryTime || "-"}</p>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-100 text-left">
              <th className="p-3">Part.</th>
              <th className="p-3">Catálogo</th>
              <th className="p-3">Cant.</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Moneda Origen</th>
              <th className="p-3 text-right">Precio Unit.</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b align-top">
                <td className="p-3">{item.part}</td>
                <td className="p-3">{item.catalog}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3 whitespace-pre-line"><div className="font-medium">{item.brand}</div><div>{item.description}</div></td>
                <td className="p-3">{item.costCurrency || item.priceCurrency || quote.currency}</td>
                <td className="p-3 text-right">{fmtCurrency(item.unitPrice, quote.currency)}</td>
                <td className="p-3 text-right">{fmtCurrency(item.lineTotal || 0, quote.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 ml-auto max-w-md space-y-2 text-sm">
        <div className="flex items-center justify-between"><span>Subtotal</span><span>{fmtCurrency(subtotal, quote.currency)}</span></div>
        <div className="flex items-center justify-between"><span>IVA ({quote.taxPercent}%)</span><span>{fmtCurrency(tax, quote.currency)}</span></div>
        <div className="flex items-center justify-between"><span>Envío</span><span>{fmtCurrency(quote.shipping, quote.currency)}</span></div>
        <div className="flex items-center justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span>{fmtCurrency(total, quote.currency)}</span></div>
      </div>
      <div className="mt-10 border-t pt-8">
        <p className="text-sm font-semibold text-slate-500">Atentamente</p>
        <div className="mt-4 max-w-sm">
          {employee?.signatureImage ? <img src={employee.signatureImage} alt="Firma" className="mb-2 h-20 object-contain" /> : null}
          <div className="border-b border-slate-400 pb-8" />
          <p className="mt-3 font-medium">{employee?.firma || employee?.fullName || quote.seller}</p>
          <p className="text-sm text-slate-600">{employee?.cargo || "Ventas"}</p>
          {employee?.email ? <p className="text-sm text-slate-600">{employee.email}</p> : null}
          {employee?.telefonoTrabajo ? <p className="text-sm text-slate-600">+52 {employee.telefonoTrabajo}</p> : null}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, subtitle }: StatCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="rounded-2xl bg-slate-100 p-3"><Icon className="h-5 w-5 text-slate-700" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">{text}</div>;
}

export default function PuntoCeroProjectControlApp() {
  const [db, setDb] = useState<AppData>(() => {
    const saved = localStorage.getItem("pcs_project_control_db_v8");
    if (!saved) return initialData;
    try {
      const parsed = JSON.parse(saved);
      return {
        products: parsed.products || seedProducts,
        employees: parsed.employees || seedEmployees,
        clients: parsed.clients || seedClients,
        contacts: parsed.contacts || seedContacts,
        quotes: parsed.quotes || [],
        supplierInvoices: parsed.supplierInvoices || [],
        payrollPayments: parsed.payrollPayments || [],
        laborRoles: parsed.laborRoles || seedLaborRoles,
        laborEstimates: parsed.laborEstimates || [],
      };
    } catch {
      return initialData;
    }
  });

  const [searchProducts, setSearchProducts] = useState("");
  const [searchQuotes, setSearchQuotes] = useState("");
  const [selectedQuoteId, setSelectedQuoteId] = useState("");
  const [editingProductId, setEditingProductId] = useState("");
  const [editingEmployeeId, setEditingEmployeeId] = useState("");
  const [editingClientId, setEditingClientId] = useState("");
  const [editingContactId, setEditingContactId] = useState("");
  const [editingQuoteId, setEditingQuoteId] = useState("");
  const [editingLaborRoleId, setEditingLaborRoleId] = useState("");

  const blankProductForm: Product = { id: "", partNumber: "", shortName: "", presentation: "PZA", model: "", brand: "", manufacturer: "", leadTime: "", costCurrency: "MXN", listCurrency: "MXN", supplierSku: "", content: 1, substitutes: "", discontinued: false, unitCost: 0, listPrice: 0, marginPercent: 25, description: "", imagePath: "", notes: "", category: "", active: true };
  const blankEmployeeForm: Employee = { idEmpleado: 0, nombre: "", apellidos: "", fullName: "", iniciales: "", cargo: "", email: "", firma: "", telefonoTrabajo: "", signatureImage: "", privilegio: 1, activo: true };
  const blankClientForm: Client = { idCliente: 0, nombreComp: "", direccion: "", telefono: "", email: "", credito: 0, ciudad: "", estado: "", pais: "México", notas: "", activo: true };
  const blankContactForm: Contact = { idContacto: 0, idCliente: "", nombre: "", puesto: "", email: "", telefono: "", notas: "", activo: true };
  const blankQuoteForm: Quote = { id: "", exchangeRate: 17.2, exchangeRateDate: today(), contactId: "", clientId: "", employeeId: "", folio: "", project: "", client: "", seller: "", attention: "", customerNumber: "", quoteDate: today(), address: "", contactName: "", contactEmail: "", contactPhone: "", creditTerms: "Pago por Anticipado", deliveryTime: "1 semana", currency: "MXN", taxPercent: 16, shipping: 0, notes: "", status: "Pendiente", items: [] };
  const blankInvoiceForm: SupplierInvoice = { id: "", invoiceNumber: "", uuid: "", supplier: "", supplierRfc: "", customerName: "", customerRfc: "", project: "", quoteFolio: "", date: today(), currency: "MXN", exchangeRate: "", paymentMethod: "", paymentForm: "", beforeTax: 0, tax: 0, withTax: 0, xmlFileName: "", items: [], notes: "" };
  const blankQuoteItemForm: QuoteItem = { id: "", productId: "manual", part: 1, catalog: "", quantity: 1, presentation: "PZA", description: "", model: "", brand: "", unitCost: 0, unitPrice: 0, unitCostOriginal: 0, unitPriceOriginal: 0, costCurrency: "MXN", priceCurrency: "MXN", marginPercent: 25, currency: "MXN" };
  const blankLaborRoleForm: LaborRole = { id: "", roleName: "", dailySalary: 0, imssPercent: 30, infonavitPercent: 5, sarPercent: 2, aguinaldoPercent: 4.5, vacationPercent: 4, toolCostDaily: 0, safetyCostDaily: 0, active: true };
  const blankLaborEstimateForm: LaborEstimate = { id: "", quoteFolio: "", project: "", date: today(), transportCost: 0, lodgingCost: 0, foodCost: 0, miscCost: 0, notes: "", lines: [] };
  const blankLaborLineForm: LaborLine = { id: "", roleId: "", roleName: "", people: 1, days: 1, dailyBaseCost: 0, totalCost: 0 };

  const [productForm, setProductForm] = useState<Product>(blankProductForm);
  const [employeeForm, setEmployeeForm] = useState<Employee>(blankEmployeeForm);
  const [clientForm, setClientForm] = useState<Client>(blankClientForm);
  const [contactForm, setContactForm] = useState<Contact>(blankContactForm);
  const [quoteForm, setQuoteForm] = useState<Quote>(blankQuoteForm);
  const [invoiceForm, setInvoiceForm] = useState<SupplierInvoice>(blankInvoiceForm);
  const [quoteItemForm, setQuoteItemForm] = useState<QuoteItem>(blankQuoteItemForm);
  const [laborRoleForm, setLaborRoleForm] = useState<LaborRole>(blankLaborRoleForm);
  const [laborEstimateForm, setLaborEstimateForm] = useState<LaborEstimate>(blankLaborEstimateForm);
  const [laborLineForm, setLaborLineForm] = useState<LaborLine>(blankLaborLineForm);

  const persist = (next: AppData) => {
    setDb(next);
    localStorage.setItem("pcs_project_control_db_v8", JSON.stringify(next));
  };

  const laborTotalByQuote = useMemo(() => {
    const map = new Map<string, number>();
    (db.laborEstimates || []).forEach((estimate) => {
      map.set(estimate.quoteFolio, round2((map.get(estimate.quoteFolio) || 0) + computeLaborEstimateTotal(estimate)));
    });
    return map;
  }, [db.laborEstimates]);

  const quotesComputed = useMemo<QuoteComputed[]>(() =>
    (db.quotes || []).map((q) => {
      const items = (q.items || []).map(computeLine);
      const subtotal = round2(items.reduce((acc, item) => acc + (item.lineTotal || 0), 0));
      const costSubtotal = round2(items.reduce((acc, item) => acc + (item.lineCostTotal || 0), 0));
      const tax = round2(subtotal * (toNumber(q.taxPercent) / 100));
      const total = round2(subtotal + tax + toNumber(q.shipping));
      const supplierCost = round2((db.supplierInvoices || []).filter((inv) => inv.quoteFolio === q.folio || (!!q.project && inv.project === q.project)).reduce((acc, inv) => acc + toNumber(inv.beforeTax), 0));
      const payrollCost = round2((db.payrollPayments || []).filter((pay) => !!q.project && pay.project === q.project).reduce((acc, pay) => acc + toNumber(pay.amount), 0));
      const laborCost = round2(laborTotalByQuote.get(q.folio) || 0);
      const estimatedNet = round2(subtotal - supplierCost - payrollCost - laborCost);
      return {
        ...q,
        items,
        subtotal,
        costSubtotal,
        tax,
        total,
        quoteGrossProfit: round2(subtotal - costSubtotal),
        supplierCost,
        payrollCost,
        laborCost,
        estimatedNet,
        realMarginPercent: subtotal ? round2((estimatedNet / subtotal) * 100) : 0,
      };
    }),
  [db, laborTotalByQuote]);

  const selectedQuote = quotesComputed.find((q) => q.id === selectedQuoteId) || null;

  const totals = useMemo(() => ({
    sales: round2(quotesComputed.reduce((acc, q) => acc + q.subtotal, 0)),
    supplier: round2((db.supplierInvoices || []).reduce((acc, i) => acc + toNumber(i.beforeTax), 0)),
    payroll: round2((db.payrollPayments || []).reduce((acc, p) => acc + toNumber(p.amount), 0)),
    labor: round2((db.laborEstimates || []).reduce((acc, e) => acc + computeLaborEstimateTotal(e), 0)),
    net: round2(quotesComputed.reduce((acc, q) => acc + q.estimatedNet, 0)),
  }), [quotesComputed, db]);

  const productRows = (db.products || []).filter((p) => {
    const q = searchProducts.trim().toLowerCase();
    if (!q) return true;
    return [p.partNumber, p.shortName, p.brand, p.model].some((v) => String(v || "").toLowerCase().includes(q));
  });

  const quoteRows = quotesComputed.filter((q) => {
    const t = searchQuotes.trim().toLowerCase();
    if (!t) return true;
    return [q.folio, q.project, q.client, q.seller].some((v) => String(v || "").toLowerCase().includes(t));
  });

  const draftSubtotal = round2((quoteForm.items || []).map(computeLine).reduce((acc, item) => acc + (item.lineTotal || 0), 0));
  const draftTax = round2(draftSubtotal * (toNumber(quoteForm.taxPercent) / 100));
  const draftTotal = round2(draftSubtotal + draftTax + toNumber(quoteForm.shipping));
  const convertedDraftCost = convertCurrencyAmount(quoteItemForm.unitCostOriginal, quoteItemForm.costCurrency, quoteForm.currency, quoteForm.exchangeRate);
  const convertedDraftPrice = convertCurrencyAmount(quoteItemForm.unitPriceOriginal, quoteItemForm.priceCurrency, quoteForm.currency, quoteForm.exchangeRate);

  const recomputeQuoteItemsCurrency = (items: QuoteItem[], newCurrency: CurrencyCode, exchangeRate: number) => {
    return items.map((item) => computeLine({
      ...item,
      unitCost: convertCurrencyAmount(item.unitCostOriginal, item.costCurrency, newCurrency, exchangeRate),
      unitPrice: convertCurrencyAmount(item.unitPriceOriginal, item.priceCurrency, newCurrency, exchangeRate),
      currency: newCurrency,
      lineCurrency: newCurrency,
    }));
  };

  const rematchInvoiceItemsForQuote = (items: SupplierInvoiceItem[], quoteFolio: string) => {
    const quote = quotesComputed.find((q) => q.folio === quoteFolio);
    return quote ? matchInvoiceItemsToQuote(items, quote) : items.map((i) => ({ ...i, matchedQuoteItemId: undefined, matchedQuoteCatalog: undefined }));
  };

  const saveProduct = () => {
    if (!productForm.partNumber || !productForm.shortName) return alert("Captura al menos número de parte y nombre corto.");
    const payload = { ...productForm, unitCost: round2(productForm.unitCost), listPrice: round2(productForm.listPrice), marginPercent: computeMarginFromCostAndPrice(productForm.unitCost, productForm.listPrice) };
    if (editingProductId) persist({ ...db, products: (db.products || []).map((p) => (p.id === editingProductId ? { ...p, ...payload } : p)) });
    else persist({ ...db, products: [...(db.products || []), { ...payload, id: uid() }] });
    setEditingProductId("");
    setProductForm(blankProductForm);
  };

  const saveEmployee = () => {
    if (!employeeForm.fullName || !employeeForm.iniciales) return alert("Captura nombre completo e iniciales.");
    const payload = { ...employeeForm, privilegio: toNumber(employeeForm.privilegio) };
    if (editingEmployeeId) persist({ ...db, employees: (db.employees || []).map((e) => (String(e.idEmpleado) === String(editingEmployeeId) ? { ...e, ...payload } : e)) });
    else persist({ ...db, employees: [...(db.employees || []), { ...payload, idEmpleado: Date.now() }] });
    setEditingEmployeeId("");
    setEmployeeForm(blankEmployeeForm);
  };

  const saveClient = () => {
    if (!clientForm.nombreComp) return alert("Captura el nombre del cliente.");
    const payload = { ...clientForm, credito: toNumber(clientForm.credito) };
    if (editingClientId) persist({ ...db, clients: (db.clients || []).map((c) => (String(c.idCliente) === String(editingClientId) ? { ...c, ...payload } : c)) });
    else persist({ ...db, clients: [...(db.clients || []), { ...payload, idCliente: Date.now() }] });
    setEditingClientId("");
    setClientForm(blankClientForm);
  };

  const saveContact = () => {
    if (!contactForm.idCliente || !contactForm.nombre) return alert("Selecciona cliente y captura nombre del contacto.");
    const payload = { ...contactForm };
    if (editingContactId) persist({ ...db, contacts: (db.contacts || []).map((c) => (String(c.idContacto) === String(editingContactId) ? { ...c, ...payload } : c)) });
    else persist({ ...db, contacts: [...(db.contacts || []), { ...payload, idContacto: Date.now() }] });
    setEditingContactId("");
    setContactForm(blankContactForm);
  };

  const saveLaborRole = () => {
    if (!laborRoleForm.roleName) return alert("Captura el nombre del rol.");
    const payload = { ...laborRoleForm };
    if (editingLaborRoleId) persist({ ...db, laborRoles: (db.laborRoles || []).map((r) => (r.id === editingLaborRoleId ? { ...r, ...payload } : r)) });
    else persist({ ...db, laborRoles: [...(db.laborRoles || []), { ...payload, id: uid() }] });
    setEditingLaborRoleId("");
    setLaborRoleForm(blankLaborRoleForm);
  };

  const autoGenerateQuoteFolio = () => {
    const employee = (db.employees || []).find((e) => String(e.idEmpleado) === String(quoteForm.employeeId));
    if (!employee) return alert("Selecciona primero un vendedor.");
    const year = String(quoteForm.quoteDate || today()).slice(2, 4);
    const seqs = (db.quotes || []).map((q) => String(q.folio || "").match(/^PCS(\d{3})[A-Z]{4}\d{2}$/)).filter(Boolean).map((m: RegExpMatchArray | null) => Number(m?.[1] || 0));
    const nextSeq = String((Math.max(0, ...seqs) + 1)).padStart(3, "0");
    setQuoteForm({ ...quoteForm, folio: `PCS${nextSeq}${employee.iniciales}${year}` });
  };

  const saveQuote = () => {
    if (!quoteForm.client) return alert("Selecciona un cliente.");
    let folio = quoteForm.folio;
    if (!folio) {
      const employee = (db.employees || []).find((e) => String(e.idEmpleado) === String(quoteForm.employeeId));
      if (!employee) return alert("Selecciona un vendedor para generar el folio automáticamente.");
      const year = String(quoteForm.quoteDate || today()).slice(2, 4);
      const seqs = (db.quotes || []).map((q) => String(q.folio || "").match(/^PCS(\d{3})[A-Z]{4}\d{2}$/)).filter(Boolean).map((m: RegExpMatchArray | null) => Number(m?.[1] || 0));
      const nextSeq = String((Math.max(0, ...seqs) + 1)).padStart(3, "0");
      folio = `PCS${nextSeq}${employee.iniciales}${year}`;
    }

    const payload: Quote = {
      ...quoteForm,
      folio,
      taxPercent: toNumber(quoteForm.taxPercent),
      shipping: round2(quoteForm.shipping),
      exchangeRate: toNumber(quoteForm.exchangeRate),
      items: (quoteForm.items || []).map((item, idx) => ({ ...computeLine(item), part: idx + 1 })),
    };

    if (editingQuoteId) persist({ ...db, quotes: (db.quotes || []).map((q) => (q.id === editingQuoteId ? { ...q, ...payload } : q)) });
    else persist({ ...db, quotes: [...(db.quotes || []), { ...payload, id: uid() }] });

    setEditingQuoteId("");
    setQuoteForm(blankQuoteForm);
    setQuoteItemForm(blankQuoteItemForm);
  };

  const addItemToDraftQuote = () => {
    if (!quoteItemForm.catalog || !quoteItemForm.description) return alert("Captura catálogo y descripción.");
    const line = computeLine({
      ...quoteItemForm,
      unitCost: convertedDraftCost,
      unitPrice: convertedDraftPrice,
      unitCostOriginal: toNumber(quoteItemForm.unitCostOriginal),
      unitPriceOriginal: toNumber(quoteItemForm.unitPriceOriginal),
      currency: quoteForm.currency,
      lineCurrency: quoteForm.currency,
    });
    setQuoteForm({ ...quoteForm, items: [...(quoteForm.items || []), { ...line, id: uid() }] });
    setQuoteItemForm({ ...blankQuoteItemForm, part: (quoteForm.items || []).length + 2, currency: quoteForm.currency, costCurrency: quoteForm.currency, priceCurrency: quoteForm.currency });
  };

  const suggestInvoiceAssignment = (draftInvoice: SupplierInvoice) => {
    const customerText = String(draftInvoice.customerName || "").toLowerCase();
    const amount = toNumber(draftInvoice.beforeTax || draftInvoice.withTax);
    return (quotesComputed || []).map((q) => {
      let score = 0;
      const clientText = String(q.client || "").toLowerCase();
      if (customerText && clientText && customerText.includes(clientText)) score += 4;
      const diff = Math.abs(toNumber(q.costSubtotal) - amount);
      if (amount > 0) {
        const ratio = diff / amount;
        if (ratio <= 0.02) score += 5;
        else if (ratio <= 0.05) score += 4;
        else if (ratio <= 0.1) score += 3;
        else if (ratio <= 0.2) score += 1;
      }
      return { q, score, diff };
    }).sort((a, b) => b.score - a.score || a.diff - b.diff).slice(0, 3);
  };

  const matchInvoiceItemsToQuote = (invoiceItems: SupplierInvoiceItem[], quote?: QuoteComputed) => {
    if (!quote) return invoiceItems;
    return invoiceItems.map((invoiceItem) => {
      const invoiceSku = normalizeCatalog(invoiceItem.sku);
      const invoiceDesc = normalizeCatalog(invoiceItem.description);
      const matched = (quote.items || []).find((quoteItem) => {
        const quoteCatalog = normalizeCatalog(quoteItem.catalog);
        const quoteDesc = normalizeCatalog(quoteItem.description);
        if (invoiceSku && quoteCatalog && invoiceSku === quoteCatalog) return true;
        if (invoiceSku && quoteDesc && invoiceSku === quoteDesc) return true;
        if (!invoiceSku && invoiceDesc && quoteCatalog && invoiceDesc.includes(quoteCatalog)) return true;
        if (!invoiceSku && invoiceDesc && quoteDesc && quoteDesc.includes(invoiceDesc.slice(0, 20))) return true;
        return false;
      });
      return { ...invoiceItem, matchedQuoteItemId: matched?.id, matchedQuoteCatalog: matched?.catalog };
    });
  };

  const handleSupplierXmlImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCfdiXmlText(String(e.target?.result || ""));
        const suggestions = suggestInvoiceAssignment({ ...blankInvoiceForm, ...parsed, id: "preview" });
        const best = suggestions[0]?.q;
        const matchedItems = matchInvoiceItemsToQuote(parsed.items, best);
        setInvoiceForm({ ...blankInvoiceForm, ...parsed, xmlFileName: file.name, project: best?.project || "", quoteFolio: best?.folio || "", items: matchedItems, notes: suggestions.length ? `Sugerencia automática: ${suggestions.map((s) => `${s.q.folio} (${s.score} pts)`).join(" | ")}` : "" });
      } catch (error) {
        console.error(error);
        alert("No se pudo leer el XML CFDI.");
      }
    };
    reader.readAsText(file);
  };

  const saveInvoice = () => {
    if (!invoiceForm.invoiceNumber && !invoiceForm.uuid) return alert("Carga un XML o captura el folio de factura.");
    persist({ ...db, supplierInvoices: [...(db.supplierInvoices || []), { ...invoiceForm, id: uid(), beforeTax: round2(invoiceForm.beforeTax), tax: round2(invoiceForm.tax), withTax: round2(invoiceForm.withTax), exchangeRate: invoiceForm.exchangeRate ? Number(invoiceForm.exchangeRate) : "" }] });
    setInvoiceForm(blankInvoiceForm);
  };

  const addLaborLine = () => {
    if (!laborLineForm.roleId) return alert("Selecciona un rol.");
    const role = (db.laborRoles || []).find((r) => r.id === laborLineForm.roleId);
    if (!role) return alert("Rol inválido.");
    const dailyBaseCost = computeLaborRoleDailyCost(role);
    const totalCost = round2(dailyBaseCost * toNumber(laborLineForm.people) * toNumber(laborLineForm.days));
    const line: LaborLine = { id: uid(), roleId: role.id, roleName: role.roleName, people: toNumber(laborLineForm.people), days: toNumber(laborLineForm.days), dailyBaseCost, totalCost };
    setLaborEstimateForm({ ...laborEstimateForm, lines: [...(laborEstimateForm.lines || []), line] });
    setLaborLineForm(blankLaborLineForm);
  };

  const saveLaborEstimate = () => {
    if (!laborEstimateForm.quoteFolio) return alert("Selecciona una cotización.");
    if (!(laborEstimateForm.lines || []).length) return alert("Agrega al menos una línea de mano de obra.");
    const quote = quoteRows.find((q) => q.folio === laborEstimateForm.quoteFolio);
    const payload: LaborEstimate = { ...laborEstimateForm, id: uid(), project: quote?.project || laborEstimateForm.project };
    persist({ ...db, laborEstimates: [...(db.laborEstimates || []), payload] });
    setLaborEstimateForm(blankLaborEstimateForm);
    setLaborLineForm(blankLaborLineForm);
  };

  const exportSelectedQuoteHtml = () => {
    if (!selectedQuote) return;
    const employee = (db.employees || []).find((e) => String(e.idEmpleado) === String(selectedQuote.employeeId));
    const htmlRows = (selectedQuote.items || []).map((item) => `<tr><td>${item.part}</td><td>${item.catalog}</td><td>${item.quantity}</td><td>${String(item.description || "").replaceAll("\n", "<br>")}</td><td>${item.costCurrency || item.priceCurrency || selectedQuote.currency}</td><td>${fmtCurrency(item.unitPrice, selectedQuote.currency)}</td><td>${fmtCurrency(item.lineTotal || 0, selectedQuote.currency)}</td></tr>`).join("");
    const phone = employee?.telefonoTrabajo ? `+52 ${employee.telefonoTrabajo}` : "";
    const signatureHtml = employee?.signatureImage ? `<img src="${employee.signatureImage}" alt="Firma" style="max-height:80px;max-width:260px;display:block;margin-bottom:8px;object-fit:contain;" />` : "";
    const contactEmail = selectedQuote.contactEmail || "";
    const contactPhone = selectedQuote.contactPhone || "";
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${selectedQuote.folio}</title><style>body{font-family:Arial,sans-serif;color:#0f172a;padding:32px}.container{max-width:1000px;margin:0 auto}.header{display:flex;justify-content:space-between;border-bottom:1px solid #cbd5e1;padding-bottom:16px}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border-bottom:1px solid #e2e8f0;padding:10px;text-align:left;vertical-align:top;font-size:12px}th{background:#f8fafc}.summary{margin-left:auto;max-width:320px;margin-top:24px}.summary div{display:flex;justify-content:space-between;padding:4px 0}.total{font-weight:bold;font-size:18px;border-top:1px solid #cbd5e1;padding-top:8px}.signature{margin-top:40px;border-top:1px solid #cbd5e1;padding-top:24px;max-width:320px}.signline{border-bottom:1px solid #94a3b8;height:48px;margin-bottom:12px}</style></head><body><div class="container"><div class="header"><div><h1>PUNTO CERO SOLUCIONES</h1><div>Paseo del Condado 7, Corregidora, Qro.</div><div>Tel: +52 4421713108</div><div>RFC: CTS151026M23</div></div><div style="text-align:right"><div>COTIZACIÓN</div><h2>#${selectedQuote.folio}</h2><div>Fecha: ${selectedQuote.quoteDate}</div><div>Cliente: ${selectedQuote.client}</div><div>Moneda: ${selectedQuote.currency}</div><div>TC: ${selectedQuote.exchangeRate}</div></div></div><div style="margin-top:16px"><div>Atención: ${selectedQuote.attention || selectedQuote.client}</div>${contactEmail ? `<div>Email: ${contactEmail}</div>` : ""}${contactPhone ? `<div>Tel: ${contactPhone}</div>` : ""}</div><table><thead><tr><th>Part.</th><th>Catálogo</th><th>Cant.</th><th>Descripción</th><th>Moneda Origen</th><th>Precio Unit.</th><th>Total</th></tr></thead><tbody>${htmlRows}</tbody></table><div class="summary"><div><span>Subtotal</span><span>${fmtCurrency(selectedQuote.subtotal, selectedQuote.currency)}</span></div><div><span>IVA</span><span>${fmtCurrency(selectedQuote.tax, selectedQuote.currency)}</span></div><div><span>Envío</span><span>${fmtCurrency(selectedQuote.shipping, selectedQuote.currency)}</span></div><div class="total"><span>Total</span><span>${fmtCurrency(selectedQuote.total, selectedQuote.currency)}</span></div></div><div class="signature"><div>Atentamente</div>${signatureHtml}<div class="signline"></div><div><strong>${employee?.firma || employee?.fullName || selectedQuote.seller}</strong></div><div>${employee?.cargo || "Ventas"}</div><div>${employee?.email || ""}</div><div>${phone}</div></div></div></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedQuote.folio}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    localStorage.removeItem("pcs_project_control_db_v8");
    setDb(initialData);
    setSelectedQuoteId("");
    setEditingProductId("");
    setEditingEmployeeId("");
    setEditingClientId("");
    setEditingContactId("");
    setEditingQuoteId("");
    setEditingLaborRoleId("");
    setProductForm(blankProductForm);
    setEmployeeForm(blankEmployeeForm);
    setClientForm(blankClientForm);
    setContactForm(blankContactForm);
    setQuoteForm(blankQuoteForm);
    setInvoiceForm(blankInvoiceForm);
    setQuoteItemForm(blankQuoteItemForm);
    setLaborRoleForm(blankLaborRoleForm);
    setLaborEstimateForm(blankLaborEstimateForm);
    setLaborLineForm(blankLaborLineForm);
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result || "{}"));
        if (Array.isArray(parsed)) {
          const normalizedProducts: Product[] = parsed.map((p: any, index: number) => ({ id: p.id || `prod_import_${index + 1}`, partNumber: p.partNumber || p.NoParte || "", shortName: p.shortName || p.NombreCorto || "", presentation: p.presentation || p.Presentacion || "PZA", model: p.model || p.Modelo || "", brand: p.brand || p.Marca || "", manufacturer: p.manufacturer || p.Fabricante || "", leadTime: p.leadTime || p.TiempoEntrega || "", costCurrency: p.costCurrency || p.MonedaCosto || p.Moneda || "MXN", listCurrency: p.listCurrency || p.MonedaVenta || p.Moneda || "MXN", supplierSku: p.supplierSku || p.SKUProveedor || p.NoParte || "", content: Number(p.content || p.Contenido || 1), substitutes: p.substitutes || p.Sustitutos || "", discontinued: Boolean(p.discontinued || p.Descontinuado || false), unitCost: Number(p.unitCost || p.PrecioCosto || 0), listPrice: Number(p.listPrice || p.PrecioLista || 0), marginPercent: Number(p.marginPercent || p.MarginProfit || 25), description: p.description || p.Descripcion || "", imagePath: p.imagePath || p.Imagen || "", notes: p.notes || p.Notas || "", category: p.category || p.Categoria || "", active: p.active !== false }));
          persist({ ...db, products: normalizedProducts });
          alert(`Se importaron ${normalizedProducts.length} productos correctamente.`);
          return;
        }
        persist({ products: parsed.products || seedProducts, employees: parsed.employees || seedEmployees, clients: parsed.clients || seedClients, contacts: parsed.contacts || seedContacts, quotes: parsed.quotes || [], supplierInvoices: parsed.supplierInvoices || [], payrollPayments: parsed.payrollPayments || [], laborRoles: parsed.laborRoles || seedLaborRoles, laborEstimates: parsed.laborEstimates || [] });
      } catch (err) {
        console.error(err);
        alert("No se pudo importar el archivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50"><div className="mx-auto max-w-7xl p-4 md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Punto Cero Soluciones</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Catálogo + cotizaciones + control</h1></div><div className="flex flex-wrap gap-2"><Button variant="outline" className="rounded-2xl" onClick={() => downloadJson(db, "punto-cero-control.json")}><Save className="mr-2 h-4 w-4" />Exportar JSON</Button><label className="inline-flex cursor-pointer items-center rounded-2xl border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"><Upload className="mr-2 h-4 w-4" />Importar JSON<input type="file" accept="application/json" className="hidden" onChange={importJson} /></label><Button variant="outline" className="rounded-2xl" onClick={resetAll}>Reiniciar demo</Button></div></div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"><StatCard title="Ventas cotizadas" value={fmtCurrency(totals.sales, "MXN")} icon={Briefcase} subtitle="Subtotal" /><StatCard title="Costo proveedor" value={fmtCurrency(totals.supplier, "MXN")} icon={Receipt} subtitle="Facturas" /><StatCard title="Pagos empleados" value={fmtCurrency(totals.payroll, "MXN")} icon={Wallet} subtitle="Pagos" /><StatCard title="Mano de obra" value={fmtCurrency(totals.labor, "MXN")} icon={HardHat} subtitle="Estimaciones" /><StatCard title="Utilidad estimada" value={fmtCurrency(totals.net, "MXN")} icon={Calculator} subtitle="Venta - costos totales" /></div>
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap rounded-2xl bg-white p-2 shadow-sm"><TabsTrigger value="products" className="rounded-xl">Productos</TabsTrigger><TabsTrigger value="employees" className="rounded-xl">Empleados</TabsTrigger><TabsTrigger value="clients" className="rounded-xl">Clientes</TabsTrigger><TabsTrigger value="contacts" className="rounded-xl">Contactos</TabsTrigger><TabsTrigger value="quote-builder" className="rounded-xl">Generar cotización</TabsTrigger><TabsTrigger value="quotes" className="rounded-xl">Cotizaciones</TabsTrigger><TabsTrigger value="supplier-invoices" className="rounded-xl">Facturas proveedor</TabsTrigger><TabsTrigger value="labor" className="rounded-xl">Mano de obra</TabsTrigger><TabsTrigger value="report" className="rounded-xl">Reporte</TabsTrigger></TabsList>

        <TabsContent value="products" className="space-y-6"><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>{editingProductId ? "Editar producto" : "Alta de producto"}</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"><div><Label>Número de parte</Label><Input value={productForm.partNumber} onChange={(e) => setProductForm({ ...productForm, partNumber: e.target.value })} /></div><div><Label>Nombre corto</Label><Input value={productForm.shortName} onChange={(e) => setProductForm({ ...productForm, shortName: e.target.value })} /></div><div><Label>Marca</Label><Input value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} /></div><div><Label>Modelo</Label><Input value={productForm.model} onChange={(e) => setProductForm({ ...productForm, model: e.target.value })} /></div><div><Label>Moneda costo</Label><Select value={productForm.costCurrency} onValueChange={(value: CurrencyCode) => setProductForm({ ...productForm, costCurrency: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MXN">MXN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div><div><Label>Moneda precio</Label><Select value={productForm.listCurrency} onValueChange={(value: CurrencyCode) => setProductForm({ ...productForm, listCurrency: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MXN">MXN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div><div><Label>Costo</Label><Input type="number" value={productForm.unitCost} onChange={(e) => setProductForm({ ...productForm, unitCost: Number(e.target.value), listPrice: computePriceFromCost(e.target.value, productForm.marginPercent) })} /></div><div><Label>Margen %</Label><Input type="number" value={productForm.marginPercent} onChange={(e) => setProductForm({ ...productForm, marginPercent: Number(e.target.value), listPrice: computePriceFromCost(productForm.unitCost, e.target.value) })} /></div><div><Label>Precio</Label><Input type="number" value={productForm.listPrice} onChange={(e) => setProductForm({ ...productForm, listPrice: Number(e.target.value) })} /></div><div><Label>Presentación</Label><Input value={productForm.presentation} onChange={(e) => setProductForm({ ...productForm, presentation: e.target.value })} /></div><div className="xl:col-span-4"><Label>Descripción</Label><Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} /></div><div className="xl:col-span-4 flex gap-2"><Button onClick={saveProduct}>{editingProductId ? "Guardar cambios" : "Agregar producto"}</Button><Button variant="outline" onClick={() => { setEditingProductId(""); setProductForm(blankProductForm); }}>Cancelar</Button></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Catálogo</CardTitle><Input className="max-w-sm" placeholder="Buscar..." value={searchProducts} onChange={(e) => setSearchProducts(e.target.value)} /></CardHeader><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>No. parte</TableHead><TableHead>Nombre</TableHead><TableHead>Mon. costo</TableHead><TableHead>Costo</TableHead><TableHead>Mon. precio</TableHead><TableHead>Precio</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{productRows.map((row) => <TableRow key={row.id}><TableCell>{row.partNumber}</TableCell><TableCell>{row.shortName}</TableCell><TableCell>{row.costCurrency}</TableCell><TableCell>{fmtCurrency(row.unitCost, row.costCurrency)}</TableCell><TableCell>{row.listCurrency}</TableCell><TableCell>{fmtCurrency(row.listPrice, row.listCurrency)}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditingProductId(row.id); setProductForm({ ...row }); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setQuoteItemForm({ ...quoteItemForm, productId: row.id, catalog: row.partNumber, presentation: row.presentation, description: row.description, model: row.model, brand: row.brand, unitCost: row.unitCost, unitPrice: row.listPrice, unitCostOriginal: row.unitCost, unitPriceOriginal: row.listPrice, costCurrency: row.costCurrency, priceCurrency: row.listCurrency, currency: row.listCurrency })}><Copy className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => persist({ ...db, products: (db.products || []).filter((p) => p.id !== row.id) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="employees" className="space-y-6"><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Empleados</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"><div><Label>Nombre completo</Label><Input value={employeeForm.fullName} onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })} /></div><div><Label>Iniciales</Label><Input value={employeeForm.iniciales} onChange={(e) => setEmployeeForm({ ...employeeForm, iniciales: e.target.value.toUpperCase().slice(0, 4) })} /></div><div><Label>Cargo</Label><Input value={employeeForm.cargo} onChange={(e) => setEmployeeForm({ ...employeeForm, cargo: e.target.value })} /></div><div><Label>Email</Label><Input value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} /></div><div><Label>Imagen firma</Label><Input value={employeeForm.signatureImage} onChange={(e) => setEmployeeForm({ ...employeeForm, signatureImage: e.target.value })} /></div><div><Label>Firma texto</Label><Input value={employeeForm.firma} onChange={(e) => setEmployeeForm({ ...employeeForm, firma: e.target.value })} /></div><div><Label>Teléfono</Label><Input value={employeeForm.telefonoTrabajo} onChange={(e) => setEmployeeForm({ ...employeeForm, telefonoTrabajo: e.target.value })} /></div><div className="xl:col-span-4 flex gap-2"><Button onClick={saveEmployee}>{editingEmployeeId ? "Guardar cambios" : "Agregar empleado"}</Button><Button variant="outline" onClick={() => { setEditingEmployeeId(""); setEmployeeForm(blankEmployeeForm); }}>Cancelar</Button></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Iniciales</TableHead><TableHead>Cargo</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(db.employees || []).map((row) => <TableRow key={row.idEmpleado}><TableCell>{row.fullName}</TableCell><TableCell>{row.iniciales}</TableCell><TableCell>{row.cargo}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditingEmployeeId(String(row.idEmpleado)); setEmployeeForm({ ...row }); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => persist({ ...db, employees: (db.employees || []).filter((e) => String(e.idEmpleado) !== String(row.idEmpleado)) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="clients" className="space-y-6"><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Clientes</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"><div><Label>Nombre</Label><Input value={clientForm.nombreComp} onChange={(e) => setClientForm({ ...clientForm, nombreComp: e.target.value })} /></div><div><Label>Dirección</Label><Input value={clientForm.direccion} onChange={(e) => setClientForm({ ...clientForm, direccion: e.target.value })} /></div><div><Label>Email</Label><Input value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} /></div><div><Label>Crédito</Label><Input type="number" value={clientForm.credito} onChange={(e) => setClientForm({ ...clientForm, credito: Number(e.target.value) })} /></div><div className="xl:col-span-4 flex gap-2"><Button onClick={saveClient}>{editingClientId ? "Guardar cambios" : "Agregar cliente"}</Button><Button variant="outline" onClick={() => { setEditingClientId(""); setClientForm(blankClientForm); }}>Cancelar</Button></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Dirección</TableHead><TableHead>Crédito</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(db.clients || []).map((row) => <TableRow key={row.idCliente}><TableCell>{row.nombreComp}</TableCell><TableCell>{row.direccion}</TableCell><TableCell>{row.credito}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditingClientId(String(row.idCliente)); setClientForm({ ...row }); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => persist({ ...db, clients: (db.clients || []).filter((c) => String(c.idCliente) !== String(row.idCliente)) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="contacts" className="space-y-6"><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Contactos</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"><div><Label>Cliente</Label><Select value={String(contactForm.idCliente || "")} onValueChange={(value) => setContactForm({ ...contactForm, idCliente: Number(value) })}><SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger><SelectContent>{(db.clients || []).map((c) => <SelectItem key={c.idCliente} value={String(c.idCliente)}>{c.nombreComp}</SelectItem>)}</SelectContent></Select></div><div><Label>Nombre</Label><Input value={contactForm.nombre} onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })} /></div><div><Label>Puesto</Label><Input value={contactForm.puesto} onChange={(e) => setContactForm({ ...contactForm, puesto: e.target.value })} /></div><div><Label>Email</Label><Input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} /></div><div><Label>Teléfono</Label><Input value={contactForm.telefono} onChange={(e) => setContactForm({ ...contactForm, telefono: e.target.value })} /></div><div className="xl:col-span-3"><Label>Notas</Label><Input value={contactForm.notas} onChange={(e) => setContactForm({ ...contactForm, notas: e.target.value })} /></div><div className="xl:col-span-4 flex gap-2"><Button onClick={saveContact}>{editingContactId ? "Guardar cambios" : "Agregar contacto"}</Button><Button variant="outline" onClick={() => { setEditingContactId(""); setContactForm(blankContactForm); }}>Cancelar</Button></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Contacto</TableHead><TableHead>Puesto</TableHead><TableHead>Email</TableHead><TableHead>Teléfono</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(db.contacts || []).map((row) => <TableRow key={row.idContacto}><TableCell>{(db.clients || []).find((c) => String(c.idCliente) === String(row.idCliente))?.nombreComp || ""}</TableCell><TableCell>{row.nombre}</TableCell><TableCell>{row.puesto}</TableCell><TableCell>{row.email}</TableCell><TableCell>{row.telefono}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditingContactId(String(row.idContacto)); setContactForm({ ...row }); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => persist({ ...db, contacts: (db.contacts || []).filter((c) => String(c.idContacto) !== String(row.idContacto)) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="quote-builder" className="space-y-6"><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>{editingQuoteId ? "Editar cotización" : "Nueva cotización"}</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"><div><Label>Folio <span className="text-xs text-slate-400">(se genera al guardar si lo dejas vacío)</span></Label><div className="flex gap-2"><Input value={quoteForm.folio} onChange={(e) => setQuoteForm({ ...quoteForm, folio: e.target.value })} /><Button type="button" variant="outline" onClick={autoGenerateQuoteFolio}>Auto</Button></div></div><div><Label>Proyecto <span className="text-xs text-slate-400">(opcional)</span></Label><Input value={quoteForm.project} onChange={(e) => setQuoteForm({ ...quoteForm, project: e.target.value })} /></div><div><Label>Cliente</Label><Select value={String(quoteForm.clientId || "")} onValueChange={(value) => { const client = (db.clients || []).find((c) => String(c.idCliente) === value); setQuoteForm({ ...quoteForm, clientId: value, contactId: "", attention: "", contactName: "", contactEmail: "", contactPhone: "", client: client?.nombreComp || "", address: client?.direccion || "", creditTerms: client && toNumber(client.credito) > 0 ? `Crédito ${client.credito} Días` : "Pago por Anticipado" }); }}><SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger><SelectContent>{(db.clients || []).map((c) => <SelectItem key={c.idCliente} value={String(c.idCliente)}>{c.nombreComp}</SelectItem>)}</SelectContent></Select></div><div><Label>Vendedor</Label><Select value={String(quoteForm.employeeId || "")} onValueChange={(value) => { const employee = (db.employees || []).find((e) => String(e.idEmpleado) === value); setQuoteForm({ ...quoteForm, employeeId: value, seller: employee?.fullName || "" }); }}><SelectTrigger><SelectValue placeholder="Selecciona vendedor" /></SelectTrigger><SelectContent>{(db.employees || []).map((e) => <SelectItem key={e.idEmpleado} value={String(e.idEmpleado)}>{e.fullName}</SelectItem>)}</SelectContent></Select></div><div><Label>Contacto</Label><Select value={String(quoteForm.contactId || "")} onValueChange={(value) => { const contact = (db.contacts || []).find((c) => String(c.idContacto) === String(value)); setQuoteForm({ ...quoteForm, contactId: value, attention: contact?.nombre || "", contactName: contact?.nombre || "", contactEmail: contact?.email || "", contactPhone: contact?.telefono || "" }); }}><SelectTrigger><SelectValue placeholder="Selecciona contacto" /></SelectTrigger><SelectContent>{(db.contacts || []).filter((c) => String(c.idCliente) === String(quoteForm.clientId)).map((c) => <SelectItem key={c.idContacto} value={String(c.idContacto)}>{c.nombre}{c.puesto ? ` - ${c.puesto}` : ""}</SelectItem>)}</SelectContent></Select></div><div><Label>Dirección</Label><Input value={quoteForm.address} onChange={(e) => setQuoteForm({ ...quoteForm, address: e.target.value })} /></div><div><Label>Crédito</Label><Input value={quoteForm.creditTerms} onChange={(e) => setQuoteForm({ ...quoteForm, creditTerms: e.target.value })} /></div><div><Label>Fecha</Label><Input type="date" value={quoteForm.quoteDate} onChange={(e) => setQuoteForm({ ...quoteForm, quoteDate: e.target.value })} /></div><div><Label>Moneda cotización</Label><Select value={quoteForm.currency} onValueChange={(value: CurrencyCode) => setQuoteForm({ ...quoteForm, currency: value, items: recomputeQuoteItemsCurrency(quoteForm.items || [], value, quoteForm.exchangeRate) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MXN">MXN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div><div><Label>Tipo de cambio</Label><Input type="number" value={quoteForm.exchangeRate} onChange={(e) => { const nextRate = Number(e.target.value); setQuoteForm({ ...quoteForm, exchangeRate: nextRate, items: recomputeQuoteItemsCurrency(quoteForm.items || [], quoteForm.currency, nextRate) }); }} /></div><div><Label>Fecha TC</Label><Input type="date" value={quoteForm.exchangeRateDate} onChange={(e) => setQuoteForm({ ...quoteForm, exchangeRateDate: e.target.value })} /></div></CardContent></Card><div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]"><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Agregar partida</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"><div><Label>Producto</Label><Select value={quoteItemForm.productId} onValueChange={(value) => { if (value === "manual") return setQuoteItemForm({ ...blankQuoteItemForm, productId: value, currency: quoteForm.currency, costCurrency: quoteForm.currency, priceCurrency: quoteForm.currency }); const p = (db.products || []).find((x) => x.id === value); if (!p) return; setQuoteItemForm({ ...quoteItemForm, productId: p.id, catalog: p.partNumber, presentation: p.presentation, description: p.description, model: p.model, brand: p.brand, unitCost: p.unitCost, unitPrice: p.listPrice, unitCostOriginal: p.unitCost, unitPriceOriginal: p.listPrice, costCurrency: p.costCurrency, priceCurrency: p.listCurrency, currency: p.listCurrency }); }}><SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger><SelectContent><SelectItem value="manual">Captura manual</SelectItem>{(db.products || []).map((p) => <SelectItem key={p.id} value={p.id}>{p.partNumber} - {p.shortName}</SelectItem>)}</SelectContent></Select></div><div><Label>Catálogo</Label><Input value={quoteItemForm.catalog} onChange={(e) => setQuoteItemForm({ ...quoteItemForm, catalog: e.target.value })} /></div><div><Label>Cantidad</Label><Input type="number" value={quoteItemForm.quantity} onChange={(e) => setQuoteItemForm({ ...quoteItemForm, quantity: Number(e.target.value) })} /></div><div><Label>Presentación</Label><Input value={quoteItemForm.presentation} onChange={(e) => setQuoteItemForm({ ...quoteItemForm, presentation: e.target.value })} /></div><div><Label>Costo original</Label><Input type="number" value={quoteItemForm.unitCostOriginal} onChange={(e) => setQuoteItemForm({ ...quoteItemForm, unitCostOriginal: Number(e.target.value), unitPriceOriginal: computePriceFromCost(e.target.value, quoteItemForm.marginPercent) })} /></div><div><Label>Moneda costo</Label><Select value={quoteItemForm.costCurrency} onValueChange={(value: CurrencyCode) => setQuoteItemForm({ ...quoteItemForm, costCurrency: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MXN">MXN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div><div><Label>Margen %</Label><Input type="number" value={quoteItemForm.marginPercent} onChange={(e) => setQuoteItemForm({ ...quoteItemForm, marginPercent: Number(e.target.value), unitPriceOriginal: computePriceFromCost(quoteItemForm.unitCostOriginal, e.target.value) })} /></div><div><Label>Precio original</Label><Input type="number" value={quoteItemForm.unitPriceOriginal} onChange={(e) => setQuoteItemForm({ ...quoteItemForm, unitPriceOriginal: Number(e.target.value) })} /></div><div><Label>Moneda precio</Label><Select value={quoteItemForm.priceCurrency} onValueChange={(value: CurrencyCode) => setQuoteItemForm({ ...quoteItemForm, priceCurrency: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MXN">MXN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div><div className="xl:col-span-4 rounded-2xl bg-slate-100 p-3 text-sm"><div className="flex justify-between"><span>Costo convertido a {quoteForm.currency}</span><strong>{fmtCurrency(convertedDraftCost, quoteForm.currency)}</strong></div><div className="mt-2 flex justify-between"><span>Precio convertido a {quoteForm.currency}</span><strong>{fmtCurrency(convertedDraftPrice, quoteForm.currency)}</strong></div></div><div className="xl:col-span-4"><Label>Descripción</Label><Textarea value={quoteItemForm.description} onChange={(e) => setQuoteItemForm({ ...quoteItemForm, description: e.target.value })} /></div><div className="xl:col-span-4"><Button onClick={addItemToDraftQuote}><Plus className="mr-2 h-4 w-4" />Agregar partida</Button></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Resumen</CardTitle></CardHeader><CardContent className="space-y-2"><div className="flex justify-between"><span>Partidas</span><strong>{quoteForm.items.length}</strong></div><div className="flex justify-between"><span>Subtotal</span><strong>{fmtCurrency(draftSubtotal, quoteForm.currency)}</strong></div><div className="flex justify-between"><span>IVA</span><strong>{fmtCurrency(draftTax, quoteForm.currency)}</strong></div><div className="flex justify-between"><span>Total</span><strong>{fmtCurrency(draftTotal, quoteForm.currency)}</strong></div>{!quoteForm.folio && quoteForm.employeeId ? <p className="text-xs text-slate-400">Se generará folio automáticamente al guardar.</p> : null}{!quoteForm.folio && !quoteForm.employeeId ? <p className="text-xs text-amber-500">Selecciona un vendedor para generar el folio al guardar.</p> : null}<Button className="w-full rounded-2xl" onClick={saveQuote}><Save className="mr-2 h-4 w-4" />{editingQuoteId ? "Guardar cambios" : "Guardar cotización"}</Button></CardContent></Card></div><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Partidas capturadas</CardTitle></CardHeader><CardContent className="p-0 overflow-x-auto">{quoteForm.items.length ? <Table><TableHeader><TableRow><TableHead>Catálogo</TableHead><TableHead>Descripción</TableHead><TableHead>Cantidad</TableHead><TableHead>Moneda origen</TableHead><TableHead>Costo origen</TableHead><TableHead>Precio origen</TableHead><TableHead>Margen línea</TableHead><TableHead>Total</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{quoteForm.items.map((item) => { const line = computeLine(item); return <TableRow key={item.id}><TableCell>{line.catalog}</TableCell><TableCell>{line.description}</TableCell><TableCell>{line.quantity}</TableCell><TableCell>{line.costCurrency || line.priceCurrency || quoteForm.currency}</TableCell><TableCell>{fmtCurrency(line.unitCostOriginal || 0, line.costCurrency || quoteForm.currency)}</TableCell><TableCell>{fmtCurrency(line.unitPriceOriginal || 0, line.priceCurrency || quoteForm.currency)}</TableCell><TableCell>{fmtCurrency(line.lineProfit || 0, quoteForm.currency)}</TableCell><TableCell>{fmtCurrency(line.lineTotal || 0, quoteForm.currency)}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => setQuoteForm({ ...quoteForm, items: quoteForm.items.filter((x) => x.id !== item.id) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell></TableRow>; })}</TableBody></Table> : <EmptyState text="Todavía no agregas productos." />}</CardContent></Card></TabsContent>

        <TabsContent value="quotes" className="space-y-6"><Card className="rounded-2xl shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Cotizaciones guardadas</CardTitle><Input className="max-w-sm" placeholder="Buscar..." value={searchQuotes} onChange={(e) => setSearchQuotes(e.target.value)} /></CardHeader><CardContent className="p-0 overflow-x-auto">{quoteRows.length ? <Table><TableHeader><TableRow><TableHead>Folio</TableHead><TableHead>Proyecto</TableHead><TableHead>Cliente</TableHead><TableHead>Moneda</TableHead><TableHead>Subtotal</TableHead><TableHead>Costo proveedor</TableHead><TableHead>MO</TableHead><TableHead>Margen real</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{quoteRows.map((row) => <TableRow key={row.id}><TableCell>{row.folio}</TableCell><TableCell>{row.project || "-"}</TableCell><TableCell>{row.client}</TableCell><TableCell>{row.currency}</TableCell><TableCell>{fmtCurrency(row.subtotal, row.currency)}</TableCell><TableCell>{fmtCurrency(row.supplierCost, row.currency)}</TableCell><TableCell>{fmtCurrency(row.laborCost, row.currency)}</TableCell><TableCell>{row.realMarginPercent}%</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => setSelectedQuoteId(row.id)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => { setEditingQuoteId(row.id); setQuoteForm({ ...row, items: (row.items || []).map((x) => ({ ...x })) }); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => persist({ ...db, quotes: (db.quotes || []).filter((q) => q.id !== row.id) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell></TableRow>)}</TableBody></Table> : <EmptyState text="No hay cotizaciones guardadas." />}</CardContent></Card>{selectedQuote ? <Card className="rounded-2xl shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Vista previa</CardTitle><div className="flex gap-2"><Dialog><DialogTrigger asChild><Button><Eye className="mr-2 h-4 w-4" />Ver formato</Button></DialogTrigger><DialogContent className="max-h-[90vh] max-w-6xl overflow-auto"><DialogHeader><DialogTitle>Vista previa</DialogTitle></DialogHeader><QuotePreview quote={selectedQuote} employee={(db.employees || []).find((e) => String(e.idEmpleado) === String(selectedQuote.employeeId))} /></DialogContent></Dialog><Button variant="outline" onClick={exportSelectedQuoteHtml}><Download className="mr-2 h-4 w-4" />Exportar HTML</Button></div></CardHeader></Card> : null}</TabsContent>

        <TabsContent value="supplier-invoices" className="space-y-6"><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Cargar factura desde XML CFDI</CardTitle></CardHeader><CardContent className="space-y-4"><label className="inline-flex cursor-pointer items-center rounded-2xl border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"><Upload className="mr-2 h-4 w-4" />Cargar XML<input type="file" accept=".xml,text/xml,application/xml" className="hidden" onChange={handleSupplierXmlImport} /></label><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"><div><Label>Factura</Label><Input value={invoiceForm.invoiceNumber} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })} /></div><div><Label>UUID</Label><Input value={invoiceForm.uuid} onChange={(e) => setInvoiceForm({ ...invoiceForm, uuid: e.target.value })} /></div><div><Label>Proveedor</Label><Input value={invoiceForm.supplier} onChange={(e) => setInvoiceForm({ ...invoiceForm, supplier: e.target.value })} /></div><div><Label>Proyecto</Label><Input value={invoiceForm.project} onChange={(e) => setInvoiceForm({ ...invoiceForm, project: e.target.value })} /></div><div><Label>Folio cotización</Label><Select value={invoiceForm.quoteFolio || "__none__"} onValueChange={(value) => { const nextFolio = value === "__none__" ? "" : value; const quote = quotesComputed.find((q) => q.folio === nextFolio); setInvoiceForm({ ...invoiceForm, quoteFolio: nextFolio, project: quote?.project || invoiceForm.project, items: rematchInvoiceItemsForQuote(invoiceForm.items || [], nextFolio) }); }}><SelectTrigger><SelectValue placeholder="Selecciona cotización" /></SelectTrigger><SelectContent><SelectItem value="__none__">Sin asignar</SelectItem>{quoteRows.map((q) => <SelectItem key={q.id} value={q.folio}>{q.folio} - {q.client}{q.project ? ` / ${q.project}` : ""}</SelectItem>)}</SelectContent></Select></div><div><Label>Fecha</Label><Input type="date" value={invoiceForm.date} onChange={(e) => setInvoiceForm({ ...invoiceForm, date: e.target.value })} /></div><div><Label>Moneda</Label><Input value={invoiceForm.currency} onChange={(e) => setInvoiceForm({ ...invoiceForm, currency: e.target.value as CurrencyCode })} /></div><div><Label>Total</Label><Input type="number" value={invoiceForm.withTax} onChange={(e) => setInvoiceForm({ ...invoiceForm, withTax: Number(e.target.value) })} /></div><div className="xl:col-span-4"><Label>Notas</Label><Textarea value={invoiceForm.notes} onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} /></div></div><div className="flex gap-2"><Button onClick={saveInvoice}><Save className="mr-2 h-4 w-4" />Guardar factura</Button><Button variant="outline" onClick={() => setInvoiceForm(blankInvoiceForm)}>Limpiar</Button></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Conceptos detectados del XML</CardTitle></CardHeader><CardContent className="p-0 overflow-x-auto">{invoiceForm.items?.length ? <Table><TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Descripción</TableHead><TableHead>Cantidad</TableHead><TableHead>Unidad</TableHead><TableHead>Precio unitario</TableHead><TableHead>Importe</TableHead><TableHead>Match cotización</TableHead></TableRow></TableHeader><TableBody>{invoiceForm.items.map((item) => <TableRow key={item.id}><TableCell>{item.sku}</TableCell><TableCell>{item.description}</TableCell><TableCell>{item.quantity}</TableCell><TableCell>{item.unit || item.unitCode}</TableCell><TableCell>{fmtCurrency(item.unitPrice, invoiceForm.currency || "MXN")}</TableCell><TableCell>{fmtCurrency(item.amount, invoiceForm.currency || "MXN")}</TableCell><TableCell>{item.matchedQuoteCatalog ? <div className="inline-flex items-center gap-1 text-emerald-700"><Link2 className="h-3 w-3" />{item.matchedQuoteCatalog}</div> : <span className="text-slate-400">Sin match</span>}</TableCell></TableRow>)}</TableBody></Table> : <EmptyState text="Carga un XML para ver sus conceptos." />}</CardContent></Card><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Facturas guardadas</CardTitle></CardHeader><CardContent className="p-0 overflow-x-auto">{(db.supplierInvoices || []).length ? <Table><TableHeader><TableRow><TableHead>Factura</TableHead><TableHead>Proveedor</TableHead><TableHead>Proyecto</TableHead><TableHead>Cotización</TableHead><TableHead>Subtotal</TableHead><TableHead>Total</TableHead><TableHead>Conceptos</TableHead></TableRow></TableHeader><TableBody>{(db.supplierInvoices || []).map((row) => <TableRow key={row.id}><TableCell>{row.invoiceNumber || row.uuid}</TableCell><TableCell>{row.supplier}</TableCell><TableCell>{row.project}</TableCell><TableCell>{row.quoteFolio}</TableCell><TableCell>{fmtCurrency(row.beforeTax, row.currency || "MXN")}</TableCell><TableCell>{fmtCurrency(row.withTax, row.currency || "MXN")}</TableCell><TableCell>{row.items?.length || 0}</TableCell></TableRow>)}</TableBody></Table> : <EmptyState text="Aún no hay facturas guardadas." />}</CardContent></Card></TabsContent>

        <TabsContent value="labor" className="space-y-6"><div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]"><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>{editingLaborRoleId ? "Editar rol de mano de obra" : "Catálogo de roles"}</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2"><div><Label>Rol</Label><Input value={laborRoleForm.roleName} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, roleName: e.target.value })} /></div><div><Label>Salario diario</Label><Input type="number" value={laborRoleForm.dailySalary} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, dailySalary: Number(e.target.value) })} /></div><div><Label>IMSS %</Label><Input type="number" value={laborRoleForm.imssPercent} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, imssPercent: Number(e.target.value) })} /></div><div><Label>INFONAVIT %</Label><Input type="number" value={laborRoleForm.infonavitPercent} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, infonavitPercent: Number(e.target.value) })} /></div><div><Label>SAR %</Label><Input type="number" value={laborRoleForm.sarPercent} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, sarPercent: Number(e.target.value) })} /></div><div><Label>Aguinaldo %</Label><Input type="number" value={laborRoleForm.aguinaldoPercent} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, aguinaldoPercent: Number(e.target.value) })} /></div><div><Label>Vacaciones %</Label><Input type="number" value={laborRoleForm.vacationPercent} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, vacationPercent: Number(e.target.value) })} /></div><div><Label>Herramienta diario</Label><Input type="number" value={laborRoleForm.toolCostDaily} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, toolCostDaily: Number(e.target.value) })} /></div><div><Label>Seguridad diario</Label><Input type="number" value={laborRoleForm.safetyCostDaily} onChange={(e) => setLaborRoleForm({ ...laborRoleForm, safetyCostDaily: Number(e.target.value) })} /></div><div className="rounded-2xl bg-slate-100 p-3 text-sm"><div className="text-slate-500">Costo diario real</div><div className="text-lg font-semibold">{fmtCurrency(computeLaborRoleDailyCost(laborRoleForm), "MXN")}</div></div><div className="md:col-span-2 flex gap-2"><Button onClick={saveLaborRole}>{editingLaborRoleId ? "Guardar cambios" : "Agregar rol"}</Button><Button variant="outline" onClick={() => { setEditingLaborRoleId(""); setLaborRoleForm(blankLaborRoleForm); }}>Cancelar</Button></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Roles guardados</CardTitle></CardHeader><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Rol</TableHead><TableHead>Salario diario</TableHead><TableHead>Costo real diario</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(db.laborRoles || []).map((role) => <TableRow key={role.id}><TableCell>{role.roleName}</TableCell><TableCell>{fmtCurrency(role.dailySalary, "MXN")}</TableCell><TableCell>{fmtCurrency(computeLaborRoleDailyCost(role), "MXN")}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditingLaborRoleId(role.id); setLaborRoleForm({ ...role }); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => persist({ ...db, laborRoles: (db.laborRoles || []).filter((r) => r.id !== role.id) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></div><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Estimador de mano de obra por cotización</CardTitle></CardHeader><CardContent className="space-y-6"><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"><div><Label>Cotización</Label><Select value={laborEstimateForm.quoteFolio || ""} onValueChange={(value) => { const quote = quoteRows.find((q) => q.folio === value); setLaborEstimateForm({ ...laborEstimateForm, quoteFolio: value, project: quote?.project || "" }); }}><SelectTrigger><SelectValue placeholder="Selecciona cotización" /></SelectTrigger><SelectContent>{quoteRows.map((q) => <SelectItem key={q.id} value={q.folio}>{q.folio} - {q.client}</SelectItem>)}</SelectContent></Select></div><div><Label>Proyecto</Label><Input value={laborEstimateForm.project} onChange={(e) => setLaborEstimateForm({ ...laborEstimateForm, project: e.target.value })} /></div><div><Label>Fecha</Label><Input type="date" value={laborEstimateForm.date} onChange={(e) => setLaborEstimateForm({ ...laborEstimateForm, date: e.target.value })} /></div><div><Label>Notas</Label><Input value={laborEstimateForm.notes} onChange={(e) => setLaborEstimateForm({ ...laborEstimateForm, notes: e.target.value })} /></div></div><div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]"><div className="rounded-2xl border p-4"><h3 className="mb-4 font-semibold">Agregar cuadrilla</h3><div className="grid grid-cols-1 gap-4 md:grid-cols-4"><div><Label>Rol</Label><Select value={laborLineForm.roleId || ""} onValueChange={(value) => { const role = (db.laborRoles || []).find((r) => r.id === value); setLaborLineForm({ ...laborLineForm, roleId: value, roleName: role?.roleName || "", dailyBaseCost: role ? computeLaborRoleDailyCost(role) : 0 }); }}><SelectTrigger><SelectValue placeholder="Selecciona rol" /></SelectTrigger><SelectContent>{(db.laborRoles || []).filter((r) => r.active).map((role) => <SelectItem key={role.id} value={role.id}>{role.roleName}</SelectItem>)}</SelectContent></Select></div><div><Label>Personas</Label><Input type="number" value={laborLineForm.people} onChange={(e) => setLaborLineForm({ ...laborLineForm, people: Number(e.target.value) })} /></div><div><Label>Días</Label><Input type="number" value={laborLineForm.days} onChange={(e) => setLaborLineForm({ ...laborLineForm, days: Number(e.target.value) })} /></div><div><Label>Costo diario real</Label><Input value={fmtCurrency(laborLineForm.dailyBaseCost || 0, "MXN")} readOnly /></div></div><div className="mt-4"><Button onClick={addLaborLine}><Plus className="mr-2 h-4 w-4" />Agregar línea</Button></div><div className="mt-6 overflow-x-auto">{laborEstimateForm.lines.length ? <Table><TableHeader><TableRow><TableHead>Rol</TableHead><TableHead>Personas</TableHead><TableHead>Días</TableHead><TableHead>Costo diario</TableHead><TableHead>Total</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{laborEstimateForm.lines.map((line) => <TableRow key={line.id}><TableCell>{line.roleName}</TableCell><TableCell>{line.people}</TableCell><TableCell>{line.days}</TableCell><TableCell>{fmtCurrency(line.dailyBaseCost, "MXN")}</TableCell><TableCell>{fmtCurrency(line.totalCost, "MXN")}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => setLaborEstimateForm({ ...laborEstimateForm, lines: laborEstimateForm.lines.filter((x) => x.id !== line.id) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell></TableRow>)}</TableBody></Table> : <EmptyState text="Aún no agregas cuadrilla." />}</div></div><div className="rounded-2xl border p-4"><h3 className="mb-4 font-semibold">Extras del proyecto</h3><div className="grid grid-cols-1 gap-4"><div><Label>Transporte</Label><Input type="number" value={laborEstimateForm.transportCost} onChange={(e) => setLaborEstimateForm({ ...laborEstimateForm, transportCost: Number(e.target.value) })} /></div><div><Label>Hospedaje</Label><Input type="number" value={laborEstimateForm.lodgingCost} onChange={(e) => setLaborEstimateForm({ ...laborEstimateForm, lodgingCost: Number(e.target.value) })} /></div><div><Label>Alimentos</Label><Input type="number" value={laborEstimateForm.foodCost} onChange={(e) => setLaborEstimateForm({ ...laborEstimateForm, foodCost: Number(e.target.value) })} /></div><div><Label>Misceláneos</Label><Input type="number" value={laborEstimateForm.miscCost} onChange={(e) => setLaborEstimateForm({ ...laborEstimateForm, miscCost: Number(e.target.value) })} /></div><div className="rounded-2xl bg-slate-100 p-4"><div className="flex justify-between text-sm"><span>Líneas mano de obra</span><strong>{fmtCurrency((laborEstimateForm.lines || []).reduce((acc, line) => acc + line.totalCost, 0), "MXN")}</strong></div><div className="mt-2 flex justify-between text-sm"><span>Extras</span><strong>{fmtCurrency(toNumber(laborEstimateForm.transportCost) + toNumber(laborEstimateForm.lodgingCost) + toNumber(laborEstimateForm.foodCost) + toNumber(laborEstimateForm.miscCost), "MXN")}</strong></div><div className="mt-3 flex justify-between border-t pt-3 text-base font-semibold"><span>Total mano de obra</span><strong>{fmtCurrency(computeLaborEstimateTotal(laborEstimateForm), "MXN")}</strong></div></div><Button className="mt-2 w-full" onClick={saveLaborEstimate}><Save className="mr-2 h-4 w-4" />Guardar estimación</Button></div></div></div></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Estimaciones guardadas</CardTitle></CardHeader><CardContent className="p-0 overflow-x-auto">{(db.laborEstimates || []).length ? <Table><TableHeader><TableRow><TableHead>Cotización</TableHead><TableHead>Proyecto</TableHead><TableHead>Fecha</TableHead><TableHead>Total</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(db.laborEstimates || []).map((estimate) => <TableRow key={estimate.id}><TableCell>{estimate.quoteFolio}</TableCell><TableCell>{estimate.project || "-"}</TableCell><TableCell>{estimate.date}</TableCell><TableCell>{fmtCurrency(computeLaborEstimateTotal(estimate), "MXN")}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => persist({ ...db, laborEstimates: (db.laborEstimates || []).filter((x) => x.id !== estimate.id) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell></TableRow>)}</TableBody></Table> : <EmptyState text="No hay estimaciones de mano de obra." />}</CardContent></Card></TabsContent>

        <TabsContent value="report" className="space-y-6"><Card className="rounded-2xl shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Reporte</CardTitle><Button variant="outline" onClick={() => exportArrayToCsv(quoteRows.map((q) => ({ folio: q.folio, proyecto: q.project, cliente: q.client, vendedor: q.seller, moneda: q.currency, tipo_cambio: q.exchangeRate, subtotal: q.subtotal, costo_partidas: q.costSubtotal, costo_proveedor: q.supplierCost, pagos: q.payrollCost, mano_obra: q.laborCost, utilidad_estimada: q.estimatedNet, margen_real_pct: q.realMarginPercent })), "reporte_financiero_cotizaciones.csv")}><Download className="mr-2 h-4 w-4" />Exportar CSV</Button></CardHeader><CardContent className="p-0 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Folio</TableHead><TableHead>Proyecto</TableHead><TableHead>Moneda</TableHead><TableHead>Subtotal</TableHead><TableHead>Costo proveedor</TableHead><TableHead>MO</TableHead><TableHead>Utilidad estimada</TableHead><TableHead>Margen real %</TableHead></TableRow></TableHeader><TableBody>{quoteRows.map((q) => <TableRow key={q.id}><TableCell>{q.folio}</TableCell><TableCell>{q.project || "-"}</TableCell><TableCell>{q.currency}</TableCell><TableCell>{fmtCurrency(q.subtotal, q.currency)}</TableCell><TableCell>{fmtCurrency(q.supplierCost, q.currency)}</TableCell><TableCell>{fmtCurrency(q.laborCost, q.currency)}</TableCell><TableCell>{fmtCurrency(q.estimatedNet, q.currency)}</TableCell><TableCell>{q.realMarginPercent}%</TableCell></TableRow>)}</TableBody></Table></CardContent></Card><Card className="rounded-2xl shadow-sm"><CardHeader><CardTitle>Qué incluye mano de obra</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm text-slate-600"><div>• Salario diario</div><div>• IMSS patronal</div><div>• INFONAVIT</div><div>• SAR</div><div>• Aguinaldo prorrateado</div><div>• Vacaciones prorrateadas</div><div>• Herramienta diaria</div><div>• Equipo de seguridad</div><div>• Transporte</div><div>• Hospedaje</div><div>• Alimentos</div><div>• Misceláneos</div></CardContent></Card></TabsContent>
      </Tabs></div></div>
  );
}
