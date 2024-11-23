import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows external access
    // port: 3000, // Optional: Change the port if needed
  },
});
