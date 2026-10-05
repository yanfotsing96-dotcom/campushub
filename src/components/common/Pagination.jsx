import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
      <div className="text-slate-500 dark:text-slate-400">
        Affichage de <span className="font-semibold text-slate-800 dark:text-slate-200">{startItem}</span> à{' '}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{endItem}</span> sur{' '}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItems}</span> éléments
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Page précédente"
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400">
                ...
              </span>
            );
          }
          const isActive = page === currentPage;
          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Page suivante"
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
});

export default Pagination;
