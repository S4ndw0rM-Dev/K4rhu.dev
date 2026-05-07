import { defineConfig } from 'vite' // <--- ¡ESTO ES LO QUE FALTA!
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', 
})