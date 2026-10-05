import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export default function LanguageSelector({ variant = 'dropdown', className = '' }) {
  const { language, setLanguage, currentLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Segmented Pill Variant (FR | EN toggle)
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold ${className}`}
      >
        {supportedLanguages.map((l) => {
          const isSelected = language === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`px-2.5 py-1 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={l.name}
            >
              <span>{l.flag}</span>
              <span>{l.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Minimalist Icon Variant
  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-colors ${className}`}
        title={`Langue: ${currentLanguage.name} (Cliquez pour basculer)`}
      >
        <span>{currentLanguage.flag}</span>
        <span className="font-mono text-[11px]">{currentLanguage.shortLabel}</span>
      </button>
    );
  }

  // 3. Dropdown Menu Variant (Default)
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-indigo-400 transition-all shadow-2xs"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Changer de langue / Switch language"
      >
        <Globe size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="font-bold text-xs">{currentLanguage.shortLabel}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            🇨🇲 Bilinguisme Officiel
          </div>

          {supportedLanguages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{l.flag}</span>
                  <div>
                    <span className="block leading-tight">{l.name}</span>
                    <span className="text-[10px] text-slate-400 block leading-tight font-normal">
                      {l.subtitle}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <Check size={14} className="text-indigo-600 dark:text-indigo-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
