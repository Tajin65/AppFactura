export type CurrencyCode = "MXN" | "USD";

export type Product = {
  id: string;
  partNumber: string;
  shortName: string;
  presentation: string;
  model: string;
  brand: string;
  costCurrency: CurrencyCode;
  listCurrency: CurrencyCode;
  unitCost: number;
  listPrice: number;
  marginPercent: number;
  description: string;
};

export type Client = {
  idCliente: number;
  nombreComp: string;
  direccion: string;
  credito: number;
};

export type Employee = {
  idEmpleado: number;
  fullName: string;
  iniciales: string;
  cargo: string;
  email: string;
};

export type QuoteItem = {
  id: string;
  catalog: string;
  description: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
};

export type Quote = {
  id: string;
  folio: string;
  project: string;
  clientId: string;
  employeeId: string;
  quoteDate: string;
  currency: CurrencyCode;
  exchangeRate: number;
  taxPercent: number;
  shipping: number;
  items: QuoteItem[];
};

export type LaborRole = {
  id: string;
  roleName: string;
  dailySalary: number;
  imssPercent: number;
  toolCostDaily: number;
};

export type AppData = {
  products: Product[];
  clients: Client[];
  employees: Employee[];
  quotes: Quote[];
  laborRoles: LaborRole[];
};
