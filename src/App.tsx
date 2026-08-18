import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import type { ProcessedData, ReturnRecord } from './types';

const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const UploadSection = lazy(() => import('./components/UploadSection').then(module => ({ default: module.UploadSection })));
const FeaturesPage = lazy(() => import('./components/FeaturesPage').then(module => ({ default: module.FeaturesPage })));
const HowItWorksPage = lazy(() => import('./components/InfoPages').then(module => ({ default: module.HowItWorksPage })));
const PrivacyPage = lazy(() => import('./components/InfoPages').then(module => ({ default: module.PrivacyPage })));
const FaqPage = lazy(() => import('./components/InfoPages').then(module => ({ default: module.FaqPage })));
const BlogIndexPage = lazy(() => import('./components/BlogPages').then(module => ({ default: module.BlogIndexPage })));
const BlogArticlePage = lazy(() => import('./components/BlogPages').then(module => ({ default: module.BlogArticlePage })));
type AppState = 'upload' | 'loading' | 'dashboard';
type TabType = 'sales' | 'returns';

function toReturnRecords(rows: Record<string, string>[]) {
  return rows.map(row => Object.fromEntries(Object.keys(row).map(key => [key, row[key] || ''])));
}

export function App() {
  const [state, setState] = useState<AppState>('upload');
  const [data, setData] = useState<ProcessedData | null>(null);
  const [returnData, setReturnData] = useState<ReturnRecord[]>([]);
  const [initialTab, setInitialTab] = useState<TabType>('sales');

  useEffect(() => {
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) return;
    robots.content = state === 'upload'
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : 'noindex, nofollow';
  }, [state]);

  const handleFileUpload = useCallback(async (file: File) => {
    setState('loading');
    try {
      const [{ parseFile, detectFileType }, { processData }, { normalizeReturnData }] = await Promise.all([
        import('./fileParser'), import('./processData'), import('./returnProcessor'),
      ]);
      const rows = await parseFile(file);
      if (detectFileType(rows) === 'returns') {
        const normalized = normalizeReturnData(toReturnRecords(rows));
        if (!normalized.length) throw new Error('No valid return records found. Check that the file includes SKU, Product, Total Price, Return Type and Return Reason columns.');
        setReturnData(normalized);
        setInitialTab('returns');
      } else {
        setData(processData(rows));
        setInitialTab('sales');
      }
      setState('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to process this report. Check the file format and standard Flipkart headers.');
      console.error(error);
      setState(data || returnData.length ? 'dashboard' : 'upload');
    }
  }, [data, returnData]);

  const handleSalesFileSelect = useCallback(async (file: File) => {
    setState('loading');
    try {
      const [{ parseFile }, { processData }] = await Promise.all([import('./fileParser'), import('./processData')]);
      setData(processData(await parseFile(file)));
      setInitialTab('sales');
      setState('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to process this sales report.');
      console.error(error);
      setState('dashboard');
    }
  }, []);

  const handleReturnUpload = useCallback(async (file: File) => {
    try {
      const [{ parseFile }, { normalizeReturnData }] = await Promise.all([import('./fileParser'), import('./returnProcessor')]);
      const normalized = normalizeReturnData(toReturnRecords(await parseFile(file)));
      if (!normalized.length) throw new Error('No valid return records were found in this file.');
      setReturnData(normalized);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to process this return report.');
      console.error(error);
    }
  }, []);

  const handleReset = useCallback(() => {
    setData(null); setReturnData([]); setState('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (state === 'loading') return <LoadingScreen />;
  if (state === 'dashboard' && (data || returnData.length)) {
    return <Suspense fallback={<LoadingScreen />}><Dashboard data={data} onReset={handleReset} onFileSelect={handleSalesFileSelect} returnData={returnData} onUploadReturn={handleReturnUpload} onClearReturn={() => setReturnData([])} initialTab={initialTab} /></Suspense>;
  }

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const publicPage = path === '/features' ? <FeaturesPage onFileSelect={handleFileUpload} />
    : path === '/how-it-works' ? <HowItWorksPage onFileSelect={handleFileUpload} />
    : path === '/privacy' ? <PrivacyPage onFileSelect={handleFileUpload} />
    : path === '/faq' ? <FaqPage onFileSelect={handleFileUpload} />
    : path === '/blog' ? <BlogIndexPage />
    : path.startsWith('/blog/') ? <BlogArticlePage slug={path.slice('/blog/'.length)} />
    : <UploadSection onFileSelect={handleFileUpload} />;
  return <Suspense fallback={<LoadingScreen />}>{publicPage}</Suspense>;
}
