import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";

import dns from "dns";
import path from "path";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  // root: "./", // Set the root directory of your project
  // base: "/", // Set the base URL path for your application

  build: {
    // outDir: "build", // comment this if you select vite as project when deploy
    assetsDir: "@/assets", // Set the directory for the static assets
    // sourcemap: process.env.__DEV__ === "true",
    rollupOptions: {
      // Additional Rollup configuration options if needed
    },
    chunkSizeWarningLimit: 10 * 1024,
  },
  plugins: [
    react({
      include: "**/*.{jsx,js}", // Process both .js and .jsx files through react plugin
    }),
    cssInjectedByJsPlugin(),

    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        // enabled: process.env.SW_DEV === "true",
        enabled: false,
        /* when using generateSW the PWA plugin will switch to classic */
        type: "module",
        navigateFallback: "index.html",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },

      // add this to cache all the
      // // static assets in the public folder
      // includeAssets: ["**/*"],
      includeAssets: [
        "src/assets/img/logo/*.png",
        "src/assets/img/*.png",
        "src/assets/img/*.jepg",
        "src/assets/img/*.webp",
        "favicon.ico",
      ],
      manifest: {
        theme_color: "#FFFFFF",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait",
        scope: ".",
        start_url: ".",
        id: ".",
        short_name: "SAPT Markets - E-Commerce Website",
        name: "SAPT Markets | React eCommerce Admin Dashboard",
        description:
          "SAPT Markets : React Grocery & Organic Food Store e-commerce Admin Dashboard",
        icons: [
          {
            src: "favicon.ico",
            sizes: "48x48",
            type: "image/x-icon",
          },
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    compression(),
    visualizer({
      filename: "statistics.html",
      open: true,
    }),
  ],

  server: {
    port: 4100,
    host: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5055",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    "process.env": process.env,
    // global: {}, //enable this when running on dev/local mode
  },

  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src/"),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'] // Add extensions for resolution
  },
  test: {
    global: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTest.js"],
  },
});
