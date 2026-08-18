import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: { host: '0.0.0.0', allowedHosts: true },
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, 'index.html'),
        features: path.resolve(__dirname, 'features.html'),
        howItWorks: path.resolve(__dirname, 'how-it-works.html'),
        privacy: path.resolve(__dirname, 'privacy.html'),
        faq: path.resolve(__dirname, 'faq.html'),
        blog: path.resolve(__dirname, 'blog.html'),
        salesReportGuide: path.resolve(__dirname, 'blog/flipkart-sales-report-analysis.html'),
        returnReportGuide: path.resolve(__dirname, 'blog/flipkart-return-report-analysis.html'),
        skuAnalysisGuide: path.resolve(__dirname, 'blog/flipkart-sku-analysis.html'),
        rtoAnalysisGuide: path.resolve(__dirname, 'blog/flipkart-rto-analysis.html'),
        revenueLeakageGuide: path.resolve(__dirname, 'blog/flipkart-revenue-leakage.html'),
      },
    },
  },
});
