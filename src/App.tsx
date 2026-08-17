import { useState, useCallback } from 'react';
import { UploadSection } from './components/UploadSection';
import { FeaturesPage } from './components/FeaturesPage';
import { FaqPage, HowItWorksPage, PrivacyPage } from './components/InfoPages';
import { LoadingScreen } from './components/LoadingScreen';
import { Dashboard } from './components/Dashboard';
import { processData } from './processData';
import { parseFile, detectFileType } from './fileParser';
import { normalizeReturnData } from './returnProcessor';
import type { ProcessedData, ReturnRecord } from './types';

type AppState = 'upload' | 'loading' | 'dashboard';
type TabType = 'sales' | 'returns';

export function App() {
  const [state, setState] = useState<AppState>('upload');
  const [data, setData] = useState<ProcessedData | null>(null);
  const [returnData, setReturnData] = useState<ReturnRecord[]>([]);
  const [initialTab, setInitialTab] = useState<TabType>('sales');

  /**
   * Unified file upload handler — auto-detects Sales vs Return data
   * Used by: landing page hero CTA, landing page drag-drop, bottom CTA
   */
  const handleFileUpload = useCallback((file: File) => {
    setState('loading');

    parseFile(file)
      .then((rows) => {
        const detectedType = detectFileType(rows);

        if (detectedType === 'returns') {
          // Process as return data
          const rawRecords: Record<string, string>[] = rows.map(row => {
            const record: Record<string, string> = {};
            for (const key of Object.keys(row)) {
              record[key] = row[key] || '';
            }
            return record;
          });
          const normalized = normalizeReturnData(rawRecords);
          if (normalized.length === 0) {
            alert('No valid return records found. Please ensure your file contains return data with columns like SKU, Product, Total Price, Return Type, Return Reason, etc.');
            setState(data || returnData.length > 0 ? 'dashboard' : 'upload');
            return;
          }
          setReturnData(normalized);
          setInitialTab('returns');
          setState('dashboard');
        } else {
          // Process as sales data
          const processed = processData(rows);
          setData(processed);
          setInitialTab('sales');
          setState('dashboard');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((error) => {
        alert(error instanceof Error ? error.message : 'Error processing data: Please ensure headers exactly match the standard export format.');
        console.error(error);
        setState(data || returnData.length > 0 ? 'dashboard' : 'upload');
      });
  }, [data, returnData]);

  /**
   * Dashboard-level sales file upload (from Upload Modal inside dashboard)
   * This always processes as sales data since the user explicitly clicks "Upload Sales Report"
   */
  const handleSalesFileSelect = useCallback((file: File) => {
    setState('loading');

    parseFile(file)
      .then((rows) => {
        const processed = processData(rows);
        setData(processed);
        setInitialTab('sales');
        setState('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((error) => {
        alert(error instanceof Error ? error.message : 'Error processing data.');
        console.error(error);
        setState('dashboard');
      });
  }, []);

  /**
   * Dashboard-level return file upload (from ReturnDashboard upload area)
   */
  const handleReturnUpload = useCallback((file: File) => {
    parseFile(file)
      .then((rows) => {
        const rawRecords: Record<string, string>[] = rows.map(row => {
          const record: Record<string, string> = {};
          for (const key of Object.keys(row)) {
            record[key] = row[key] || '';
          }
          return record;
        });
        const normalized = normalizeReturnData(rawRecords);
        if (normalized.length === 0) {
          alert('No valid return records found. Please ensure your file contains return data with columns like SKU, Product, Total Price, Return Type, Return Reason, etc.');
          return;
        }
        setReturnData(normalized);
      })
      .catch((error) => {
        alert(error instanceof Error ? error.message : 'Error processing return data.');
        console.error(error);
      });
  }, []);

  const handleClearReturn = useCallback(() => {
    setReturnData([]);
  }, []);

  const handleReset = useCallback(() => {
    setData(null);
    setReturnData([]);
    setState('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (state === 'loading') {
    return <LoadingScreen />;
  }

  // Show dashboard if we have sales data OR return data
  if (state === 'dashboard' && (data || returnData.length > 0)) {
    return (
      <Dashboard
        data={data}
        onReset={handleReset}
        onFileSelect={handleSalesFileSelect}
        returnData={returnData}
        onUploadReturn={handleReturnUpload}
        onClearReturn={handleClearReturn}
        initialTab={initialTab}
      />
    );
  }

  const normalizedPath = window.location.pathname.replace(/\/$/, '') || '/';
  if (normalizedPath === '/features') return <FeaturesPage onFileSelect={handleFileUpload} />;
  if (normalizedPath === '/how-it-works') return <HowItWorksPage onFileSelect={handleFileUpload} />;
  if (normalizedPath === '/privacy') return <PrivacyPage onFileSelect={handleFileUpload} />;
  if (normalizedPath === '/faq') return <FaqPage onFileSelect={handleFileUpload} />;

  return (
    <UploadSection
      onFileSelect={handleFileUpload}
    />
  );
}
