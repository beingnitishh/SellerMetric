export interface RawRow {
  'SKU ID': string;
  'Category': string;
  'Order Date': string;
  'Gross Units': string;
  'GMV': string;
  'Cancellation Units': string;
  'Cancellation Amount': string;
  'Return Units': string;
  'Return Amount': string;
  'Final Sale Units': string;
  'Final Sale Amount': string;
  [key: string]: string;
}

export interface Aggregated {
  gu: number;
  gmv: number;
  cu: number;
  ca: number;
  ru: number;
  ra: number;
  fu: number;
  fa: number;
}

export interface ProcessedData {
  totalGrossUnits: number;
  totalGMV: number;
  totalCancelUnits: number;
  totalCancelAmt: number;
  totalReturnUnits: number;
  totalReturnAmt: number;
  totalFinalUnits: number;
  totalFinalAmt: number;
  skus: Record<string, Aggregated>;
  categories: Record<string, Aggregated>;
  dates: Record<string, Aggregated>;
  sortedDates: string[];
  sortedSkuKeys: string[];
  cancelRate: number;
  returnRate: number;
  netRealization: number;
  top20Pct: number;
  top20Count: number;
  totalSkuCount: number;
  top3Pct: number;
  globalRetAvg: number;
  globalCanAvg: number;
  maxRevDay: string;
  maxRevVal: number;
  minRevDay: string;
  minRevVal: number;
  maxRetDay: string;
  maxRetVal: number;
}

// ============================================================================
// RETURN ANALYSIS TYPES
// ============================================================================

export interface ReturnRecord {
  sku: string;
  product: string;
  price: number;
  quantity: number;
  refundAmount: number;
  requestDate: Date | null;
  returnType: 'RTO' | 'Customer Return';
  reason: string;
  subReason: string;
  status: string;
}

export interface ReturnSkuData {
  sku: string;
  product: string;
  returns: number;
  refund: number;
  rto: number;
  reasons: Record<string, number>;
}

export interface ReturnInsight {
  type: 'danger' | 'warning' | 'info';
  text: string;
}

export interface ReturnMetrics {
  global: {
    totalReturns: number;
    totalRefund: number;
    rtoRate: number;
    customerReturnRate: number;
    avgRefund: number;
    topReason: string;
    rtoCount: number;
    customerReturnCount: number;
  };
  topReasons: { reason: string; count: number }[];
  topSkus: ReturnSkuData[];
  trendData: {
    labels: string[];
    values: number[];
  };
  insights: ReturnInsight[];
}
