import { useEffect, useRef } from 'react';
import landingHtml from '../landing.html?raw';
import landingCss from '../landing.css?raw';
import { isFileSupported } from '../fileParser';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
}

export function UploadSection({ onFileSelect }: UploadSectionProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    const scopedCss = landingCss.replace(':root{', ':host{');
    shadow.innerHTML = `<style>:host{display:block;background:#f1f8fd;color:#10233e;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}${scopedCss}</style>${landingHtml}`;

    const modal = shadow.getElementById('uploadModal');
    const input = shadow.getElementById('fileInput') as HTMLInputElement | null;
    const dropzone = shadow.getElementById('dropzone');
    const fileName = shadow.getElementById('fileName');
    const analyzeButton = shadow.getElementById('analyzeBtn');
    const toast = shadow.getElementById('toast');
    const menuToggle = shadow.getElementById('menuToggle');
    const mobileNav = shadow.getElementById('mobileNav');
    const navigation = shadow.querySelector<HTMLElement>('.nav');
    let selectedFile: File | null = null;

    if (input) input.accept = '.csv,.xlsx,.xls,.tsv';

    const closeMenu = () => {
      mobileNav?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open navigation menu');
      if (menuToggle) menuToggle.textContent = '☰';
    };

    const openModal = () => {
      closeMenu();
      modal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal?.classList.remove('open');
      document.body.style.overflow = '';
    };

    const showMessage = (message: string, error = false) => {
      if (fileName) {
        fileName.textContent = message;
        fileName.style.color = error ? '#d74f4f' : 'var(--green)';
      }
    };

    const selectFiles = (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      if (!isFileSupported(file)) {
        selectedFile = null;
        analyzeButton?.classList.remove('ready');
        showMessage('Unsupported format. Choose CSV, XLSX, XLS, or TSV.', true);
        return;
      }
      selectedFile = file;
      showMessage(file.name);
      analyzeButton?.classList.add('ready');
    };

    const handleClick = (event: Event) => {
      const target = event.target as Element | null;
      if (!target) return;

      const sectionLink = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (sectionLink) {
        const selector = sectionLink.getAttribute('href');
        const section = selector && selector !== '#' ? shadow.querySelector(selector) : null;
        if (section) {
          event.preventDefault();
          closeMenu();
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }

      if (target.closest('.open-upload')) {
        event.preventDefault();
        openModal();
        return;
      }

      if (target.closest('#menuToggle')) {
        event.preventDefault();
        const opening = !mobileNav?.classList.contains('open');
        mobileNav?.classList.toggle('open', opening);
        menuToggle?.setAttribute('aria-expanded', String(opening));
        menuToggle?.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
        if (menuToggle) menuToggle.textContent = opening ? '×' : '☰';
        return;
      }

      if (target.closest('.modal-close') || target === modal) {
        closeModal();
        return;
      }

      if (target.closest('#browseBtn')) {
        event.preventDefault();
        event.stopPropagation();
        input?.click();
        return;
      }

      if (target.closest('#analyzeBtn')) {
        event.preventDefault();
        if (selectedFile) {
          toast?.classList.add('show');
          closeModal();
          onFileSelect(selectedFile);
        }
        return;
      }

      if (target.closest('#dropzone') && !target.closest('input')) {
        input?.click();
        return;
      }

      const faqButton = target.closest<HTMLButtonElement>('.faq-q');
      if (faqButton) {
        const item = faqButton.parentElement;
        shadow.querySelectorAll('.faq-item').forEach((faq) => {
          if (faq !== item) {
            faq.classList.remove('open');
            const symbol = faq.querySelector('.faq-q span');
            if (symbol) symbol.textContent = '+';
          }
        });
        item?.classList.toggle('open');
        const symbol = faqButton.querySelector('span');
        if (symbol) symbol.textContent = item?.classList.contains('open') ? '−' : '+';
        return;
      }

      const howButton = target.closest<HTMLButtonElement>('.nav-actions .pill-light');
      if (howButton) {
        shadow.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleChange = () => selectFiles(input?.files ?? null);
    const handleDragOver = (event: Event) => {
      event.preventDefault();
      dropzone?.classList.add('drag');
    };
    const handleDragLeave = (event: Event) => {
      event.preventDefault();
      dropzone?.classList.remove('drag');
    };
    const handleDrop = (event: Event) => {
      event.preventDefault();
      dropzone?.classList.remove('drag');
      selectFiles((event as DragEvent).dataTransfer?.files ?? null);
    };
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        closeModal();
      }
    };
    const handleOutsideClick = (event: MouseEvent) => {
      const path = event.composedPath();
      if (mobileNav?.classList.contains('open') && !path.includes(mobileNav) && !path.includes(menuToggle as EventTarget)) {
        closeMenu();
      }
    };
    const updateNavigationStyle = () => {
      if (!navigation) return;
      navigation.classList.toggle('nav-scrolled', window.scrollY > 6);
    };
    const handleResize = () => {
      if (window.innerWidth > 960) closeMenu();
      updateNavigationStyle();
    };

    updateNavigationStyle();
    shadow.addEventListener('click', handleClick);
    input?.addEventListener('change', handleChange);
    dropzone?.addEventListener('dragenter', handleDragOver);
    dropzone?.addEventListener('dragover', handleDragOver);
    dropzone?.addEventListener('dragleave', handleDragLeave);
    dropzone?.addEventListener('drop', handleDrop);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('scroll', updateNavigationStyle, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = '';
      shadow.removeEventListener('click', handleClick);
      input?.removeEventListener('change', handleChange);
      dropzone?.removeEventListener('dragenter', handleDragOver);
      dropzone?.removeEventListener('dragover', handleDragOver);
      dropzone?.removeEventListener('dragleave', handleDragLeave);
      dropzone?.removeEventListener('drop', handleDrop);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('scroll', updateNavigationStyle);
      window.removeEventListener('resize', handleResize);
    };
  }, [onFileSelect]);

  return <div ref={hostRef} aria-label="SellerMetric landing page" />;
}
