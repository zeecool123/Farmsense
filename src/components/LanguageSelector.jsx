import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const languageLabels = {
  en: 'English',
  zh: '中文',
  bm: 'BM',
  ta: 'தமிழ்',
};

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-700"
      >
        <span>{languageLabels[language] || language}</span>
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {Object.entries(languageLabels).map(([code, label]) => (
            <button
              key={code}
              onClick={() => {
                changeLanguage(code);
                setOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm transition ${
                code === language
                  ? 'bg-farm-50 text-farm-700 dark:bg-farm-900/30 dark:text-farm-300'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;