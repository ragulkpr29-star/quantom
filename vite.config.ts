import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const vercelApiPlugin = () => ({
  name: 'vercel-api-mock',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url && req.url.startsWith('/api/')) {
        try {
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          let handler;
          if (urlObj.pathname === '/api/login') handler = (await import('./api/login.js')).default;
          else if (urlObj.pathname === '/api/logout') handler = (await import('./api/logout.js')).default;
          else if (urlObj.pathname === '/api/verify') handler = (await import('./api/verify.js')).default;
          else if (urlObj.pathname === '/api/proxy') handler = (await import('./api/proxy.js')).default;
          
          if (handler) {
             return handler(req, res);
          }
        } catch(e) {
          console.error("Mock API Error:", e);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: "Internal Mock API Error" }));
        }
      }
      next();
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };
  
  return {
    plugins: [react(), vercelApiPlugin()]
  };
});
