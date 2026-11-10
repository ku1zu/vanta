import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// host: true exposes the dev server on your LAN so you can test on a real phone.
export default defineConfig({ plugins: [react()], server: { host: true } })
