import { useState } from 'react';
import {
  ArrowLeft, Package, DollarSign, TrendingUp, ShoppingCart,
  BarChart3, Layers, CalendarDays, Brain, AlertTriangle, Target,
  Upload, RotateCcw, FileSpreadsheet,
} from 'lucide-react';
import type { ProcessedData, ReturnRecord } from '../types';
import { exactStr, pct } from '../processData';
import { KPICard } from './KPICard';
import { SectionHeader } from './SectionHeader';
import { Charts } from './Charts';
import { UploadModal } from './UploadModal';
import { ReturnDashboard } from './ReturnDashboard';

type TabType = 'sales' | 'returns';

interface DashboardProps {
  data: ProcessedData | null;
  onReset: () => void;
  onFileSelect: (file: File) => void;
  returnData: ReturnRecord[];
  onUploadReturn: (file: File) => void;
  onClearReturn: () => void;
  initialTab?: TabType;
}

function Badge({ children, color }: { children: React.ReactNode; color: 'rose' | 'amber' | 'emerald' }) {
  const colors = {
    rose: 'bg-rose-100 text-rose-700',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

function PctDisplay({ value, color = 'slate' }: { value: number; color?: string }) {
  const colorClass = {
    slate: 'text-[#F0EDE6]',
    rose: 'text-rose-600',
    amber: 'text-amber-600',
    emerald: 'text-emerald-600',
  }[color] || 'text-[#F0EDE6]';
  return <span className={`font-semibold ${colorClass}`}>{value.toFixed(2)}%</span>;
}

export function Dashboard({ data, onReset, onFileSelect, returnData, onUploadReturn, onClearReturn, initialTab = 'sales' }: DashboardProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const skuEntries = data ? data.sortedSkuKeys.map(sku => ({
    sku,
    ...data.skus[sku],
    retPct: pct(data.skus[sku].ru, data.skus[sku].gu),
    canPct: pct(data.skus[sku].cu, data.skus[sku].gu),
    revContr: pct(data.skus[sku].fa, data.totalFinalAmt),
  })) : [];

  const catEntries = data ? Object.entries(data.categories).map(([cat, c]) => ({
    cat,
    ...c,
    retPct: pct(c.ru, c.gu),
    canPct: pct(c.cu, c.gu),
    revContr: pct(c.fa, data.totalFinalAmt),
  })) : [];

  const badRetSkus = data ? skuEntries.filter(s => s.retPct > data.globalRetAvg) : [];
  const badCanSkus = data ? skuEntries.filter(s => s.canPct > data.globalCanAvg) : [];

  // Build info string for top bar
  const infoStr = [
    data ? `${data.totalSkuCount} SKUs` : null,
    data ? `${data.sortedDates.length} Days` : null,
    returnData.length > 0 ? `${returnData.length} Returns` : null,
  ].filter(Boolean).join(' • ');

  return (
    <div className="min-h-screen bg-[#0B0F1A] gradient-mesh">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 glass-card border-b border-[#1E2D45]/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-[#D4A847] hover:bg-[#1C2537] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="hidden sm:flex items-center gap-2.5">
            <img src="/sm.png" alt="SellerMetrics Logo" className="w-7 h-7 rounded-md" />
            <h1 className="text-lg font-bold text-[#F0EDE6]">
              Flipkart Seller <span className="text-[#D4A847]">Report Analyzer</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {infoStr && (
              <div className="text-xs text-[#475569] font-medium hidden md:block">
                {infoStr}
              </div>
            )}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#D4A847] to-[#A07A28] text-white shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileSelect={onFileSelect}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#111827] rounded-2xl p-1.5 border border-[#1E2D45] shadow-sm max-w-md">
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'sales'
                ? 'bg-gradient-to-r from-[#D4A847] to-[#A07A28] text-white shadow-md shadow-primary-200'
                : 'text-[#94A3B8] hover:text-[#F0EDE6] hover:bg-[#0B0F1A]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Sales Analysis
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'returns'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200'
                : 'text-[#94A3B8] hover:text-[#F0EDE6] hover:bg-[#0B0F1A]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Return Analysis
            {returnData.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'returns' ? 'bg-[#111827]/25 text-white' : 'bg-amber-100 text-amber-700'
              }`}>
                {returnData.length}
              </span>
            )}
          </button>
        </div>

        {/* ============================================================ */}
        {/* RETURN ANALYSIS TAB */}
        {/* ============================================================ */}
        {activeTab === 'returns' && (
          <ReturnDashboard
            returnData={returnData}
            onUploadReturn={onUploadReturn}
            onClearReturn={onClearReturn}
          />
        )}

        {/* ============================================================ */}
        {/* SALES ANALYSIS TAB */}
        {/* ============================================================ */}
        {activeTab === 'sales' && (
          <>
            {/* If no sales data yet, show upload prompt */}
            {!data ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#111827] rounded-3xl border border-dashed border-[#1E2D45] animate-fade-in-up">
                <div className="w-20 h-20 rounded-2xl bg-[#1C2537] flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-10 h-10 text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-[#F0EDE6] mb-2">No Sales Data Loaded</h2>
                <p className="text-[#94A3B8] mb-6 max-w-md text-center text-sm">
                  Upload your Flipkart sales report (CSV, XLSX, XLS, or TSV) to generate your complete sales performance dashboard.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#D4A847] to-[#A07A28] text-white shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Upload className="w-4 h-4" />
                  Upload Sales Report
                </button>
              </div>
            ) : (
              <>
                {/* Section 1: Executive Summary */}
                <section className="animate-fade-in-up">
                  <SectionHeader number="1" title="Executive Summary" />

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <KPICard
                      label="Total Gross Units"
                      value={exactStr(data.totalGrossUnits)}
                      icon={<Package className="w-4 h-4" />}
                      color="slate"
                      delay={0}
                    />
                    <KPICard
                      label="Total GMV"
                      value={exactStr(data.totalGMV)}
                      icon={<DollarSign className="w-4 h-4" />}
                      color="indigo"
                      delay={100}
                    />
                    <KPICard
                      label="Net Realization"
                      value={`${data.netRealization.toFixed(2)}%`}
                      icon={<TrendingUp className="w-4 h-4" />}
                      color="emerald"
                      delay={200}
                    />
                    <KPICard
                      label="Final Sale Amount"
                      value={exactStr(data.totalFinalAmt)}
                      icon={<ShoppingCart className="w-4 h-4" />}
                      color="amber"
                      delay={300}
                    />
                  </div>

                  {/* Summary Table */}
                  <div className="bg-[#111827] rounded-2xl shadow-sm border border-[#1E2D45] overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead>
                        <tr className="bg-[#0B0F1A]/80">
                          <th className="px-6 py-3.5 text-left font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Metric</th>
                          <th className="px-6 py-3.5 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[
                          ['Total Gross Units', exactStr(data.totalGrossUnits)],
                          ['Total GMV', exactStr(data.totalGMV)],
                          ['Total Cancellation Units', exactStr(data.totalCancelUnits)],
                          ['Total Cancellation Amount', exactStr(data.totalCancelAmt)],
                          ['Total Return Units', exactStr(data.totalReturnUnits)],
                          ['Total Return Amount', exactStr(data.totalReturnAmt)],
                          ['Total Final Sale Units', exactStr(data.totalFinalUnits)],
                          ['Total Final Sale Amount', exactStr(data.totalFinalAmt)],
                        ].map(([metric, val], i) => (
                          <tr key={i} className="hover:bg-[#0B0F1A]/50 transition-colors">
                            <td className="px-6 py-3.5 text-[#F0EDE6]">{metric}</td>
                            <td className="px-6 py-3.5 text-right font-mono text-[#F0EDE6]">{val}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-[#1E2D45]" />
                        <tr className="bg-rose-50/60 hover:bg-rose-50 transition-colors">
                          <td className="px-6 py-3.5 font-semibold text-rose-700 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-400" />Cancellation Rate
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <PctDisplay value={data.cancelRate} color="rose" />
                          </td>
                        </tr>
                        <tr className="bg-amber-50/60 hover:bg-amber-50 transition-colors">
                          <td className="px-6 py-3.5 font-semibold text-amber-700 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />Return Rate
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <PctDisplay value={data.returnRate} color="amber" />
                          </td>
                        </tr>
                        <tr className="bg-emerald-50/60 hover:bg-emerald-50 transition-colors">
                          <td className="px-6 py-3.5 font-semibold text-emerald-700 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />Net Realization
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <PctDisplay value={data.netRealization} color="emerald" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Data Visualization */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <SectionHeader title="Data Visualization" icon={<BarChart3 className="w-4 h-4" />} />
                  <Charts data={data} />
                </section>

                {/* Section 2: SKU-Level Performance */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <SectionHeader number="2" title="SKU-Level Performance" />
                  <div className="bg-[#111827] rounded-2xl shadow-sm border border-[#1E2D45] overflow-hidden">
                    <div className="max-h-[500px] overflow-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-[#0B0F1A]/95 backdrop-blur-sm">
                            <th className="px-4 py-3 text-left font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">SKU ID</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Gross Units</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">GMV</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Return Units (Amt)</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Cancel Units (Amt)</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Final Units</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider border-r border-[#1E2D45]">Final Amount</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Return %</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Cancel %</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Rev %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {skuEntries.map((s, i) => (
                            <tr key={i} className="hover:bg-[#1C2537]/30 transition-colors whitespace-nowrap">
                              <td className="px-4 py-3 font-medium text-[#F0EDE6] max-w-[200px] truncate" title={s.sku}>{s.sku}</td>
                              <td className="px-4 py-3 text-right font-mono text-[#94A3B8]">{exactStr(s.gu)}</td>
                              <td className="px-4 py-3 text-right font-mono text-[#94A3B8]">{exactStr(s.gmv)}</td>
                              <td className="px-4 py-3 text-right font-mono text-amber-600">{exactStr(s.ru)} ({exactStr(s.ra)})</td>
                              <td className="px-4 py-3 text-right font-mono text-rose-600">{exactStr(s.cu)} ({exactStr(s.ca)})</td>
                              <td className="px-4 py-3 text-right font-mono font-semibold text-[#F0EDE6]">{exactStr(s.fu)}</td>
                              <td className="px-4 py-3 text-right font-mono font-semibold text-[#F0EDE6] border-r border-[#1E2D45]">{exactStr(s.fa)}</td>
                              <td className="px-4 py-3 text-right"><PctDisplay value={s.retPct} /></td>
                              <td className="px-4 py-3 text-right"><PctDisplay value={s.canPct} /></td>
                              <td className="px-4 py-3 text-right"><PctDisplay value={s.revContr} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Section 3: Category-Level Performance */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <SectionHeader number="3" title="Category-Level Performance" />
                  <div className="bg-[#111827] rounded-2xl shadow-sm border border-[#1E2D45] overflow-hidden">
                    <div className="max-h-[500px] overflow-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-[#0B0F1A]/95 backdrop-blur-sm">
                            <th className="px-4 py-3 text-left font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Category</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Gross Units</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider border-r border-[#1E2D45]">Revenue (GMV)</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Return Rate</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Cancel Rate</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Rev Contribution</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {catEntries.map((c, i) => (
                            <tr key={i} className="hover:bg-[#1C2537]/30 transition-colors">
                              <td className="px-4 py-3 font-medium text-[#F0EDE6]">{c.cat}</td>
                              <td className="px-4 py-3 text-right font-mono text-[#94A3B8]">{exactStr(c.gu)}</td>
                              <td className="px-4 py-3 text-right font-mono text-[#94A3B8] border-r border-[#1E2D45]">{exactStr(c.gmv)}</td>
                              <td className="px-4 py-3 text-right"><PctDisplay value={c.retPct} /></td>
                              <td className="px-4 py-3 text-right"><PctDisplay value={c.canPct} /></td>
                              <td className="px-4 py-3 text-right"><PctDisplay value={c.revContr} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Section 4: Daily Sales Trend */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                  <SectionHeader number="4" title="Daily Sales Trend Analysis" />

                  {/* Daily Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Highest Revenue Day</div>
                        <div className="text-lg font-bold text-[#F0EDE6]">{data.maxRevDay}</div>
                        <div className="text-xs text-[#94A3B8] font-mono">{exactStr(data.maxRevVal)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-[#1C2537] rounded-2xl border border-[#1E2D45]">
                      <div className="w-11 h-11 rounded-xl bg-[#1E2D45] flex items-center justify-center shrink-0">
                        <CalendarDays className="w-5 h-5 text-[#94A3B8]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Lowest Revenue Day</div>
                        <div className="text-lg font-bold text-[#F0EDE6]">{data.minRevDay}</div>
                        <div className="text-xs text-[#94A3B8] font-mono">{exactStr(data.minRevVal)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Highest Return Day</div>
                        <div className="text-lg font-bold text-[#F0EDE6]">{data.maxRetDay}</div>
                        <div className="text-xs text-[#94A3B8] font-mono">{exactStr(data.maxRetVal)} units</div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Table */}
                  <div className="bg-[#111827] rounded-2xl shadow-sm border border-[#1E2D45] overflow-hidden">
                    <div className="max-h-[500px] overflow-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-[#0B0F1A]/95 backdrop-blur-sm">
                            <th className="px-4 py-3 text-left font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Gross Units</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">GMV</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Return Units</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Cancel Units</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Final Sale Units</th>
                            <th className="px-4 py-3 text-right font-semibold text-[#94A3B8] text-xs uppercase tracking-wider">Final Sale Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {data.sortedDates.map((d, i) => {
                            const dt = data.dates[d];
                            return (
                              <tr key={i} className="hover:bg-[#1C2537]/30 transition-colors">
                                <td className="px-4 py-3 font-medium text-[#F0EDE6]">{d}</td>
                                <td className="px-4 py-3 text-right font-mono text-[#94A3B8]">{exactStr(dt.gu)}</td>
                                <td className="px-4 py-3 text-right font-mono text-[#94A3B8]">{exactStr(dt.gmv)}</td>
                                <td className="px-4 py-3 text-right font-mono text-amber-600">{exactStr(dt.ru)}</td>
                                <td className="px-4 py-3 text-right font-mono text-rose-600">{exactStr(dt.cu)}</td>
                                <td className="px-4 py-3 text-right font-mono font-semibold text-[#F0EDE6]">{exactStr(dt.fu)}</td>
                                <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">{exactStr(dt.fa)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Advanced Analysis */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <SectionHeader title="Advanced Analysis" icon={<Brain className="w-4 h-4" />} />

                  <div className="space-y-6">
                    {/* Revenue Concentration */}
                    <div className="bg-[#111827] rounded-2xl shadow-sm border border-[#1E2D45] p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1E2D45] flex items-center justify-center shrink-0 mt-0.5">
                          <Target className="w-5 h-5 text-[#D4A847]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#F0EDE6] text-lg mb-1">Revenue Concentration</h4>
                          <p className="text-[#94A3B8] text-sm leading-relaxed">
                            <span className="font-bold text-[#A07A28] text-base">{data.top20Pct.toFixed(2)}%</span> of total realized revenue is generated by the Top 20% of SKUs ({data.top20Count} out of {data.totalSkuCount} items).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Flagged SKUs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* High Returns */}
                      <div className="bg-[#111827] rounded-2xl shadow-sm border border-[#1E2D45] overflow-hidden">
                        <div className="px-5 py-4 border-b border-[#1E2D45] flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-amber-800 text-sm">High Return SKUs</h4>
                            <p className="text-xs text-[#475569]">Return % &gt; Overall Average ({data.globalRetAvg.toFixed(2)}%)</p>
                          </div>
                          <Badge color="amber">{badRetSkus.length}</Badge>
                        </div>
                        <div className="max-h-48 overflow-auto">
                          <table className="min-w-full divide-y divide-slate-50 text-xs">
                            <thead className="sticky top-0 bg-[#0B0F1A]/95">
                              <tr>
                                <th className="text-left p-3 font-semibold text-[#94A3B8] uppercase tracking-wider">SKU ID</th>
                                <th className="text-right p-3 font-semibold text-[#94A3B8] uppercase tracking-wider">Return %</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {badRetSkus.length > 0 ? badRetSkus.map((s, i) => (
                                <tr key={i} className="hover:bg-amber-50/50 transition-colors">
                                  <td className="p-3 truncate max-w-[150px]" title={s.sku}>{s.sku}</td>
                                  <td className="p-3 text-right font-mono text-amber-600 font-medium">{s.retPct.toFixed(2)}%</td>
                                </tr>
                              )) : (
                                <tr><td colSpan={2} className="p-4 text-center text-[#475569]">No SKUs above average ({data.globalRetAvg.toFixed(2)}%)</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* High Cancellations */}
                      <div className="bg-[#111827] rounded-2xl shadow-sm border border-[#1E2D45] overflow-hidden">
                        <div className="px-5 py-4 border-b border-[#1E2D45] flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-rose-800 text-sm">High Cancellation SKUs</h4>
                            <p className="text-xs text-[#475569]">Cancel % &gt; Overall Average ({data.globalCanAvg.toFixed(2)}%)</p>
                          </div>
                          <Badge color="rose">{badCanSkus.length}</Badge>
                        </div>
                        <div className="max-h-48 overflow-auto">
                          <table className="min-w-full divide-y divide-slate-50 text-xs">
                            <thead className="sticky top-0 bg-[#0B0F1A]/95">
                              <tr>
                                <th className="text-left p-3 font-semibold text-[#94A3B8] uppercase tracking-wider">SKU ID</th>
                                <th className="text-right p-3 font-semibold text-[#94A3B8] uppercase tracking-wider">Cancel %</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {badCanSkus.length > 0 ? badCanSkus.map((s, i) => (
                                <tr key={i} className="hover:bg-rose-50/50 transition-colors">
                                  <td className="p-3 truncate max-w-[150px]" title={s.sku}>{s.sku}</td>
                                  <td className="p-3 text-right font-mono text-rose-600 font-medium">{s.canPct.toFixed(2)}%</td>
                                </tr>
                              )) : (
                                <tr><td colSpan={2} className="p-4 text-center text-[#475569]">No SKUs above average ({data.globalCanAvg.toFixed(2)}%)</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Dependency */}
                    <div className="bg-[#111827] rounded-2xl shadow-sm border border-[#1E2D45] p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Layers className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#F0EDE6] text-lg mb-1">Revenue Dependency</h4>
                          <p className="text-[#94A3B8] text-sm leading-relaxed">
                            The business depends on its Top 3 SKUs for <span className="font-bold text-[#A07A28] text-base">{data.top3Pct.toFixed(2)}%</span> of total final revenue.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-[#1E2D45]" style={{ background: '#080C14' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
              {/* Brand Column */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img src="/sm.png" alt="SellerMetrics Logo" className="w-6 h-6 rounded" />
                  <span className="text-lg font-bold text-[#F0EDE6]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    SellerMetrics
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Flipkart seller analytics. Free, private, in-browser.
                </p>
              </div>

              {/* Tool Links Column */}
              <div>
                <div className="text-xs font-semibold text-[#475569] uppercase tracking-widest mb-5">Tool</div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-left text-sm text-[#94A3B8] hover:text-[#D4A847] transition-colors duration-200"
                  >
                    Analyze Reports
                  </button>
                  <button
                    onClick={onReset}
                    className="text-left text-sm text-[#94A3B8] hover:text-[#D4A847] transition-colors duration-200"
                  >
                    Back to Home
                  </button>
                </div>
              </div>

              {/* About Column */}
              <div>
                <div className="text-xs font-semibold text-[#475569] uppercase tracking-widest mb-5">About</div>
                <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
                  Built by Nitish for Indian Flipkart sellers.
                  <br />
                  Made with ♥ in India.
                  <br />
                  Not affiliated with Flipkart Pvt Ltd.
                </p>
                <a
                  href="https://www.instagram.com/oyee.nitishh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#D4A847] transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="text-xs font-medium">@oyee.nitishh</span>
                </a>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-5 border-t border-[#1E2D45] flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-xs text-[#475569]">&copy; 2025 SellerMetrics. Free to use.</div>
              <div className="text-xs text-[#475569]">sellermetrics.netlify.app</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
