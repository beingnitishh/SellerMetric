import type { ReturnRecord, ReturnMetrics, ReturnSkuData } from './types';

/**
 * Column mapping system — handles variations in Flipkart return report exports.
 */
function mapCol(headers: string[], aliases: string[]): number {
  return headers.findIndex(h =>
    aliases.some(a => h.toLowerCase().includes(a.toLowerCase()))
  );
}

/**
 * Normalize raw CSV/Excel rows into typed ReturnRecord objects.
 * Handles Flipkart's standard return export format.
 */
export function normalizeReturnData(rawData: Record<string, string>[]): ReturnRecord[] {
  if (!rawData || rawData.length === 0) return [];

  const headers = Object.keys(rawData[0]);

  const cSku = mapCol(headers, ['SKU']);
  const cProduct = mapCol(headers, ['Product', 'Item Name']);
  const cPrice = mapCol(headers, ['Total Price', 'Price']);
  const cQty = mapCol(headers, ['Quantity', 'Qty']);
  const cReqDate = mapCol(headers, ['Return Requested Date', 'Date']);
  const cRetType = mapCol(headers, ['Return Type']);
  const cReason = mapCol(headers, ['Return Reason']);
  const cSubReason = mapCol(headers, ['Return Sub-reason', 'Return Sub Reason', 'Sub-reason']);
  const cStatus = mapCol(headers, ['Return Status']);

  return rawData
    .filter(row => {
      const vals = Object.values(row);
      const nonEmpty = vals.filter(v => v && v.trim() !== '');
      if (nonEmpty.length < 3) return false;
      if (cSku >= 0 && (!row[headers[cSku]] || row[headers[cSku]].trim() === '')) return false;
      return true;
    })
    .map(row => {
      const getVal = (idx: number) => (idx >= 0 && idx < headers.length ? row[headers[idx]] || '' : '');

      const isRTO = getVal(cRetType).toLowerCase().includes('courier');
      const qty = parseInt(getVal(cQty)) || 1;
      const price = parseFloat(getVal(cPrice)) || 0;

      let parsedDate: Date | null = null;
      const dateStr = getVal(cReqDate);
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) parsedDate = d;
      }

      return {
        sku: getVal(cSku) || 'UNKNOWN',
        product: getVal(cProduct) || 'Unknown Product',
        price: price,
        quantity: qty,
        refundAmount: price * qty,
        requestDate: parsedDate,
        returnType: isRTO ? 'RTO' as const : 'Customer Return' as const,
        reason: getVal(cReason) || 'Not Specified',
        subReason: getVal(cSubReason) || '',
        status: getVal(cStatus) || 'Unknown',
      };
    });
}

/**
 * Process return records into aggregated metrics.
 * Handles filtering by search and return type.
 */
export function computeReturnMetrics(
  data: ReturnRecord[],
  filters: { search: string; returnType: string }
): ReturnMetrics {
  let filteredData = data;

  // Apply Filters
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filteredData = filteredData.filter(
      d => d.sku.toLowerCase().includes(q) || d.product.toLowerCase().includes(q)
    );
  }
  if (filters.returnType !== 'All') {
    filteredData = filteredData.filter(d => d.returnType === filters.returnType);
  }

  // Global KPIs
  let totalReturns = filteredData.length;
  let totalRefund = 0;
  let rtoCount = 0;
  let customerReturnCount = 0;

  const reasonsMap: Record<string, number> = {};
  const skuMap: Record<string, ReturnSkuData> = {};
  const dateMap: Record<string, number> = {};

  // Single pass aggregation O(N)
  for (const row of filteredData) {
    totalRefund += row.refundAmount;
    if (row.returnType === 'RTO') rtoCount++;
    else customerReturnCount++;

    // Reasons aggregation
    reasonsMap[row.reason] = (reasonsMap[row.reason] || 0) + 1;

    // Date aggregation (Trends)
    if (row.requestDate) {
      const dStr = row.requestDate.toISOString().split('T')[0];
      dateMap[dStr] = (dateMap[dStr] || 0) + 1;
    }

    // SKU Level Aggregation
    if (!skuMap[row.sku]) {
      skuMap[row.sku] = {
        sku: row.sku,
        product: row.product,
        returns: 0,
        refund: 0,
        rto: 0,
        reasons: {},
      };
    }
    skuMap[row.sku].returns += 1;
    skuMap[row.sku].refund += row.refundAmount;
    if (row.returnType === 'RTO') skuMap[row.sku].rto += 1;
    skuMap[row.sku].reasons[row.reason] = (skuMap[row.sku].reasons[row.reason] || 0) + 1;
  }

  const topReasons = Object.entries(reasonsMap)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => ({ reason, count }));

  const topSkus = Object.values(skuMap)
    .sort((a, b) => b.returns - a.returns)
    .slice(0, 50);

  const sortedDates = Object.keys(dateMap).sort();
  const trendData = {
    labels: sortedDates,
    values: sortedDates.map(d => dateMap[d]),
  };

  // Automated Insight Generation
  const insights: ReturnMetrics['insights'] = [];
  if (totalReturns > 0) {
    const rtoRate = (rtoCount / totalReturns) * 100;
    if (rtoRate > 40)
      insights.push({
        type: 'warning',
        text: `High RTO Alert: ${rtoRate.toFixed(1)}% of returns are un-delivered (Courier Returns). Check shipping partner performance.`,
      });

    if (topReasons.length > 0) {
      const topReasonShare = (topReasons[0].count / totalReturns) * 100;
      if (topReasonShare > 30)
        insights.push({
          type: 'danger',
          text: `Critical Leakage: '${topReasons[0].reason}' accounts for ${topReasonShare.toFixed(1)}% of all returns.`,
        });
    }

    if (topSkus.length > 0) {
      const worstSkuShare = (topSkus[0].returns / totalReturns) * 100;
      if (worstSkuShare > 15)
        insights.push({
          type: 'info',
          text: `SKU Anomaly: '${topSkus[0].sku}' is driving ${worstSkuShare.toFixed(1)}% of your total return volume.`,
        });
    }
  }

  return {
    global: {
      totalReturns,
      totalRefund,
      rtoRate: totalReturns ? (rtoCount / totalReturns) * 100 : 0,
      customerReturnRate: totalReturns ? (customerReturnCount / totalReturns) * 100 : 0,
      avgRefund: totalReturns ? totalRefund / totalReturns : 0,
      topReason: topReasons[0]?.reason || 'N/A',
      rtoCount,
      customerReturnCount,
    },
    topReasons,
    topSkus,
    trendData,
    insights,
  };
}
