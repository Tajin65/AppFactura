import { defineConfig } from "vite"

const railwayHost = process.env.RAILWAY_PUBLIC_DOMAIN

export default defineConfig({
  preview: {
    allowedHosts: railwayHost ? [railwayHost] : true,
  },
})
