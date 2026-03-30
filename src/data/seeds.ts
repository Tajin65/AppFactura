import type { AppData } from "../types";

export const today = () => new Date().toISOString().slice(0, 10);

export const initialData: AppData = {
  products: [
    {
      id: "prod_1",
      partNumber: "EI60001003_V2",
      shortName: "H1Z2Z2-K/62930 IEC 6mm2",
      presentation: "BOBINA",
      model: "H1Z2Z2-K/62930 IEC",
      brand: "KIBOR CABLE",
      costCurrency: "USD",
      listCurrency: "USD",
      unitCost: 12,
      listPrice: 15,
      marginPercent: 25,
      description: "Conductor Stranded Tinned Copper",
    },
  ],
  clients: [{ idCliente: 15, nombreComp: "Consuelo", direccion: "Corregidora, Querétaro", credito: 15 }],
  employees: [{ idEmpleado: 1, fullName: "Alejandro Chi", iniciales: "ACHI", cargo: "Ventas", email: "a.chi@puntocerosoluciones.mx" }],
  quotes: [],
  laborRoles: [{ id: "role_1", roleName: "Instalador", dailySalary: 500, imssPercent: 30, toolCostDaily: 120 }],
};
