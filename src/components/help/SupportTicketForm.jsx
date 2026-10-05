import { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Paperclip,
  X,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from './data/helpData';
import { useCampusHub } from '../../hooks/useCampusHub';

export default function SupportTicketForm() {
  const { student, triggerToast } = useCampusHub();

  const [formData, setFormData] = useState({
    name: student.name || 'Yanick Fotsing',
    email: student.email || 'yanfotsing96@gmail.com',
    university: student.universityShortName || 'Univ. Yaoundé I',
    category: 'bug',
    priority: 'normal',
    subject: '',
    message: '',
  });

  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' Ko',
      });
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `HE-${Math.floor(100 + Math.random() * 900)}`;
      const newTicket = {
        id: ticketId,
        subject: formData.subject.trim(),
        category:
          TICKET_CATEGORIES.find((c) => c.id === formData.category)?.label ||
          formData.category,
        priority:
          TICKET_PRIORITIES.find((p) => p.id === formData.priority)?.label ||
          formData.priority,
        university: formData.university,
        createdAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        attachment: attachment?.name,
      };

      setSubmittedTicket(newTicket);
      setIsSubmitting(false);

      triggerToast({
        title: `Ticket ${ticketId} transmis !`,
        message: 'L\'équipe de modération de Ngoa-Ekellé a bien reçu votre demande.',
        type: 'success',
      });
    }, 1200);
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setFormData((prev) => ({
      ...prev,
      subject: '',
      message: '',
      category: 'bug',
      priority: 'normal',
    }));
    setAttachment(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
      {submittedTicket ? (
        /* Confirmation State */
        <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
              <span>Ticket #{submittedTicket.id}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
              Votre ticket #{submittedTicket.id} a été transmis à l'équipe de modération
            </h3>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Un accusé de réception a été envoyé à <strong>{formData.email}</strong>. Un tuteur ou administrateur de votre campus ({formData.university}) traitera votre signalement sous 2 heures ouvrées.
            </p>
          </div>

          {/* Ticket Details Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Réf. Ticket :</span>
              <strong className="text-indigo-600 dark:text-indigo-400">
                #{submittedTicket.id}
              </strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Objet :</span>
              <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {submittedTicket.subject}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Catégorie :</span>
              <span className="text-slate-700 dark:text-slate-300">
                {submittedTicket.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Délai estimé :</span>
              <span className="text-emerald-600 font-bold">
                &lt; 2h (Campus Ngoa-Ekellé)
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Envoyer une autre demande
            </button>
          </div>
        </div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/50">
              <ShieldAlert size={14} className="text-rose-600" />
              <span>Assistance Directe & Signalement de Bug</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100">
              Créer un Ticket de Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Une anomalie sur le compilateur, un souci de validation de paiement MoMo/OM ou un document non conforme ? Décrivez précisément votre problème.
            </p>
          </div>

          {/* User & University Summary Line */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nom complet :
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email universitaire :
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Université d'attache :
              </label>
              <input
                type="text"
                name="university"
                readOnly
                value={formData.university}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Category & Priority Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catégorie de la requête *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                {TICKET_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Niveau d'Urgence *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                {TICKET_PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Sujet de votre demande *
            </label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Ex : Erreur de compilation sur malloc() en C / Échec de débit Orange Money..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Detailed Message Textarea */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message détaillé *
            </label>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Expliquez les étapes ayant mené au problème, le message d'erreur éventuel ou la référence du cours concerné..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* File Attachment Dropzone Simulation */}
          <div className="space-y-2">
            <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Pièce jointe ou capture d'écran (Optionnel) :
            </span>

            {attachment ? (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <FileText size={16} className="text-indigo-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {attachment.name}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    ({attachment.size})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                <Paperclip size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cliquez pour joindre une capture d'écran ou un PDF (PNG, JPG, PDF, max 10 Mo)
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Transmission à l'équipe de modération...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Envoyer mon ticket de support</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
