import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

const railwayHost = process.env.RAILWAY_PUBLIC_DOMAIN

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  preview: {
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: railwayHost ? [railwayHost] : true,
  },
})
