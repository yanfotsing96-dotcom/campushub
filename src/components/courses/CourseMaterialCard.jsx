import React, { memo } from 'react';
import { Video, Code, Download } from 'lucide-react';

const CourseMaterialCard = memo(function CourseMaterialCard({
  mat,
  userMatricule,
  onDownload,
}) {
  return (
    <div
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-600 text-white">
              {mat.codeUe}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {mat.format}
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            {mat.size || mat.duration}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {mat.titre}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {mat.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
          <span>
            Enseignant : <strong>{mat.enseignant}</strong>
          </span>
        </div>

        <a
          href={mat.url}
          onClick={(e) => {
            e.preventDefault();
            onDownload(mat);
          }}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          {mat.type === 'video' ? (
            <Video size={13} />
          ) : mat.type === 'code' ? (
            <Code size={13} />
          ) : (
            <Download size={13} />
          )}
          <span>{mat.type === 'video' ? 'Visionner' : 'Télécharger'}</span>
        </a>
      </div>
    </div>
  );
});

export default CourseMaterialCard;
