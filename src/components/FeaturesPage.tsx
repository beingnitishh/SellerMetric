import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BarChart3, Brain, Check, ChevronRight,
  FileSpreadsheet, Layers3, LockKeyhole, Menu, PackageSearch,
  RotateCcw, ShieldCheck, Sparkles, Target, TrendingUp, Upload, X,
} from 'lucide-react';
import { getAcceptString, isFileSupported } from '../fileSupport';
import '../features-page.css';

interface FeaturesPageProps {
  onFileSelect: (file: File) => void;
}

const featureNav = [
  ['sales-intelligence', 'Sales intelligence'],
  ['sku-performance', 'SKU & category analysis'],
  ['trend-analysis', 'Trends & visualization'],
  ['return-intelligence', 'Return intelligence'],
  ['automated-insights', 'Automated insights'],
  ['privacy-formats', 'Privacy & file support'],
];

export function FeaturesPage({ onFileSelect }: FeaturesPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.title = 'Flipkart Seller Analytics Features | SellerMetric'; const frame = requestAnimationFrame(() => { if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView(); }); return () => { cancelAnimationFrame(frame); document.title = 'SellerMetric — Free Flipkart Seller Report Analyzer'; }; }, []);
  const inputRef = useRef<HTMLInputElement>(null);

  const chooseReport = () => inputRef.current?.click();
  const handleFile = (file?: File) => {
    if (!file) return;
    if (!isFileSupported(file)) {
      window.alert('Unsupported format. Please choose a CSV, XLSX, XLS, or TSV report.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="fp-page">
      <header className="fp-header">
        <a className="fp-brand" href="/" aria-label="SellerMetric home">
          <img src="/assets/logo-mark.png" alt="" />
          <span>Seller<b>Metric</b></span>
        </a>
        <nav className="fp-desktop-nav" aria-label="Features navigation">
          <a href="/">Home</a>
          <a className="active" href="/features">Features</a>
          <a href="/how-it-works">How It Works</a>
          <a href="/blog">Seller Guides</a>
          <a href="/privacy">Privacy</a>
          <a href="/faq">FAQ</a>
        </nav>
        <button className="fp-nav-cta" onClick={chooseReport}>Analyze My Reports <ArrowRight size={14} /></button>
        <button className="fp-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav className="fp-mobile-nav">
            <a href="/">Home <ChevronRight /></a>
            <a href="/features">Features <ChevronRight /></a>
            <a href="/how-it-works">How It Works <ChevronRight /></a>
            <a href="/blog">Seller Guides <ChevronRight /></a>
            <a href="/privacy">Privacy <ChevronRight /></a>
            <a href="/faq">FAQ <ChevronRight /></a>
            <button onClick={chooseReport}>Analyze My Reports <ArrowRight /></button>
          </nav>
        )}
      </header>

      <input ref={inputRef} type="file" hidden accept={getAcceptString()} onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />

      <main>
        <section className="fp-hero">
          <div className="fp-cloud fp-cloud-one" /><div className="fp-cloud fp-cloud-two" />
          <div className="fp-shell fp-hero-inner">
            <a className="fp-back" href="/"><ArrowLeft size={14} /> Back to SellerMetric</a>
            <div className="fp-eyebrow"><Sparkles size={13} /> Complete feature guide</div>
            <h1><em>Every report has a story.</em><span>SellerMetric helps you read it.</span></h1>
            <p>Explore every calculation, visualization, and decision tool available inside SellerMetric—from a high-level business snapshot to individual SKU and return-reason analysis.</p>
            <div className="fp-hero-actions">
              <button className="fp-primary" onClick={chooseReport}><Upload size={16} /> Analyze My Reports</button>
              <a className="fp-secondary" href="#sales-intelligence">Explore Features <ArrowRight size={15} /></a>
            </div>
            <div className="fp-proof-row">
              <span><b>2</b> report dashboards</span>
              <span><b>4</b> supported file formats</span>
              <span><b>100%</b> browser-based</span>
            </div>
          </div>
        </section>

        <section className="fp-overview fp-shell">
          <div className="fp-overview-head">
            <div><div className="fp-eyebrow">What you can analyze</div><h2><em>From raw rows</em> to useful answers.</h2></div>
            <p>SellerMetric turns standard Flipkart exports into focused views for revenue, products, returns, risk, and business health.</p>
          </div>
          <div className="fp-overview-grid">
            <article><span><BarChart3 /></span><b>Sales performance</b><small>GMV, units, realization, cancellations, and final revenue</small></article>
            <article><span><PackageSearch /></span><b>Product performance</b><small>Per-SKU contribution, return rates, and cancellation rates</small></article>
            <article><span><RotateCcw /></span><b>Return intelligence</b><small>RTO split, refund leakage, reasons, and problem products</small></article>
            <article><span><Brain /></span><b>Decision support</b><small>Concentration risk, anomalies, and automatically flagged issues</small></article>
          </div>
        </section>

        <div className="fp-content fp-shell">
          <aside className="fp-toc">
            <span>ON THIS PAGE</span>
            {featureNav.map(([id, label], index) => <a href={`#${id}`} key={id}><i>{String(index + 1).padStart(2, '0')}</i>{label}</a>)}
            <div className="fp-toc-note"><ShieldCheck /><b>Private by design</b><small>Your report never leaves the browser.</small></div>
          </aside>

          <div className="fp-sections">
            <section className="fp-feature-section" id="sales-intelligence">
              <div className="fp-section-number">01</div>
              <div className="fp-section-copy"><div className="fp-tag">SALES REPORT</div><h2>Executive sales intelligence</h2><p>Start with a concise view of your business. SellerMetric calculates the core numbers directly from the uploaded report, keeping gross demand and realized revenue clearly separated.</p></div>
              <div className="fp-kpi-grid">
                <div><span>Gross Units</span><strong>1,420</strong><small>Total units ordered</small></div>
                <div><span>Gross Merchandise Value</span><strong>₹5,41,860</strong><small>Demand before leakage</small></div>
                <div><span>Net Realization</span><strong>82.2%</strong><small>Revenue retained</small></div>
                <div><span>Final Sale Amount</span><strong>₹4,45,408</strong><small>Revenue after adjustments</small></div>
              </div>
              <div className="fp-detail-grid">
                <div className="fp-detail-card"><TrendingUp /><div><b>Clear revenue waterfall</b><p>Compare GMV against cancellations, returns, and final sale amount to understand exactly where value is lost.</p></div></div>
                <div className="fp-detail-card"><Target /><div><b>Rates calculated automatically</b><p>Return rate, cancellation rate, and net realization are calculated consistently from your own report totals.</p></div></div>
              </div>
            </section>

            <section className="fp-feature-section" id="sku-performance">
              <div className="fp-section-number">02</div>
              <div className="fp-section-copy"><div className="fp-tag">PRODUCT ANALYSIS</div><h2>SKU and category performance</h2><p>Move beyond portfolio averages. Compare every product and category using the same revenue, return, cancellation, and contribution metrics.</p></div>
              <div className="fp-table-card">
                <div className="fp-table-title"><span>SKU Performance</span><small>Sorted by final revenue</small></div>
                <div className="fp-table-row fp-table-header"><span>SKU</span><span>Revenue</span><span>Return</span><span>Contribution</span></div>
                <div className="fp-table-row"><span>HOME-LAMP-01</span><b>₹84,320</b><em className="good">6.2%</em><span>18.9%</span></div>
                <div className="fp-table-row"><span>BEAUTY-KIT-08</span><b>₹61,480</b><em className="warn">14.8%</em><span>13.8%</span></div>
                <div className="fp-table-row"><span>FASHION-BAG-12</span><b>₹47,950</b><em className="bad">23.1%</em><span>10.7%</span></div>
              </div>
              <ul className="fp-check-list"><li><Check /> Revenue contribution for every SKU</li><li><Check /> Category-level return and cancellation rates</li><li><Check /> Automatically flagged products above portfolio averages</li><li><Check /> Top-20% and top-three-SKU concentration analysis</li></ul>
            </section>

            <section className="fp-feature-section" id="trend-analysis">
              <div className="fp-section-number">03</div>
              <div className="fp-section-copy"><div className="fp-tag">VISUAL ANALYTICS</div><h2>Daily trends and interactive charts</h2><p>See the shape of performance, not just the total. Charts make unusual return spikes, revenue peaks, and category dependencies easier to identify.</p></div>
              <div className="fp-chart-card">
                <div className="fp-chart-head"><div><b>Daily Revenue Trend</b><small>Final sale amount · last 30 days</small></div><span>● Revenue</span></div>
                <svg viewBox="0 0 700 230" preserveAspectRatio="none" aria-label="Example revenue trend chart"><defs><linearGradient id="fpArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#168cff" stopOpacity=".32"/><stop offset="1" stopColor="#168cff" stopOpacity="0"/></linearGradient></defs><path className="grid" d="M0 45H700M0 95H700M0 145H700M0 195H700"/><path className="area" d="M0 190 C45 180 70 148 110 164 S175 88 225 122 S305 168 355 90 S430 110 475 58 S555 89 605 48 S660 42 700 18 V230 H0Z"/><path className="line" d="M0 190 C45 180 70 148 110 164 S175 88 225 122 S305 168 355 90 S430 110 475 58 S555 89 605 48 S660 42 700 18"/></svg>
                <div className="fp-chart-labels"><span>1 Aug</span><span>8 Aug</span><span>15 Aug</span><span>22 Aug</span><span>30 Aug</span></div>
              </div>
              <div className="fp-highlight-row"><div><span>Highest revenue day</span><b>24 August</b><small>₹31,840 realized</small></div><div><span>Lowest revenue day</span><b>3 August</b><small>₹6,290 realized</small></div><div><span>Highest return day</span><b>18 August</b><small>42 returned units</small></div></div>
            </section>

            <section className="fp-feature-section" id="return-intelligence">
              <div className="fp-section-number">04</div>
              <div className="fp-section-copy"><div className="fp-tag amber">RETURN REPORT</div><h2>RTO and return intelligence</h2><p>Upload a Flipkart Return Report to separate courier returns from customer-initiated returns, measure refund exposure, and identify the reasons and SKUs driving leakage.</p></div>
              <div className="fp-return-layout">
                <div className="fp-donut-wrap"><div className="fp-donut"><span><b>38.4%</b>RTO rate</span></div><div className="fp-donut-legend"><span><i></i>Customer returns · 61.6%</span><span><i></i>RTO · 38.4%</span></div></div>
                <div className="fp-reason-list"><b>Top return reasons</b><div><span>Quality issue</span><i><u style={{width:'78%'}} /></i><em>78</em></div><div><span>Wrong item</span><i><u style={{width:'52%'}} /></i><em>52</em></div><div><span>Damaged</span><i><u style={{width:'37%'}} /></i><em>37</em></div><div><span>Not as described</span><i><u style={{width:'28%'}} /></i><em>28</em></div></div>
              </div>
              <ul className="fp-check-list"><li><Check /> Total returns and refund leakage</li><li><Check /> RTO vs customer-return split</li><li><Check /> Search by SKU or product name</li><li><Check /> Per-SKU drawer with reason breakdown</li></ul>
            </section>

            <section className="fp-feature-section" id="automated-insights">
              <div className="fp-section-number">05</div>
              <div className="fp-section-copy"><div className="fp-tag">DECISION SUPPORT</div><h2>Automated insights and risk flags</h2><p>SellerMetric translates calculated metrics into readable warnings. These rules surface unusual concentration, high RTO contribution, dominant return reasons, and problem SKUs.</p></div>
              <div className="fp-insights">
                <article className="warning"><span>!</span><div><b>High RTO alert</b><p>46.2% of returns are courier returns. Review shipping coverage and delivery partner performance.</p></div></article>
                <article className="danger"><span>↗</span><div><b>SKU anomaly detected</b><p>FASHION-BAG-12 drives 19.6% of return volume—well above the portfolio average.</p></div></article>
                <article className="info"><span>◎</span><div><b>Revenue concentration</b><p>Your top three SKUs contribute 54.8% of realized revenue. Monitor inventory and listing risk closely.</p></div></article>
              </div>
              <p className="fp-disclaimer"><Brain /> Automated insights are deterministic observations calculated from your uploaded data—not financial advice or generative predictions.</p>
            </section>

            <section className="fp-feature-section" id="privacy-formats">
              <div className="fp-section-number">06</div>
              <div className="fp-section-copy"><div className="fp-tag green">PRIVATE BY DESIGN</div><h2>Your files stay on your device</h2><p>Parsing, aggregation, filtering, and chart generation happen inside your browser. SellerMetric does not require an account and does not send report contents to an application server.</p></div>
              <div className="fp-privacy-card"><div><LockKeyhole /><h3>Local browser processing</h3><p>Close the tab and the analysis is gone. Your seller data is never added to a remote database.</p></div><div className="fp-formats"><span>.CSV</span><span>.XLSX</span><span>.XLS</span><span>.TSV</span></div></div>
            </section>
          </div>
        </div>

        <section className="fp-final-cta">
          <div className="fp-shell"><div className="fp-eyebrow">Free · Private · Instant</div><h2><em>See what your reports</em><span>have been trying to tell you.</span></h2><p>Upload a Flipkart Sales or Return report and open the complete analytics dashboard.</p><button className="fp-primary" onClick={chooseReport}><FileSpreadsheet size={17} /> Analyze My Reports <ArrowRight size={16} /></button></div>
        </section>
      </main>

      <footer className="fp-footer"><div className="fp-shell"><a className="fp-brand" href="/"><img src="/assets/logo-mark.png" alt="" /><span>Seller<b>Metric</b></span></a><span>© 2026 SellerMetric. Built for independent sellers.</span><div><a href="/">Home</a><a href="/blog">Seller Guides</a><a href="/privacy">Privacy</a><a href="/faq">FAQ</a><a href="https://www.instagram.com/oyee.nitishh/" target="_blank" rel="noreferrer">@oyee.nitishh ↗</a></div></div></footer>
    </div>
  );
}
