import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function dibujosModularesPlugin() {
  return {
    name: 'dibujos-modulares-plugin',
    configureServer(server) {
      server.middlewares.use('/api/dibujos', (req, res) => {
        try {
          const dirPath = path.resolve(process.cwd(), 'dibujos');
          let files = [];
          if (fs.existsSync(dirPath)) {
            files = fs.readdirSync(dirPath).filter((f) =>
              /\.(jpg|jpeg|png|webp|svg|avif|gif)$/i.test(f)
            );
          }
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify({ files }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ files: [], error: err.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [dibujosModularesPlugin()],
  build: {
    rollupOptions: { input: { main: 'index.html', ia: 'ia.html' } }
  },
  server: {
    port: 5173,
    open: true
  }
});
