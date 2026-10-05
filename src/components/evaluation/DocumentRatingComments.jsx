import { useState, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  CornerDownRight,
  Send,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { RATED_DOCUMENTS } from './data/evaluationData';
import { useAuth } from '../../hooks/useAuth';

const STORAGE_KEY_DOCS = 'campushub_rated_documents';

export default function DocumentRatingComments() {
  const { user } = useAuth();
  const currentAuthor = `${user?.fullName || user?.nom || 'Yan Fotsing'} (Moi)`;
  const currentMatricule = user?.matricule || '23S40192';
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCS);
      return saved ? JSON.parse(saved) : RATED_DOCUMENTS;
    } catch {
      return RATED_DOCUMENTS;
    }
  });

  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || 'doc-1');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'highest', 'helpful'

  // New Review Form State
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newCommentText, setNewCommentText] = useState('');
  const [isRecommended, setIsRecommended] = useState(true);

  // Thread Reply State { commentId: string, replyText: string }
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const activeDoc = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  const saveDocuments = (updated) => {
    setDocuments(updated);
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erreur stockage local :', err);
    }
  };

  // Handle submitting a review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newReview = {
      id: `c-${Date.now()}`,
      author: currentAuthor,
      matricule: currentMatricule,
      level: 'L2 Informatique',
      rating: newRating,
      date: 'À l\'instant',
      text: newCommentText.trim(),
      likes: 1,
      isHelpful: true,
      recommended: isRecommended,
      replies: [],
    };

    // Update document breakdown and average
    const updatedDocs = documents.map((doc) => {
      if (doc.id === activeDoc.id) {
        const nextBreakdown = { ...doc.breakdown };
        nextBreakdown[newRating] = (nextBreakdown[newRating] || 0) + 1;
        const totalReviews = doc.reviewsCount + 1;

        // Calculate new weighted average
        const totalStars = Object.entries(nextBreakdown).reduce(
          (sum, [star, count]) => sum + Number(star) * count,
          0
        );
        const nextRating = Number((totalStars / totalReviews).toFixed(1));

        return {
          ...doc,
          rating: nextRating,
          reviewsCount: totalReviews,
          breakdown: nextBreakdown,
          comments: [newReview, ...doc.comments],
        };
      }
      return doc;
    });

    saveDocuments(updatedDocs);
    setNewCommentText('');
    setNewRating(5);
  };

  // Handle Thumbs Up / Helpful
  const handleLikeComment = (commentId) => {
    const updatedDocs = documents.map((doc) => {
      if (doc.id === activeDoc.id) {
        return {
          ...doc,
          comments: doc.comments.map((c) =>
            c.id === commentId ? { ...c, likes: c.likes + 1 } : c
          ),
        };
      }
      return doc;
    });
    saveDocuments(updatedDocs);
  };

  // Handle submitting a threaded reply
  const handleSubmitReply = (commentId) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: `r-${Date.now()}`,
      author: currentAuthor,
      matricule: currentMatricule,
      date: 'À l\'instant',
      text: replyText.trim(),
      likes: 0,
    };

    const updatedDocs = documents.map((doc) => {
      if (doc.id === activeDoc.id) {
        return {
          ...doc,
          comments: doc.comments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                replies: [...c.replies, newReply],
              };
            }
            return c;
          }),
        };
      }
      return doc;
    });

    saveDocuments(updatedDocs);
    setReplyText('');
    setActiveReplyId(null);
  };

  // Sorted comments
  const sortedComments = useMemo(() => {
    if (!activeDoc || !activeDoc.comments) return [];
    const copy = [...activeDoc.comments];
    if (sortBy === 'highest') {
      return copy.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'helpful') {
      return copy.sort((a, b) => b.likes - a.likes);
    }
    return copy; // recent is default
  }, [activeDoc, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Document Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 mb-2">
              <Star size={13} fill="currentColor" />
              <span>CampusHub · Évaluation Collégiale UY1</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Notation, Retours & Commentaires Académiques
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Évaluez la clarté pédagogique et la fidélité aux examens des cours et annales partagés.
            </p>
          </div>

          {/* Document Dropdown Switcher */}
          <div className="relative min-w-[280px]">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  [{doc.course}] {doc.title}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Review Dashboard Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Overall Rating & Breakdown Score (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {activeDoc.course}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                {activeDoc.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeDoc.author} · {activeDoc.department}
              </p>
            </div>

            {activeDoc.verifiedByFaculty && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 flex-shrink-0">
                <ShieldCheck size={13} />
                <span>Certifié UY1</span>
              </span>
            )}
          </div>

          {/* Average Rating Big Display */}
          <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                  {activeDoc.rating}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(activeDoc.rating) ? 'currentColor' : 'none'}
                    className={s <= Math.round(activeDoc.rating) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Basé sur {activeDoc.reviewsCount} évaluations d'étudiants
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                97%
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Recommandé pour réussir l'examen
              </p>
            </div>
          </div>

          {/* Star Breakdown Bars */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Répartition des étoiles :
            </h4>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = activeDoc.breakdown[stars] || 0;
              const percent = activeDoc.reviewsCount > 0
                ? Math.round((count / activeDoc.reviewsCount) * 100)
                : 0;

              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    {stars} <Star size={11} fill="currentColor" className="text-amber-500" />
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono text-[11px]">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* New Review Form */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
              <Star size={14} className="text-amber-500" />
              <span>Donner mon avis d'étudiant</span>
            </h4>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              {/* Star selector */}
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Votre note :
                </label>
                <div className="flex items-center gap-1 text-amber-500 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(s)}
                      className="p-1 hover:scale-115 transition-transform"
                    >
                      <Star
                        size={22}
                        fill={(hoverRating || newRating) >= s ? 'currentColor' : 'none'}
                        className={(hoverRating || newRating) >= s ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-xs text-slate-700 dark:text-slate-300">
                    {hoverRating || newRating} / 5 étoiles
                  </span>
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  required
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Expliquez ce qui vous a aidé ou ce qui pourrait être amélioré dans ce cours/annale..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isRecommended}
                    onChange={(e) => setIsRecommended(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Recommander pour les examens</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Publier mon avis</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Comments & Community Q/A Threads (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Comments Sort Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare size={14} />
              <span>Avis et Questions des Étudiants ({activeDoc.comments.length})</span>
            </span>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSortBy('recent')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  sortBy === 'recent'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Récents
              </button>
              <button
                type="button"
                onClick={() => setSortBy('highest')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  sortBy === 'highest'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mieux notés
              </button>
              <button
                type="button"
                onClick={() => setSortBy('helpful')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  sortBy === 'helpful'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Plus utiles
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3.5">
            {sortedComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                      {comment.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {comment.author}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {comment.matricule}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {comment.level} · {comment.date}
                      </div>
                    </div>
                  </div>

                  {/* Stars given by user */}
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        fill={s <= comment.rating ? 'currentColor' : 'none'}
                        className={s <= comment.rating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {comment.text}
                </p>

                {comment.recommended && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 size={12} />
                    <span>Recommande ce support pour les épreuves de l'Université de Yaoundé I</span>
                  </div>
                )}

                {/* Comment Actions Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleLikeComment(comment.id)}
                      className="inline-flex items-center gap-1.5 text-slate-500 hover:text-amber-600 transition-colors"
                    >
                      <ThumbsUp size={13} />
                      <span>Utile ({comment.likes})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveReplyId(activeReplyId === comment.id ? null : comment.id)
                      }
                      className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold"
                    >
                      <CornerDownRight size={13} />
                      <span>Répondre</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {comment.replies.length} réponse{comment.replies.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Reply Input Form */}
                {activeReplyId === comment.id && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Répondre à ${comment.author}...`}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveReplyId(null)}
                        className="px-3 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitReply(comment.id)}
                        className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white"
                      >
                        Envoyer
                      </button>
                    </div>
                  </div>
                )}

                {/* Child Replies Thread */}
                {comment.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-2 mt-3">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {reply.author}
                          </span>
                          <span>{reply.date}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
