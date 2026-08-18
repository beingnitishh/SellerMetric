import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(process.cwd());
const origin = 'https://sellermetric.vercel.app';
const image = `${origin}/assets/og-image.png`;

const pages = [
  {
    path: '/', title: 'SellerMetric | Free Flipkart Seller Analytics',
    description: 'Analyze Flipkart sales, returns, SKU performance and revenue leakage with SellerMetric. Upload seller reports and turn raw marketplace data into actionable insights.',
    h1: 'Turn Your Flipkart Reports Into Decisions',
    intro: 'Free, private Flipkart seller analytics for sales reports, return reports, SKU performance, RTO and revenue leakage.'
  },
  {
    path: '/features', title: 'Flipkart Seller Analytics Features | SellerMetric',
    description: 'Explore SellerMetric features for Flipkart sales analysis, return analysis, SKU performance, revenue leakage and seller business insights.',
    h1: 'SellerMetric Features for Flipkart Seller Analytics',
    intro: 'Explore sales intelligence, return analysis, SKU and category performance, daily trends and private browser-based reporting.'
  },
  {
    path: '/how-it-works', title: 'How SellerMetric Works | Flipkart Seller Report Analyzer',
    description: 'Upload your Flipkart seller reports and turn sales and return data into clear business insights in three simple steps.',
    h1: 'How SellerMetric Analyzes Flipkart Seller Reports',
    intro: 'Learn how SellerMetric detects Sales and Return reports, processes data locally and builds the right analytics dashboard.'
  },
  {
    path: '/privacy', title: 'Privacy Policy | SellerMetric',
    description: 'Learn how SellerMetric handles uploaded Flipkart seller reports, data processing and user privacy.',
    h1: 'SellerMetric Privacy and Local Report Processing',
    intro: 'Understand what SellerMetric reads, what it does not collect and how reports are processed inside your browser.'
  },
  {
    path: '/faq', title: 'SellerMetric FAQ | Flipkart Seller Report Analyzer',
    description: 'Get answers about SellerMetric, Flipkart report analysis, supported CSV and Excel files, privacy, returns, sales analytics and seller insights.',
    h1: 'SellerMetric Frequently Asked Questions',
    intro: 'Answers about supported Flipkart reports, sales and return metrics, file formats, local processing and troubleshooting.'
  },
  {
    path: '/blog', title: 'Flipkart Seller Analytics Guides | SellerMetric',
    description: 'Practical guides to Flipkart sales reports, return analysis, SKU performance, RTO and revenue leakage for marketplace sellers.',
    h1: 'Practical Guides for Flipkart Seller Analytics',
    intro: 'Original methodology and examples for understanding Flipkart seller reports and improving data-driven decisions.'
  },
  {
    path: '/blog/flipkart-sales-report-analysis', title: 'How to Analyze a Flipkart Sales Report | SellerMetric',
    description: 'Learn how to analyze Flipkart GMV, final sales, returns, cancellations, daily trends and SKU performance from a seller Sales Report.',
    h1: 'How to Analyze a Flipkart Sales Report', category: 'Sales reports',
    intro: 'A practical method for reading Flipkart sales reports, calculating realization, and finding the SKUs and dates behind revenue changes.'
  },
  {
    path: '/blog/flipkart-return-report-analysis', title: 'How to Analyze a Flipkart Return Report | SellerMetric',
    description: 'Separate RTO and customer returns, measure refund exposure, group return reasons and identify problem SKUs in Flipkart return data.',
    h1: 'How to Analyze a Flipkart Return Report', category: 'Returns',
    intro: 'A practical workflow for understanding RTO, customer returns, refund exposure, return reasons and product-level patterns.'
  },
  {
    path: '/blog/flipkart-sku-analysis', title: 'How to Analyze Flipkart SKU Performance | SellerMetric',
    description: 'Find your best and worst Flipkart SKUs using realized revenue, return rate, cancellation rate and revenue contribution.',
    h1: 'How to Find Your Best and Worst Flipkart SKUs', category: 'SKU analysis',
    intro: 'Evaluate product performance without relying on sales volume alone.'
  },
  {
    path: '/blog/flipkart-rto-analysis', title: 'Flipkart RTO Analysis Guide | SellerMetric',
    description: 'Understand Flipkart RTO, calculate its share of returns, identify concentration and build a practical failed-delivery investigation workflow.',
    h1: 'Flipkart RTO Analysis: What Sellers Should Measure', category: 'RTO analysis',
    intro: 'Separate failed delivery from customer returns and use the right denominator before acting.'
  },
  {
    path: '/blog/flipkart-revenue-leakage', title: 'Flipkart Revenue Leakage Analysis | SellerMetric',
    description: 'Understand the gap between Flipkart GMV and final realized sales using cancellation, return, SKU and category analysis.',
    h1: 'Flipkart Revenue Leakage: Where Sellers Lose Realization', category: 'Revenue leakage',
    intro: 'Identify visible sales-report leakage without confusing it with profit or settlement reconciliation.'
  }
];

const links = pages.map(page => `<a href="${page.path}">${page.path === '/' ? 'Home' : page.h1.replace('SellerMetric ', '')}</a>`).join('');

function schema(page) {
  let value = null;
  if (page.path === '/') {
    value = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'SellerMetric', url: `${origin}/`, description: pages[0].description, inLanguage: 'en-IN' },
        { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'SellerMetric', url: `${origin}/`, logo: { '@type': 'ImageObject', url: `${origin}/assets/logo-mark.png`, width: 245, height: 256 }, sameAs: ['https://www.instagram.com/oyee.nitishh/'] }
      ]
    };
  } else if (page.category) {
    value = {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: page.h1, description: page.description, mainEntityOfPage: `${origin}${page.path}`,
      image, datePublished: '2026-08-19', dateModified: '2026-08-19', inLanguage: 'en-IN',
      author: { '@type': 'Person', name: 'Nitish Kumar', url: 'https://www.instagram.com/oyee.nitishh/' },
      publisher: { '@type': 'Organization', name: 'SellerMetric', logo: { '@type': 'ImageObject', url: `${origin}/assets/logo-mark.png` } }
    };
  }
  return value ? `<script type="application/ld+json">${JSON.stringify(value).replaceAll('<','\\u003c')}</script>` : '';
}

function html(page) {
  const canonical = `${origin}${page.path === '/' ? '/' : page.path}`;
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${canonical}" />
  <meta name="theme-color" content="#eaf6ff" />
  <link rel="icon" type="image/png" sizes="128x128" href="/assets/logo-mark.png" />
  <link rel="apple-touch-icon" href="/assets/logo-mark.png" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="SellerMetric" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="SellerMetric Flipkart seller analytics dashboard and report insights" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${page.title}" />
  <meta name="twitter:description" content="${page.description}" />
  <meta name="twitter:image" content="${image}" />
  ${schema(page)}
  <style>.seo-fallback{max-width:760px;margin:12vh auto;padding:32px;font-family:system-ui,-apple-system,sans-serif;color:#10233e}.seo-fallback h1{font-size:clamp(2rem,6vw,4rem);line-height:1.02}.seo-fallback p{color:#617085;line-height:1.7}.seo-fallback nav{display:flex;gap:16px;flex-wrap:wrap;margin-top:28px}.seo-fallback a{color:#087bff}</style>
</head>
<body>
  <div id="root"><main class="seo-fallback"><p>SellerMetric · Flipkart seller analytics</p><h1>${page.h1}</h1><p>${page.intro}</p><nav aria-label="SellerMetric pages">${links}</nav></main></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

for (const oldDirectory of ['features', 'how-it-works', 'privacy', 'faq', 'blog']) rmSync(resolve(root, oldDirectory), { recursive: true, force: true });
for (const page of pages) {
  const target = page.path === '/' ? resolve(root, 'index.html') : resolve(root, `${page.path.slice(1)}.html`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html(page));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${origin}${page.path === '/' ? '/' : page.path}</loc><lastmod>2026-08-19</lastmod></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap);

const notFound = `<!doctype html><html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, follow"><title>Page Not Found | SellerMetric</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:linear-gradient(#d9efff,#fff);font-family:system-ui;color:#10233e}.card{text-align:center;max-width:560px;padding:45px}.code{font:italic 5rem Georgia;color:#087bff}h1{font-size:2rem}p{color:#617085;line-height:1.7}a{display:inline-block;margin-top:15px;padding:13px 20px;border-radius:10px;background:#062c59;color:white;text-decoration:none;font-weight:700}</style></head><body><main class="card"><div class="code">404</div><h1>This page could not be found.</h1><p>The URL may be incorrect or the page may have moved. Return to SellerMetric to analyze your Flipkart seller reports.</p><a href="/">Return to SellerMetric</a></main></body></html>`;
writeFileSync(resolve(root, 'public/404.html'), notFound);
