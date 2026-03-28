import { useCallback, useState, useRef } from 'react';
import {
  Upload, FileSpreadsheet, Sparkles, FileText, Sheet, Table2,
  ShieldCheck, Zap, BarChart3, TrendingDown, Target, Clock,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, ArrowRight,
  Eye, Lock, Star, Users, AlertTriangle, Layers, RotateCcw
} from 'lucide-react';
import { isFileSupported, getAcceptString } from '../fileParser';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-primary-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50/80 transition-colors"
      >
        <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
          {a}
        </div>
      )}
    </div>
  );
}

export function UploadSection({ onFileSelect }: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const heroBtnInputRef = useRef<HTMLInputElement>(null);
  const bottomBtnInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setDragError(null);
    if (isFileSupported(file)) {
      onFileSelect(file);
    } else {
      setDragError('Unsupported format. Please use CSV, XLSX, XLS, or TSV files.');
      setTimeout(() => setDragError(null), 4000);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const formats = [
    { ext: '.CSV', icon: <FileText className="w-4 h-4" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { ext: '.XLSX', icon: <Sheet className="w-4 h-4" />, color: 'text-primary-600 bg-primary-50 border-primary-200' },
    { ext: '.XLS', icon: <Table2 className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { ext: '.TSV', icon: <FileText className="w-4 h-4" />, color: 'text-slate-600 bg-slate-50 border-slate-200' },
  ];

  return (
    <div className="min-h-screen gradient-mesh">

      {/* =================== HERO SECTION =================== */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 pt-12 pb-6">
          {/* Topbar with trust badge */}
          <div className="flex items-center justify-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Free • No Signup • Data Never Leaves Your Browser
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-200 mb-6">
              <FileSpreadsheet className="w-10 h-10 text-white" />
            </div>

            {/* SEO H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.1]">
              Flipkart Seller <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Report Analyzer</span>
            </h1>

            {/* Hero subheadline */}
            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-4 leading-relaxed">
              Upload your Flipkart sales or return report. We auto-detect the type and generate instant SKU-level performance, return & cancellation analysis, revenue trends, and board-level financial dashboards — in seconds.
            </p>

            {/* Auto-detect badge */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-100 text-sm">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-slate-600 font-medium">
                  Auto-detects <strong className="text-primary-700">Sales</strong> &amp; <strong className="text-amber-700">Return</strong> reports automatically
                </span>
              </div>
            </div>

            {/* Social proof line */}
            <div className="flex items-center justify-center gap-4 mb-8 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </span>
              <span>Trusted by <strong className="text-slate-600">Flipkart sellers</strong> across India</span>
            </div>

            {/* Primary CTA — Direct file upload with auto-detection */}
            <button
              onClick={() => heroBtnInputRef.current?.click()}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 transition-all duration-300 hover:-translate-y-1 group"
            >
              <Upload className="w-5 h-5" />
              Analyze My Report — Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <input
              ref={heroBtnInputRef}
              type="file"
              accept={getAcceptString()}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />

            <p className="text-xs text-slate-400 mt-3">No signup • No email • Instant results</p>

            {/* Report type indicators */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50/80 border border-primary-100 text-xs font-medium text-primary-700">
                <BarChart3 className="w-3.5 h-3.5" />
                Sales Report
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-100 text-xs font-medium text-amber-700">
                <RotateCcw className="w-3.5 h-3.5" />
                Return Report
              </div>
              <span className="text-xs text-slate-400">— both auto-detected</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================== PAIN POINTS =================== */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-3">
            Stop Wasting Hours on Manual Excel Analysis
          </h2>
          <p className="text-center text-slate-500 mb-10 max-w-xl mx-auto">
            Every Flipkart seller faces these problems. We solve all of them in one upload.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Clock className="w-5 h-5" />, title: 'Hours Wasted on Reports', desc: 'Manually filtering, pivoting, and calculating metrics from raw Flipkart CSV exports takes 2-4 hours per report.', color: 'rose' },
              { icon: <TrendingDown className="w-5 h-5" />, title: 'Hidden Revenue Leakage', desc: 'Returns and cancellations silently eat into your revenue. Without proper analysis, you can\'t identify the worst-performing SKUs.', color: 'amber' },
              { icon: <Target className="w-5 h-5" />, title: 'No SKU-Level Clarity', desc: 'Which SKUs drive 80% of revenue? Which ones have 40% return rates? Without this data, you\'re flying blind.', color: 'primary' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'High Return Rates', desc: 'Average Flipkart return rate is 15-25%. Identifying and fixing high-return SKUs can save lakhs per month.', color: 'rose' },
              { icon: <Layers className="w-5 h-5" />, title: 'Revenue Concentration Risk', desc: 'If 80% of revenue comes from 3 SKUs, one listing suspension can destroy your business. Know your risk.', color: 'amber' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'No Visual Trends', desc: 'Raw numbers don\'t show the story. Daily trends, category breakdowns, and leakage charts reveal what tables can\'t.', color: 'primary' },
            ].map((p, i) => {
              const colorMap: Record<string, string> = {
                rose: 'bg-rose-50 border-rose-100 text-rose-600',
                amber: 'bg-amber-50 border-amber-100 text-amber-600',
                primary: 'bg-primary-50 border-primary-100 text-primary-600',
              };
              const iconBg: Record<string, string> = {
                rose: 'bg-rose-100',
                amber: 'bg-amber-100',
                primary: 'bg-primary-100',
              };
              return (
                <div key={i} className={`p-5 rounded-2xl border ${colorMap[p.color]} animate-fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`w-10 h-10 rounded-xl ${iconBg[p.color]} flex items-center justify-center mb-3`}>
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm">{p.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================== UPLOAD CARD (Unified Upload — Auto-Detection) =================== */}
      <section className="py-8 px-4" id="upload-area">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Upload Your Report</h2>
          <p className="text-center text-slate-500 text-sm mb-6">
            Drag & drop any Flipkart report — we'll auto-detect whether it's a <strong className="text-primary-600">Sales</strong> or <strong className="text-amber-600">Return</strong> report and show the right dashboard.
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center
              transition-all duration-300 ease-out cursor-pointer group
              ${isDragOver
                ? 'border-primary-400 bg-primary-50 scale-[1.02] shadow-xl shadow-primary-100'
                : 'border-slate-200 bg-white/80 backdrop-blur-sm hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-lg'
              }
            `}
            onClick={() => inputRef.current?.click()}
          >
            <div className={`
              mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300
              ${isDragOver
                ? 'bg-primary-100 scale-110'
                : 'bg-slate-100 group-hover:bg-primary-100 group-hover:scale-105'
              }
            `}>
              <Upload className={`w-8 h-8 transition-colors duration-300 ${isDragOver ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Drop your Flipkart report here
            </h3>
            <p className="text-slate-500 mb-4">Sales report or Return report — we'll auto-detect it</p>

            {/* Auto-detect visual indicator */}
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary-600">
                <BarChart3 className="w-3.5 h-3.5" />
                Sales
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                <RotateCcw className="w-3.5 h-3.5" />
                Returns
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Detect
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-300 transition-all duration-300 hover:-translate-y-0.5">
              <FileSpreadsheet className="w-4 h-4" />
              Select Report File
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={getAcceptString()}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />

            {/* Supported formats badges */}
            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
              {formats.map((f) => (
                <span
                  key={f.ext}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${f.color}`}
                >
                  {f.icon}
                  {f.ext}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upload any Flipkart report — we auto-detect and generate exact analytics instantly</span>
            </div>
          </div>

          {/* Error Toast */}
          {dragError && (
            <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-fade-in-up">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {dragError}
            </div>
          )}

          {/* Trust micro-copy */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> 100% Private</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> No Data Stored</span>
          </div>
        </div>
      </section>

      {/* =================== WHAT YOU GET (Features) =================== */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-3">
            What Your Dashboard Includes
          </h2>
          <p className="text-center text-slate-500 mb-10 max-w-lg mx-auto text-sm">
            Every metric Flipkart sellers need — calculated automatically from your raw report.
          </p>

          {/* Sales features */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-100 text-xs font-semibold text-primary-700 mb-4">
              <BarChart3 className="w-3.5 h-3.5" />
              Sales Report Features
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <BarChart3 className="w-5 h-5 text-primary-600" />, label: 'Executive Summary', desc: 'GMV, units, returns, cancellations, net realization — all KPIs at a glance' },
              { icon: <Target className="w-5 h-5 text-emerald-600" />, label: 'SKU-Level Analysis', desc: 'Per-product revenue, return %, cancel %, and contribution to total revenue' },
              { icon: <Layers className="w-5 h-5 text-amber-600" />, label: 'Category Breakdown', desc: 'Category-wise performance with return rates and revenue contribution' },
              { icon: <TrendingDown className="w-5 h-5 text-rose-600" />, label: 'Revenue Leakage', desc: 'Visualize how much revenue is lost to returns vs cancellations' },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:shadow-md hover:border-primary-100 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <div className="text-sm font-bold text-slate-800 mb-1">{f.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Return features */}
          <div className="mb-4 mt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 mb-4">
              <RotateCcw className="w-3.5 h-3.5" />
              Return Report Features
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <RotateCcw className="w-5 h-5 text-amber-600" />, label: 'RTO vs Customer Returns', desc: 'Split analysis of courier returns (RTO) vs customer-initiated returns' },
              { icon: <AlertTriangle className="w-5 h-5 text-orange-600" />, label: 'Refund Leakage', desc: 'Total refund amount lost, average loss per return, and SKU-level breakdown' },
              { icon: <Target className="w-5 h-5 text-rose-600" />, label: 'Return Reasons', desc: 'Top return reasons with percentage distribution and actionable insights' },
              { icon: <Sparkles className="w-5 h-5 text-violet-600" />, label: 'AI Insights', desc: 'Automated anomaly detection — flags high RTO, critical leakage, and problem SKUs' },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:shadow-md hover:border-amber-100 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${(i + 4) * 0.08}s` }}>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <div className="text-sm font-bold text-slate-800 mb-1">{f.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Common features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {[
              { icon: <Clock className="w-5 h-5 text-indigo-600" />, label: 'Daily Trend Analysis', desc: 'Day-by-day revenue, orders, and peak/low day identification' },
              { icon: <Sparkles className="w-5 h-5 text-violet-600" />, label: 'Interactive Charts', desc: 'Pie, donut, line, and bar charts with tooltips and responsive design' },
              { icon: <AlertTriangle className="w-5 h-5 text-orange-600" />, label: 'Flagged SKUs', desc: 'Auto-flags SKUs with return/cancel rates above your portfolio average' },
              { icon: <Users className="w-5 h-5 text-teal-600" />, label: 'Revenue Concentration', desc: 'Pareto analysis showing if you\'re over-dependent on few SKUs' },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:shadow-md hover:border-primary-100 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${(i + 8) * 0.08}s` }}>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <div className="text-sm font-bold text-slate-800 mb-1">{f.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== COMPARISON TABLE =================== */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-3">
            This Tool vs Manual Excel Analysis
          </h2>
          <p className="text-center text-slate-500 mb-8 text-sm">
            Why smart Flipkart sellers use automated report analysis instead of spreadsheets.
          </p>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">
                    <span className="text-primary-600">This Tool</span>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-400 text-xs uppercase tracking-wider">Manual Excel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ['Time to analyze', 'Under 5 seconds', '2-4 hours'],
                  ['Auto-detect report type', true, false],
                  ['SKU-level return rate', true, 'Manual formulas'],
                  ['Revenue leakage chart', true, false],
                  ['Category-wise breakdown', true, 'Manual pivot tables'],
                  ['Daily trend charts', true, 'Manual chart creation'],
                  ['RTO vs Customer Return split', true, false],
                  ['Auto-flag problem SKUs', true, false],
                  ['Board-level dashboard', true, false],
                  ['XLSX + CSV support', true, 'CSV only (usually)'],
                  ['Data privacy', '100% browser-based', 'Local file'],
                  ['Cost', 'Free', 'Free (but costs time)'],
                ].map(([feature, tool, manual], i) => (
                  <tr key={i} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-3 text-slate-700 font-medium">{feature as string}</td>
                    <td className="px-6 py-3 text-center">
                      {tool === true ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-primary-700 font-semibold text-xs">{tool as string}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {manual === false ? (
                        <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-slate-400 text-xs">{manual as string}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =================== HOW IT WORKS =================== */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-3">
            How to Analyze Your Flipkart Report
          </h2>
          <p className="text-center text-slate-500 mb-10 text-sm">Three steps. Under 10 seconds. Zero learning curve.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Download Report from Flipkart',
                desc: 'Go to Flipkart Seller Hub → Reports → Sales or Returns Report → Download CSV or XLSX.',
                color: 'from-primary-500 to-primary-600',
              },
              {
                step: '2',
                title: 'Upload — We Auto-Detect',
                desc: 'Upload any report file. We automatically detect whether it\'s a Sales or Return report from the column headers.',
                color: 'from-emerald-500 to-emerald-600',
              },
              {
                step: '3',
                title: 'Get Instant Dashboard',
                desc: 'SKU analysis, charts, revenue leakage, flagged products, daily trends — all calculated instantly with the right dashboard.',
                color: 'from-amber-500 to-amber-600',
              },
            ].map((s, i) => (
              <div key={i} className="relative text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white font-extrabold text-xl shadow-lg mb-4`}>
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-7 -right-3 text-slate-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== FAQ SECTION =================== */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-slate-500 mb-8 text-sm">Everything Flipkart sellers ask before using this tool.</p>
          <div className="space-y-3">
            <FAQItem
              q="How does auto-detection work?"
              a="When you upload a file, the tool reads the column headers and compares them against known Flipkart report signatures. Sales reports have columns like 'GMV', 'Gross Units', 'Final Sale Amount'. Return reports have columns like 'Return Reason', 'Return Type', 'Return Status'. Based on these headers, the correct dashboard is shown automatically — no manual selection needed."
            />
            <FAQItem
              q="How do I download my Flipkart seller report?"
              a="Log in to Flipkart Seller Hub → Go to Reports → Select 'Sales Report' or 'Returns Report' → Choose the date range → Click 'Download'. You'll get a CSV or XLSX file that you can directly upload to this tool."
            />
            <FAQItem
              q="Can I analyze both sales and return reports?"
              a="Yes! Just upload any report and the tool auto-detects the type. If you upload a sales report, you get the Sales Analysis dashboard. If you upload a return report, you get the Return Analysis dashboard. You can also upload the other report from within the dashboard to see both analyses side by side."
            />
            <FAQItem
              q="Is this Flipkart report analyzer free to use?"
              a="Yes, 100% free. No signup, no email required. Upload your file and get instant analytics. Your data is processed entirely in your browser — nothing is sent to any server."
            />
            <FAQItem
              q="What file formats are supported?"
              a="We support CSV, XLSX (modern Excel), XLS (legacy Excel), and TSV (tab-separated) files. These are the standard formats exported by Flipkart Seller Hub."
            />
            <FAQItem
              q="Is my Flipkart sales data safe and private?"
              a="Absolutely. All processing happens 100% in your browser using JavaScript. Your file is never uploaded to any server. No data is stored, tracked, or shared with anyone. Close the tab and everything is gone."
            />
            <FAQItem
              q="What metrics does the Sales dashboard analyze?"
              a="Gross Units, GMV, Cancellation Units & Amount, Return Units & Amount, Final Sale Units & Amount, Return Rate %, Cancellation Rate %, Net Realization %, Revenue Contribution %, Revenue Concentration (Pareto analysis), Daily Trends, and per-SKU performance breakdowns."
            />
            <FAQItem
              q="What does the Return Analysis dashboard include?"
              a="Total return volume, refund leakage amount, RTO vs customer return split, return reason breakdown, daily return trends, per-SKU return analysis with drill-down, and automated AI-powered insights that flag anomalies."
            />
            <FAQItem
              q="Can I use this for multiple Flipkart seller accounts?"
              a="Yes. Agencies and sellers managing multiple accounts can upload reports one at a time. Each upload generates a fresh independent dashboard. Use the 'Upload New' button to analyze another account's data."
            />
            <FAQItem
              q="What CSV headers / columns does this tool expect?"
              a="For Sales Reports: SKU ID, Category, Order Date, Gross Units, GMV, Cancellation Units, Cancellation Amount, Return Units, Return Amount, Final Sale Units, Final Sale Amount. For Return Reports: SKU, Product, Total Price, Quantity, Return Type, Return Reason, Return Sub-reason, Return Status, Return Requested Date."
            />
            <FAQItem
              q="Does this work on mobile?"
              a="Yes, the dashboard is fully responsive. However, for the best experience with large data tables and charts, we recommend using a laptop or desktop browser."
            />
          </div>
        </div>
      </section>

      {/* =================== BOTTOM CTA =================== */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-10 shadow-xl shadow-primary-200 text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Analyze Your Report?</h2>
            <p className="text-primary-100 mb-4 text-sm">
              Upload any Flipkart report — sales or returns — and get your complete performance dashboard in under 5 seconds. We auto-detect the type.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-medium text-primary-100 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Auto-detects Sales & Return reports
            </div>
            <br />
            <button
              onClick={() => bottomBtnInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-colors duration-200 shadow-lg group"
            >
              <Upload className="w-5 h-5" />
              Upload Report Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <input
              ref={bottomBtnInputRef}
              type="file"
              accept={getAcceptString()}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
      </section>

      {/* =================== FOOTER =================== */}
      <footer className="py-8 px-4 border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <FileSpreadsheet className="w-4 h-4 text-primary-500" />
            <span className="font-semibold text-slate-700">Flipkart Seller Report Analyzer</span>
          </div>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Free Flipkart seller analytics tool. Upload any report and we auto-detect whether it's a sales or return report. Get SKU-level insights, RTO analysis, revenue trends, and board-level dashboards. Supports CSV, XLSX, XLS & TSV formats.
          </p>
          <p className="text-sm text-slate-400">
            Created by{' '}
            <a
              href="https://www.instagram.com/oyee.nitishh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-600 hover:text-primary-700 underline decoration-primary-300 underline-offset-2 hover:decoration-primary-500 transition-colors duration-200"
            >
              Nitish Kumar
            </a>
          </p>
          <p className="text-xs text-slate-300">
            This tool is not affiliated with Flipkart. Flipkart is a trademark of Flipkart Private Limited.
          </p>
        </div>
      </footer>
    </div>
  );
}
