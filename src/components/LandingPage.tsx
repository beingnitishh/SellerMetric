import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../landing.css';

// Use the existing file parser helper if available, otherwise default
const acceptString = ".csv,.xlsx,.xls";

interface LandingPageProps {
  onFileSelect: (file: File) => void;
}

export function LandingPage({ onFileSelect }: LandingPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const vals = entry.target.querySelectorAll('.stat-val');
            vals.forEach((val) => {
              const target = parseFloat(val.getAttribute('data-val') || '0');
              let start = performance.now();
              const duration = 1800;
              const update = (time: number) => {
                let progress = (time - start) / duration;
                if (progress > 1) progress = 1;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentVal = target * easeOut;
                val.innerHTML = Number.isInteger(target)
                  ? Math.floor(currentVal).toString()
                  : currentVal.toFixed(1);
                if (progress < 1) {
                  requestAnimationFrame(update);
                } else {
                  val.innerHTML = target + (target > 10 ? '+' : '');
                }
              };
              requestAnimationFrame(update);
            });
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) statObserver.observe(statsSection);

    return () => statObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const toggleFaq = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget.parentElement;
    if (!item) return;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const newFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => {
      const merged = [...prev];
      newFiles.forEach((file) => {
        if (!merged.find((f) => f.name === file.name)) merged.push(file);
      });
      return merged;
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => {
        const merged = [...prev];
        newFiles.forEach((file) => {
          if (!merged.find((f) => f.name === file.name)) merged.push(file);
        });
        return merged;
      });
    }
  };

  const handleAnalyze = () => {
    if (selectedFiles.length > 0) {
      // Trigger the real React app analysis
      onFileSelect(selectedFiles[0]);
    }
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container flex items-center justify-between" style={{ height: '100%' }}>
          <div className="logo">
            <img src="/sm.png" alt="SellerMetrics Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            SellerMetrics{' '}
            <span className="muted-text" style={{ fontSize: '12px', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
              Flipkart Analytics, Free.
            </span>
          </div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#faq">FAQ</a>
            <a href="#">Changelog</a>
          </nav>
          <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
            Open Tool &rarr;
          </button>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
        <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
        <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
        <button
          className="btn-outline"
          style={{ display: 'inline-block', marginTop: '16px' }}
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsModalOpen(true);
          }}
        >
          Open Tool &rarr;
        </button>
      </div>

      <section className="hero reveal">
        <div className="hero-bg"></div>
        <div className="hero-glow"></div>
        <div className="container hero-grid grid">
          <div className="hero-text reveal reveal-delay-1">
            <div className="eyebrow">Free Tool For Flipkart Sellers</div>
            <h1>
              Turn Your Flipkart <i>Reports Into Decisions.</i>
            </h1>
            <p className="hero-sub">
              Upload your Flipkart seller reports. Get instant analysis of sales trends, return rates, product performance,
              and keyword rankings. No spreadsheet skills required.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                Analyze My Reports &rarr;
              </button>
              <a href="#how-it-works" className="btn-ghost">
                See How It Works
              </a>
            </div>
            <div className="trust-bar">✦ Free Forever &nbsp;&nbsp;✦ No Login Required &nbsp;&nbsp;✦ Instant CSV Analysis</div>
          </div>
          <div className="hero-mockup reveal reveal-delay-2">
            <div className="mockup-card">
              <div className="mockup-card-glow"></div>
              <div className="mockup-label">SELLER DASHBOARD</div>
              <div className="mockup-value">Total Revenue ₹4,82,310</div>
              <div className="mockup-badge">&uarr; 12.4% vs last week</div>
              <div style={{ height: '48px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px', position: 'relative' }}>
                <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 }}>
                  <path d="M0 40 L40 30 L80 35 L120 15 L160 20 L200 5 L250 10 L300 0" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
                </svg>
              </div>
              <div className="mockup-table">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar reveal reveal-delay-1">
        <div className="container stats-grid grid">
          <div>
            <div className="stat-val" data-val="10000">0</div>
            <div className="stat-label">Reports Analyzed</div>
          </div>
          <div>
            <div className="stat-val" data-val="500">0</div>
            <div className="stat-label">Cr+ Revenue Tracked</div>
          </div>
          <div>
            <div className="stat-val" data-val="50">0</div>
            <div className="stat-label">Product Categories</div>
          </div>
          <div>
            <div className="stat-val" data-val="4.9">0</div>
            <div className="stat-label">Seller Satisfaction</div>
          </div>
        </div>
      </section>

      <section id="features" className="features container">
        <h2 className="section-title reveal">What Your Dashboard Includes</h2>
        <p className="section-sub reveal reveal-delay-1">
          Every metric Flipkart sellers need. Calculated automatically from your raw report.
        </p>

        <div className="feature-pill reveal reveal-delay-1">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6M12 4L8 8M12 4l4 4" />
          </svg>
          Sales Report Features
        </div>
        <div className="feature-grid grid reveal reveal-delay-2">
          <div className="feature-card gold-box">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3>Executive Summary</h3>
            <p>GMV, units, returns, cancellations, net realization — all KPIs at a glance.</p>
          </div>
          <div className="feature-card gold-box">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h16M4 14h16M4 18h16M4 6h16" />
              </svg>
            </div>
            <h3>SKU-Level Analysis</h3>
            <p>Per-product revenue, return %, cancel %, and contribution to total revenue.</p>
          </div>
          <div className="feature-card gold-box">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3>Category Breakdown</h3>
            <p>Category-wise performance with return rates and revenue contribution.</p>
          </div>
          <div className="feature-card gold-box">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3>Revenue Leakage</h3>
            <p>Visualize how much revenue is lost to returns vs cancellations.</p>
          </div>
        </div>

        <div className="feature-pill muted reveal reveal-delay-2">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Return Report Features
        </div>
        <div className="feature-grid grid reveal reveal-delay-3" style={{ gridTemplateRows: 'auto auto' }}>
          <div className="feature-card gold-box">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M3 8v5h5" />
              </svg>
            </div>
            <h3>RTO vs Customer Returns</h3>
            <p>Compare failed deliveries against post-delivery customer complaints.</p>
          </div>
          <div className="feature-card gold-box">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Refund Leakage</h3>
            <p>Track cash deducted due to various return and shipping fees.</p>
          </div>
          <div className="feature-card gold-box">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <h3>Return Reasons</h3>
            <p>Breakdown of why customers are returning your products.</p>
          </div>
          <div className="feature-card gold-box" style={{ borderColor: '#C084FC' }}>
            <div className="feature-icon" style={{ color: '#C084FC' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2A10 10 0 0 1 22 12A10 10 0 0 1 12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2zM12 6v6h4" />
              </svg>
            </div>
            <h3 style={{ color: '#F0EDE6' }}>AI Insights</h3>
            <p>Automated text analysis to flag anomalies in return behavior.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works reveal">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Three Steps to Clarity</h2>
          <div className="stepper reveal reveal-delay-2">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Download Your Report</h3>
              <p>Go to Flipkart Seller Hub &rarr; Reports. Download your Sales or Return CSV.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Upload to SellerMetrics</h3>
              <p>Drag and drop the file. No account required. Data never leaves your browser.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Get Instant Insights</h3>
              <p>View interactive charts, tables, and KPIs built from your actual data.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="privacy container reveal">
        <div className="privacy-card gold-box">
          <div className="privacy-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2>Your Data Never Leaves Your Device.</h2>
          <p>
            SellerMetrics runs entirely in your browser. We don't store, upload, or transmit your Flipkart data to any server. Everything is processed locally using JavaScript &mdash; complete privacy, zero risk.
          </p>
        </div>
      </section>

      <section id="faq" className="faq container reveal">
        <h2 className="section-title" style={{ textAlign: 'center' }}>Common Questions</h2>
        <div className="faq-wrapper reveal reveal-delay-1">
          {[
            { q: 'Is this Flipkart report analyzer free to use?', a: '<br/>Yes, 100% free. No signup, no email required.' },
            { q: 'Which reports are supported?', a: '<br/>Standard Sales Reports, Return Reports, and Advertising Reports.' },
            { q: 'Is my data sent to a server?', a: '<br/>No. Everything is processed locally in your browser logic.' },
            { q: 'Do I need an account?', a: '<br/>No account is required. Just open the tool and upload.' },
            { q: 'What file formats are supported?', a: '<br/>We support .csv, .xlsx, and .xls formats natively.' },
            { q: 'Can I analyze multiple files?', a: '<br/>Yes, you can upload multiple reports at once into the modal.' },
            { q: 'Is this app desktop optimized?', a: '<br/>Yes, while responsive, dense tables are best viewed on desktop.' },
            { q: 'Who built this tool?', a: '<br/>Built by Nitish, an independent Flipkart seller. Follow me on <a href="https://www.instagram.com/oyee.nitishh" target="_blank" class="gold-text">Instagram</a>.' }
          ].map((item, idx) => (
            <div className="faq-item" key={idx}>
              <div className="faq-q" onClick={toggleFaq}>
                {item.q}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <div className="faq-a" dangerouslySetInnerHTML={{ __html: item.a }} />
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta reveal">
        <div className="cta-glow"></div>
        <div className="container">
          <h2>Your next smart move starts with data.</h2>
          <p>Free. Private. Instant.</p>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Open the Analyzer &rarr;
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid grid">
            <div>
              <div className="logo footer-logo">
                <img src="/sm.png" alt="SellerMetrics Logo" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />{' '}
                SellerMetrics
              </div>
              <p className="sec-text" style={{ fontSize: '14px' }}>
                Flipkart seller analytics. Free, private, in-browser.
              </p>
            </div>
            <div>
              <div className="footer-head">TOOL</div>
              <div className="footer-links">
                <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>Analyze Reports</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#faq">FAQ</a>
                <a href="#">Changelog</a>
              </div>
            </div>
            <div>
              <div className="footer-head">ABOUT</div>
              <p className="sec-text" style={{ fontSize: '14px', marginBottom: '16px' }}>
                Built by Nitish for Indian Flipkart sellers.
                <br />
                Made with ♥ in India.
                <br />
                Not affiliated with Flipkart Pvt Ltd.
              </p>
              <a href="https://www.instagram.com/oyee.nitishh" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>&copy; 2025 SellerMetrics. Free to use.</div>
            <div>sellermetrics.netlify.app</div>
          </div>
        </div>
      </footer>

      {/* MODAL OVERLAY */}
      <div 
        className={`modal-overlay ${isModalOpen ? 'active' : ''}`} 
        onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
      >
        <div className="modal-box">
          <button className="close-btn" aria-label="Close modal" onClick={() => setIsModalOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="modal-header">
            <span className="eyebrow">Upload Your Report</span>
            <h2 style={{ fontSize: '24px', marginBottom: '8px', fontFamily: 'var(--font-body)'}}>Analyze Your Flipkart CSV</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px'}}>
              Sales, Returns, or Advertising report — drag it in or click to browse.
            </p>
          </div>

          <div
            className={`drop-zone ${isDragOver ? 'dragging' : ''}`}
            onDragEnter={() => setIsDragOver(true)}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              className="file-input"
              ref={fileInputRef}
              accept={acceptString}
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="dz-idle">
              <svg className="dz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
              <div className="dz-text">
                Drop your CSV file here <br />
                <span style={{ fontWeight: 400, fontSize: '14px' }}>
                  or <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--accent-gold)' }}>click to browse</span>
                </span>
              </div>
              <div className="dz-sub">Supports .csv · .xlsx · .xls — Processed entirely in your browser</div>
            </div>
            <div className="dz-active">
              <svg className="dz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <br />
              Release to upload
            </div>
          </div>

          <div className="file-list">
            {selectedFiles.map((file, idx) => (
              <div className="file-pill" key={idx}>
                <div className="file-pill-left">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                  {file.name.substring(0, 25)}{file.name.length > 25 ? '...' : ''}{' '}
                  <span className="muted-text">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <div
                  className="file-del"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
                  }}
                >
                  &times;
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <div className="modal-safe">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Your file never leaves this browser tab.
            </div>
            <button
              className={`btn-analyze ${selectedFiles.length > 0 ? 'active' : ''}`}
              disabled={selectedFiles.length === 0}
              onClick={handleAnalyze}
            >
              Analyze Report &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
