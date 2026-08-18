import { useState, useMemo, useRef, useCallback } from 'react';
import {
  Package, DollarSign, TrendingDown, AlertCircle,
  Search, X, AlertTriangle, CheckCircle2, Upload,
  FileSpreadsheet, BarChart3, Brain, Sparkles, Lock, Zap, Eye,
  FileText, Sheet, Table2, RotateCcw,
} from 'lucide-react';
import type { ReturnRecord, ReturnSkuData } from '../types';
import { computeReturnMetrics } from '../returnProcessor';
import { KPICard } from './KPICard';
import { SectionHeader } from './SectionHeader';
import { ReturnCharts } from './ReturnCharts';
import { isFileSupported, getAcceptString } from '../fileSupport';

interface ReturnDashboardProps {
  returnData: ReturnRecord[];
  onUploadReturn: (file: File) => void;
  onClearReturn: () => void;
}

function SkuDrawer({ sku, onClose }: { sku: ReturnSkuData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[modalSlideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-start">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-xl font-bold mb-1 break-all text-slate-900">{sku.sku}</h2>
            <p className="text-sm text-slate-500 line-clamp-2">{sku.product}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* SKU Level KPIs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Total Returns</p>
              <p className="text-2xl font-bold text-slate-900">{sku.returns}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
              <p className="text-xs text-rose-600 mb-1">Refund Amount</p>
              <p className="text-2xl font-bold text-rose-700">₹{sku.refund.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">RTO Contribution</p>
              <p className="text-lg font-bold text-slate-900">
                {sku.returns > 0 ? ((sku.rto / sku.returns) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Avg Loss / Unit</p>
              <p className="text-lg font-bold text-slate-900">
                ₹{sku.returns > 0 ? (sku.refund / sku.returns).toFixed(0) : '0'}
              </p>
            </div>
          </div>

          {/* Reason Breakdown */}
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2 text-slate-800">
              <AlertCircle className="w-4 h-4 text-primary-600" />
              Return Reasons
            </h4>
            <div className="space-y-3">
              {Object.entries(sku.reasons)
                .sort((a, b) => b[1] - a[1])
                .map(([reason, count]) => {
                  const percentage = sku.returns > 0 ? (count / sku.returns) * 100 : 0;
                  return (
                    <div key={reason}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 truncate pr-4">{reason}</span>
                        <span className="font-medium text-slate-800">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Insight */}
          <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
            <h4 className="text-sm font-bold text-primary-900 mb-2">Automated Insight</h4>
            <p className="text-sm text-primary-800">
              {sku.rto > sku.returns / 2
                ? `Over 50% of returns for this SKU are RTO. Review logistics routing for this product category.`
                : `Most returns are customer-initiated. Focus on listing accuracy and product quality — specifically checking for "${
                    Object.keys(sku.reasons).sort((a, b) => sku.reasons[b] - sku.reasons[a])[0] || 'quality issues'
                  }".`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReturnDashboard({ returnData, onUploadReturn, onClearReturn }: ReturnDashboardProps) {
  const [filters, setFilters] = useState({ search: '', returnType: 'All' });
  const [selectedSku, setSelectedSku] = useState<ReturnSkuData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const metrics = useMemo(() => computeReturnMetrics(returnData, filters), [returnData, filters]);

  const hasData = returnData.length > 0;

  const handleFile = useCallback((file: File) => {
    setDragError(null);
    if (isFileSupported(file)) {
      onUploadReturn(file);
    } else {
      setDragError('Unsupported format. Please use CSV, XLSX, XLS, or TSV files.');
      setTimeout(() => setDragError(null), 4000);
    }
  }, [onUploadReturn]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const formats = [
    { ext: '.CSV', icon: <FileText className="w-3.5 h-3.5" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { ext: '.XLSX', icon: <Sheet className="w-3.5 h-3.5" />, color: 'text-primary-600 bg-primary-50 border-primary-200' },
    { ext: '.XLS', icon: <Table2 className="w-3.5 h-3.5" />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { ext: '.TSV', icon: <FileText className="w-3.5 h-3.5" />, color: 'text-slate-600 bg-slate-50 border-slate-200' },
  ];

  // ========== EMPTY STATE: Upload Prompt ==========
  if (!hasData) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center max-w-2xl mx-auto py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200 mb-5">
            <RotateCcw className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Flipkart Return Report</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Upload your Flipkart returns CSV/Excel to analyze return reasons, RTO rates, refund leakage, and identify problem SKUs.
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`
            relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center
            transition-all duration-300 ease-out cursor-pointer group max-w-xl mx-auto
            ${isDragOver
              ? 'border-amber-400 bg-amber-50 scale-[1.02] shadow-xl shadow-amber-100'
              : 'border-slate-200 bg-white/80 backdrop-blur-sm hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-lg'
            }
          `}
        >
          <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
            isDragOver ? 'bg-amber-100 scale-110' : 'bg-slate-100 group-hover:bg-amber-100 group-hover:scale-105'
          }`}>
            <Upload className={`w-7 h-7 transition-colors ${isDragOver ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-500'}`} />
          </div>

          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Drop your Flipkart Return Report here
          </h3>
          <p className="text-slate-500 mb-5 text-sm">or click to browse from your computer</p>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 transition-all duration-300 hover:-translate-y-0.5">
            <FileSpreadsheet className="w-4 h-4" />
            Select Return Report
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={getAcceptString()}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />

          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
            {formats.map((f) => (
              <span key={f.ext} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${f.color}`}>
                {f.icon} {f.ext}
              </span>
            ))}
          </div>
        </div>

        {dragError && (
          <div className="max-w-xl mx-auto flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-fade-in-up">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {dragError}
          </div>
        )}

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> 100% Private</span>
          <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
          <span className="inline-flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> No Data Stored</span>
        </div>

        {/* Column format hint */}
        <div className="max-w-xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-primary-500" />
            Expected Column Headers
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your Flipkart return report should contain columns like: <strong>SKU</strong>, <strong>Product</strong>, <strong>Total Price</strong>, <strong>Quantity</strong>, <strong>Return Requested Date</strong>, <strong>Return Type</strong>, <strong>Return Reason</strong>, <strong>Return Sub-reason</strong>, <strong>Return Status</strong>. These are the default headers in Flipkart Seller Hub return exports.
          </p>
        </div>
      </div>
    );
  }

  // ========== DATA LOADED: Full Dashboard ==========
  return (
    <div className="space-y-10 animate-fade-in-up">

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-200">
            <RotateCcw className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Return Analysis Dashboard</h2>
            <p className="text-xs text-slate-400">{returnData.length.toLocaleString()} return records loaded</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload New</span>
            <input
              type="file"
              accept={getAcceptString()}
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
            />
          </label>
          <button
            onClick={onClearReturn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search SKU or Product..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-shadow text-sm"
            />
          </div>
          <select
            value={filters.returnType}
            onChange={(e) => setFilters(prev => ({ ...prev, returnType: e.target.value }))}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
          >
            <option value="All">All Return Types</option>
            <option value="Customer Return">Customer Returns</option>
            <option value="RTO">RTO (Courier Returns)</option>
          </select>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Analyzing {metrics.global.totalReturns.toLocaleString()} returns
        </div>
      </div>

      {/* KPI Row */}
      <section>
        <SectionHeader number="1" title="Return Overview" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Total Returns"
            value={metrics.global.totalReturns.toLocaleString()}
            icon={<Package className="w-4 h-4" />}
            color="indigo"
            delay={0}
          />
          <KPICard
            label="Refund Leakage"
            value={`₹${metrics.global.totalRefund.toLocaleString()}`}
            icon={<DollarSign className="w-4 h-4" />}
            color="rose"
            delay={100}
          />
          <KPICard
            label="RTO Rate"
            value={`${metrics.global.rtoRate.toFixed(1)}%`}
            icon={<TrendingDown className="w-4 h-4" />}
            color="amber"
            delay={200}
          />
          <KPICard
            label="Top Return Reason"
            value={metrics.global.topReason.length > 22 ? metrics.global.topReason.slice(0, 20) + '…' : metrics.global.topReason}
            icon={<AlertCircle className="w-4 h-4" />}
            color="slate"
            delay={300}
          />
        </div>

        {/* Extra KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-4 p-5 bg-primary-50 rounded-2xl border border-primary-100">
            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Customer Returns</div>
              <div className="text-lg font-bold text-slate-800">{metrics.global.customerReturnCount.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{metrics.global.customerReturnRate.toFixed(1)}% of all returns</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">RTO (Courier Returns)</div>
              <div className="text-lg font-bold text-slate-800">{metrics.global.rtoCount.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{metrics.global.rtoRate.toFixed(1)}% of all returns</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Avg Refund / Return</div>
              <div className="text-lg font-bold text-slate-800">₹{metrics.global.avgRefund.toFixed(0)}</div>
              <div className="text-xs text-slate-500">Per return record</div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights */}
      {metrics.insights.length > 0 && (
        <section>
          <SectionHeader title="Automated Insights" icon={<Brain className="w-4 h-4" />} />
          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 p-6 rounded-2xl border border-primary-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                Automated Insights
              </span>
              <Sparkles className="w-4 h-4 text-primary-500" />
            </div>
            <div className="space-y-3">
              {metrics.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/70 p-4 rounded-xl border border-white">
                  {insight.type === 'danger' && <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />}
                  {insight.type === 'warning' && <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />}
                  {insight.type === 'info' && <CheckCircle2 className="text-primary-500 shrink-0 mt-0.5" size={18} />}
                  <p className="text-slate-700 font-medium text-sm leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Charts */}
      <section>
        <SectionHeader title="Return Data Visualization" icon={<BarChart3 className="w-4 h-4" />} />
        <ReturnCharts metrics={metrics} />
      </section>

      {/* SKU Level Analysis */}
      <section>
        <SectionHeader number="2" title="SKU Return Performance" />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="max-h-[500px] overflow-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50/95 backdrop-blur-sm">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">SKU / Product</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">Returns</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">Refund Leakage</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">RTO Vol.</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">RTO %</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {metrics.topSkus.map((sku) => (
                  <tr key={sku.sku} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary-600 text-sm truncate max-w-[200px]" title={sku.sku}>{sku.sku}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]" title={sku.product}>{sku.product}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-slate-800">{sku.returns}</td>
                    <td className="px-4 py-3 text-right font-mono text-rose-600 font-medium">₹{sku.refund.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-600">{sku.rto}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600">
                      {sku.returns > 0 ? ((sku.rto / sku.returns) * 100).toFixed(1) : '0.0'}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedSku(sku)}
                        className="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Return Reasons Breakdown */}
      <section>
        <SectionHeader number="3" title="Return Reasons Breakdown" />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="max-h-[400px] overflow-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50/95 backdrop-blur-sm">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Reason</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">Count</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">Share</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider w-1/3">Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {metrics.topReasons.map(({ reason, count }) => {
                  const pct = metrics.global.totalReturns > 0 ? (count / metrics.global.totalReturns) * 100 : 0;
                  return (
                    <tr key={reason} className="hover:bg-primary-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-[250px]">
                        <span className="truncate block" title={reason}>{reason}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-700">{count}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-primary-700">{pct.toFixed(1)}%</td>
                      <td className="px-4 py-3">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SKU Drawer */}
      {selectedSku && (
        <SkuDrawer sku={selectedSku} onClose={() => setSelectedSku(null)} />
      )}
    </div>
  );
}
