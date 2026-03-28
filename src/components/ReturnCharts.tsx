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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import type { ReturnMetrics } from '../types';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

interface ReturnChartsProps {
  metrics: ReturnMetrics;
}

function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">{title}</h3>
      {children}
    </div>
  );
}

const COLORS = ['#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#f59e0b', '#f43f5e'];

const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  titleFont: { size: 13, weight: 'bold' as const },
  bodyFont: { size: 12 },
  padding: 12,
  cornerRadius: 8,
  borderColor: 'rgba(100, 116, 139, 0.3)',
  borderWidth: 1,
};

export function ReturnCharts({ metrics }: ReturnChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Return Trends */}
      <ChartCard title="Daily Return Trends" className="lg:col-span-2">
        <div className="relative h-72 w-full">
          <Line
            data={{
              labels: metrics.trendData.labels,
              datasets: [{
                label: 'Returns',
                data: metrics.trendData.values,
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
              plugins: {
                legend: { display: false },
                tooltip: tooltipStyle,
              },
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
              interaction: { intersect: false, mode: 'index' },
            }}
          />
        </div>
      </ChartCard>

      {/* Top Return Reasons */}
      <ChartCard title="Top Return Reasons">
        <div className="relative h-72 w-full flex justify-center">
          <Doughnut
            data={{
              labels: metrics.topReasons.slice(0, 6).map(r => r.reason),
              datasets: [{
                data: metrics.topReasons.slice(0, 6).map(r => r.count),
                backgroundColor: COLORS.slice(0, 6),
                borderWidth: 3,
                borderColor: '#ffffff',
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '60%',
              plugins: {
                legend: {
                  position: 'right',
                  labels: { boxWidth: 12, padding: 10, font: { size: 10 } },
                },
                tooltip: tooltipStyle,
              },
            }}
          />
        </div>
      </ChartCard>

      {/* RTO vs Customer Returns */}
      <ChartCard title="RTO vs Customer Returns">
        <div className="relative h-72 w-full flex justify-center">
          <Doughnut
            data={{
              labels: ['RTO (Courier Returns)', 'Customer Returns'],
              datasets: [{
                data: [metrics.global.rtoCount, metrics.global.customerReturnCount],
                backgroundColor: ['#f59e0b', '#6366f1'],
                borderWidth: 3,
                borderColor: '#ffffff',
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '60%',
              plugins: {
                legend: {
                  position: 'right',
                  labels: { boxWidth: 12, padding: 12, font: { size: 11 } },
                },
                tooltip: tooltipStyle,
              },
            }}
          />
        </div>
      </ChartCard>

      {/* Top 10 Most Returned SKUs */}
      <ChartCard title="Top 10 Most Returned SKUs" className="lg:col-span-2">
        <div className="relative h-80 w-full">
          <Bar
            data={{
              labels: metrics.topSkus.slice(0, 10).map(s => s.sku),
              datasets: [{
                label: 'Return Count',
                data: metrics.topSkus.slice(0, 10).map(s => s.returns),
                backgroundColor: 'rgba(99, 102, 241, 0.75)',
                borderRadius: 6,
                borderSkipped: false,
              }],
            }}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  beginAtZero: true,
                  grid: { color: 'rgba(0,0,0,0.04)' },
                  ticks: { font: { size: 11 } },
                },
                y: {
                  grid: { display: false },
                  ticks: { font: { size: 10 } },
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: tooltipStyle,
              },
            }}
          />
        </div>
      </ChartCard>
    </div>
  );
}
