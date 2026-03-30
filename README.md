# Punto Cero Project Manager

Sistema para administrar:

- Cotizaciones
- Productos
- Clientes
- Facturas de proveedor XML
- Costos de mano de obra
- Margen real por proyecto

Stack:

- React
- TypeScript
- Vite

## Desarrollo local

```bash
npm install
npm run dev
```

## Deploy en Railway

El proyecto ya está configurado para Railway con `railway.json` y script `start`.

1. Conecta este repositorio en Railway.
2. Railway ejecutará el build con:

   ```bash
   npm run build
   ```

3. Railway iniciará la app con:

   ```bash
   npm run start
   ```

El servidor escucha en `0.0.0.0` y usa la variable `PORT` de Railway.
