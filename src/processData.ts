import type { RawRow, Aggregated, ProcessedData } from './types';

export function processData(data: RawRow[]): ProcessedData {
  let totalGrossUnits = 0, totalGMV = 0;
  let totalCancelUnits = 0, totalCancelAmt = 0;
  let totalReturnUnits = 0, totalReturnAmt = 0;
  let totalFinalUnits = 0, totalFinalAmt = 0;

  const skus: Record<string, Aggregated> = {};
  const categories: Record<string, Aggregated> = {};
  const dates: Record<string, Aggregated> = {};

  data.forEach(row => {
    const sku = row['SKU ID'] || 'Unknown';
    const cat = row['Category'] || 'Unknown';
    const date = row['Order Date'] || 'Unknown';

    const gu = parseFloat(row['Gross Units']) || 0;
    const gmv = parseFloat(row['GMV']) || 0;
    const cu = parseFloat(row['Cancellation Units']) || 0;
    const ca = parseFloat(row['Cancellation Amount']) || 0;
    const ru = parseFloat(row['Return Units']) || 0;
    const ra = parseFloat(row['Return Amount']) || 0;
    const fu = parseFloat(row['Final Sale Units']) || 0;
    const fa = parseFloat(row['Final Sale Amount']) || 0;

    totalGrossUnits += gu; totalGMV += gmv;
    totalCancelUnits += cu; totalCancelAmt += ca;
    totalReturnUnits += ru; totalReturnAmt += ra;
    totalFinalUnits += fu; totalFinalAmt += fa;

    if (!skus[sku]) skus[sku] = { gu:0, gmv:0, cu:0, ca:0, ru:0, ra:0, fu:0, fa:0 };
    skus[sku].gu += gu; skus[sku].gmv += gmv;
    skus[sku].cu += cu; skus[sku].ca += ca;
    skus[sku].ru += ru; skus[sku].ra += ra;
    skus[sku].fu += fu; skus[sku].fa += fa;

    if (!categories[cat]) categories[cat] = { gu:0, gmv:0, cu:0, ca:0, ru:0, ra:0, fu:0, fa:0 };
    categories[cat].gu += gu; categories[cat].gmv += gmv;
    categories[cat].cu += cu; categories[cat].ca += ca;
    categories[cat].ru += ru; categories[cat].ra += ra;
    categories[cat].fu += fu; categories[cat].fa += fa;

    if (!dates[date]) dates[date] = { gu:0, gmv:0, cu:0, ca:0, ru:0, ra:0, fu:0, fa:0 };
    dates[date].gu += gu; dates[date].gmv += gmv;
    dates[date].cu += cu; dates[date].ca += ca;
    dates[date].ru += ru; dates[date].ra += ra;
    dates[date].fu += fu; dates[date].fa += fa;
  });

  const cancelRate = totalGrossUnits > 0 ? (totalCancelUnits / totalGrossUnits) * 100 : 0;
  const returnRate = totalGrossUnits > 0 ? (totalReturnUnits / totalGrossUnits) * 100 : 0;
  const netRealization = totalGMV > 0 ? (totalFinalAmt / totalGMV) * 100 : 0;

  const sortedDates = Object.keys(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let maxRevDay = '', maxRevVal = -1, minRevDay = '', minRevVal = Infinity;
  let maxRetDay = '', maxRetVal = -1;

  sortedDates.forEach(d => {
    const dt = dates[d];
    if (dt.fa > maxRevVal) { maxRevVal = dt.fa; maxRevDay = d; }
    if (dt.fa < minRevVal) { minRevVal = dt.fa; minRevDay = d; }
    if (dt.ru > maxRetVal) { maxRetVal = dt.ru; maxRetDay = d; }
  });

  const skuKeys = Object.keys(skus);
  skuKeys.sort((a, b) => skus[b].fa - skus[a].fa);

  const top20Count = Math.ceil(skuKeys.length * 0.2);
  let top20Rev = 0;
  for (let i = 0; i < top20Count; i++) top20Rev += skus[skuKeys[i]].fa;
  const top20Pct = totalFinalAmt > 0 ? (top20Rev / totalFinalAmt) * 100 : 0;

  let top3Rev = 0;
  for (let i = 0; i < Math.min(3, skuKeys.length); i++) top3Rev += skus[skuKeys[i]].fa;
  const top3Pct = totalFinalAmt > 0 ? (top3Rev / totalFinalAmt) * 100 : 0;

  const globalRetAvg = totalGrossUnits > 0 ? (totalReturnUnits / totalGrossUnits) * 100 : 0;
  const globalCanAvg = totalGrossUnits > 0 ? (totalCancelUnits / totalGrossUnits) * 100 : 0;

  return {
    totalGrossUnits, totalGMV, totalCancelUnits, totalCancelAmt,
    totalReturnUnits, totalReturnAmt, totalFinalUnits, totalFinalAmt,
    skus, categories, dates, sortedDates,
    sortedSkuKeys: skuKeys,
    cancelRate, returnRate, netRealization,
    top20Pct, top20Count, totalSkuCount: skuKeys.length,
    top3Pct, globalRetAvg, globalCanAvg,
    maxRevDay, maxRevVal, minRevDay, minRevVal, maxRetDay, maxRetVal
  };
}

export function exactStr(val: number): string {
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
}

export function pct(num: number, den: number): number {
  return den > 0 ? (num / den) * 100 : 0;
}
