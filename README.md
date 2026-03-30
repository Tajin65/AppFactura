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

El proyecto está preparado para Railway usando `railway.json` (Nixpacks):

- **Build command:** `npm run build`
- **Start command:** `npm run start`

### Consideraciones de runtime

- El servidor de preview se levanta con `--host 0.0.0.0` para aceptar tráfico externo.
- Se usa `--port ${PORT:-4173}` para respetar el puerto asignado por Railway.
- Se habilitó `--strictPort` para fallar rápido si el puerto no está disponible.
- `vite.config.ts` permite el host de Railway vía `RAILWAY_PUBLIC_DOMAIN` y agrega alias `@ -> ./src`.
- `package.json` declara `engines.node: >=20.0.0` para un runtime consistente.

### Pasos

1. Conecta este repositorio en Railway.
2. Confirma que Railway detecte `railway.json`.
3. Lanza el deploy.
4. Revisa logs de build/start desde el panel de Railway.
