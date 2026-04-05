import fs from 'fs';
import path from 'path';

// Define the mappings from light mode classes to dark luxury mode classes
const replacements = [
  // Backgrounds
  { regex: /\bbg-white\b/g, replacement: 'bg-[#111827]' },
  { regex: /\bbg-slate-50\b/g, replacement: 'bg-[#0B0F1A]' },
  { regex: /\bbg-slate-100\b/g, replacement: 'bg-[#1C2537]' },
  { regex: /\bbg-slate-200\b/g, replacement: 'bg-[#1E2D45]' },
  
  // Borders
  { regex: /\bborder-slate-200\b/g, replacement: 'border-[#1E2D45]' },
  { regex: /\bborder-slate-100\b/g, replacement: 'border-[#1E2D45]' },
  { regex: /\bborder-slate-300\b/g, replacement: 'border-[#1E2D45]' },
  
  // Text Colors
  { regex: /\btext-slate-900\b/g, replacement: 'text-[#F0EDE6]' },
  { regex: /\btext-slate-800\b/g, replacement: 'text-[#F0EDE6]' },
  { regex: /\btext-slate-700\b/g, replacement: 'text-[#F0EDE6]' },
  { regex: /\btext-slate-600\b/g, replacement: 'text-[#94A3B8]' },
  { regex: /\btext-slate-500\b/g, replacement: 'text-[#94A3B8]' },
  { regex: /\btext-slate-400\b/g, replacement: 'text-[#475569]' },
  { regex: /\btext-slate-300\b/g, replacement: 'text-[#475569]' },

  // Primary / Indigo mapped to luxury Gold
  { regex: /\btext-primary-600\b/g, replacement: 'text-[#D4A847]' },
  { regex: /\btext-primary-700\b/g, replacement: 'text-[#A07A28]' },
  { regex: /\bbg-primary-50\b/g, replacement: 'bg-[#1C2537]' },
  { regex: /\bbg-primary-100\b/g, replacement: 'bg-[#1E2D45]' },
  { regex: /\bborder-primary-100\b/g, replacement: 'border-[#A07A28]/30' },
  { regex: /\bfrom-primary-600 to-primary-500\b/g, replacement: 'from-[#D4A847] to-[#A07A28]' },

  // Hover States
  { regex: /\bhover:bg-slate-50\b/g, replacement: 'hover:bg-[#1C2537]' },
  { regex: /\bhover:bg-slate-100\b/g, replacement: 'hover:bg-[#1E2D45]' },
  { regex: /\bhover:text-slate-700\b/g, replacement: 'hover:text-[#D4A847]' },
  { regex: /\bhover:text-primary-600\b/g, replacement: 'hover:text-[#D4A847]' },

  // Chart Grid Lines in component (We'll safely modify chart files individually if needed, but this covers generic strings)
  { regex: /'rgba\(0,0,0,0\.04\)'/g, replacement: "'#1E2D45'" }, // grid lines in charts
  { regex: /'#ffffff'/g, replacement: "'#0B0F1A'" }, // point borders / pie borders
];

const componentsPath = path.join(process.cwd(), 'src', 'components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  // Specific tweaks targeting exact lines that need manual adjustment (e.g., KPICard)
  if (filePath.endsWith('KPICard.tsx')) {
    content = content.replace(/tx: 'text-slate-800'/g, "text: 'text-[#F0EDE6]'");
    content = content.replace(/border: 'border-slate-200'/g, "border: 'border-[#1E2D45]'");
    // Ensure all references mapped originally with slate inside KPICard colorMap handle dark
  }

  // Rewrite
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${path.basename(filePath)}`);
}

const filesToUpdate = [
  'Dashboard.tsx',
  'ReturnDashboard.tsx',
  'KPICard.tsx',
  'SectionHeader.tsx',
  'Charts.tsx',
  'ReturnCharts.tsx',
  'UploadModal.tsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(componentsPath, file);
  if (fs.existsSync(fullPath)) {
    processFile(fullPath);
  }
});
