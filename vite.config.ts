import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  base: "/projeto-link-direto/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "DSC Travel",
        short_name: "DSC",
        description: "Apresentação de viagem DSC Travel",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/projeto-link-direto/",
        scope: "/projeto-link-direto/",
        icons: [
          {
            src: "/projeto-link-direto/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/projeto-link-direto/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
})
