import React from 'react';
import { AlertOctagon, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console in a structured manner
    if (typeof console !== 'undefined' && console.error) {
      console.error('[CampusHub ErrorBoundary caught error]:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <AlertOctagon size={32} strokeWidth={2.2} />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100/80 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300/40">
                Interruption de Rendu
              </span>
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100">
                {this.props.title || 'Une anomalie inattendue est survenue'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                {this.state.error?.message ||
                  'Ce module a rencontré une erreur d\'exécution temporaire. Vous pouvez réinitialiser la vue ou revenir à l\'accueil.'}
              </p>
            </div>

            {/* Error details toggler */}
            <div className="text-left">
              <button
                type="button"
                onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 transition-colors"
              >
                <span>Détails techniques du composant</span>
                {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono overflow-auto max-h-40 border border-slate-800 space-y-1 text-left">
                  <div className="text-rose-400 font-bold">{String(this.state.error)}</div>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-slate-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Recovery actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
              >
                <RotateCcw size={14} />
                <span>Réessayer / Recharger</span>
              </button>

              <a
                href="/dashboard"
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Home size={14} />
                <span>Tableau de Bord</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
