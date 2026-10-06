export default function RouteLoadingSkeleton({ variant = 'dashboard' }) {
  if (variant === 'tab' || variant === 'simple') {
    return (
      <div className="py-4 space-y-4 animate-pulse smooth-gpu" aria-busy="true" aria-label="Chargement du contenu">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-28 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          <div className="h-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl" />
          <div className="h-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl" />
          <div className="h-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl hidden md:block" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
      {/* 1. Header Banner Skeleton */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/40 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-5 w-32 bg-slate-300 dark:bg-slate-700 rounded-full" />
          <div className="h-5 w-20 bg-slate-300 dark:bg-slate-700 rounded-full" />
          <div className="h-5 w-16 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        <div className="space-y-2">
          <div className="h-8 md:h-10 w-2/3 max-w-md bg-slate-300 dark:bg-slate-700 rounded-2xl" />
          <div className="h-4 w-1/2 max-w-sm bg-slate-300 dark:bg-slate-700 rounded-lg" />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-6 w-28 bg-slate-300 dark:bg-slate-700 rounded-xl" />
          <div className="h-6 w-36 bg-slate-300 dark:bg-slate-700 rounded-xl" />
          <div className="h-6 w-24 bg-slate-300 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>

      {/* 2. Metrics Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 space-y-2"
          >
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-7 w-20 bg-slate-300 dark:bg-slate-700 rounded-xl" />
            <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Content Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-5 w-4/5 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
