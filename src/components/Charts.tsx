import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';
import type { ProcessedData } from '../types';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#f43f5e',
  '#8b5cf6', '#ec4899', '#64748b', '#14b8a6',
  '#06b6d4', '#84cc16',
];

interface ChartsProps {
  data: ProcessedData;
}

function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">{title}</h3>
      {children}
    </div>
  );
}

export function Charts({ data }: ChartsProps) {
  const catLabels = Object.keys(data.categories);
  const catFinalAmts = catLabels.map(c => data.categories[c].fa);

  const top5SKUs = data.sortedSkuKeys.slice(0, 5);

  const tooltipStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    titleFont: { size: 13, weight: 'bold' as const },
    bodyFont: { size: 12 },
    padding: 12,
    cornerRadius: 8,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    borderWidth: 1,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Revenue Breakdown */}
      <ChartCard title="Final Sale Revenue by Category">
        <div className="relative h-64 w-full">
          <Pie
            data={{
              labels: catLabels,
              datasets: [{
                data: catFinalAmts,
                backgroundColor: COLORS,
                borderWidth: 2,
                borderColor: '#ffffff',
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
                tooltip: tooltipStyle,
              },
            }}
          />
        </div>
      </ChartCard>

      {/* Chart 5: Revenue Leakage */}
      <ChartCard title="Revenue Leakage Analysis">
        <div className="relative h-64 w-full">
          <Doughnut
            data={{
              labels: ['Final Realized Revenue', 'Lost to Returns', 'Lost to Cancellations'],
              datasets: [{
                data: [data.totalFinalAmt, data.totalReturnAmt, data.totalCancelAmt],
                backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
                borderWidth: 3,
                borderColor: '#ffffff',
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '60%',
              plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
                tooltip: tooltipStyle,
              },
            }}
          />
        </div>
      </ChartCard>

      {/* Chart 2: Daily Revenue Trend */}
      <ChartCard title="Daily Revenue Trend" className="lg:col-span-2">
        <div className="relative h-72 w-full">
          <Line
            data={{
              labels: data.sortedDates,
              datasets: [{
                label: 'Final Sale Amount',
                data: data.sortedDates.map(d => data.dates[d].fa),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                borderWidth: 2.5,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(0,0,0,0.04)' },
                  ticks: { font: { size: 11 } },
                },
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 10 }, maxRotation: 45 },
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: tooltipStyle,
              },
              interaction: { intersect: false, mode: 'index' },
            }}
          />
        </div>
      </ChartCard>

      {/* Chart 3: Top 5 SKUs */}
      <ChartCard title="Top 5 SKUs by Revenue">
        <div className="relative h-80 w-full">
          <Bar
            data={{
              labels: top5SKUs,
              datasets: [{
                label: 'Final Sale Amount',
                data: top5SKUs.map(s => data.skus[s].fa),
                backgroundColor: [
                  'rgba(99, 102, 241, 0.8)',
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(244, 63, 94, 0.8)',
                  'rgba(139, 92, 246, 0.8)',
                ],
                borderRadius: 6,
                borderSkipped: false,
              }],
            }}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
                y: { grid: { display: false }, ticks: { font: { size: 10 } } },
              },
              plugins: {
                legend: { display: false },
                tooltip: tooltipStyle,
              },
            }}
          />
        </div>
      </ChartCard>

      {/* Chart 4: Returns vs Cancellations */}
      <ChartCard title="Returns vs Cancellations by Category">
        <div className="relative h-80 w-full">
          <Bar
            data={{
              labels: catLabels,
              datasets: [
                {
                  label: 'Total Returns (Units)',
                  data: catLabels.map(c => data.categories[c].ru),
                  backgroundColor: 'rgba(245, 158, 11, 0.75)',
                  borderRadius: 4,
                  borderSkipped: false,
                },
                {
                  label: 'Total Cancellations (Units)',
                  data: catLabels.map(c => data.categories[c].cu),
                  backgroundColor: 'rgba(244, 63, 94, 0.75)',
                  borderRadius: 4,
                  borderSkipped: false,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
              },
              plugins: {
                legend: { labels: { boxWidth: 12, padding: 16, font: { size: 11 } } },
                tooltip: tooltipStyle,
              },
            }}
          />
        </div>
      </ChartCard>
    </div>
  );
}
