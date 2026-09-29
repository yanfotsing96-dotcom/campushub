import { useState } from 'react';
import {
  Check,
  X as CloseIcon,
  Crown,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Laptop,
  Users,
} from 'lucide-react';
import { PRICING_PLANS, PRICING_FAQS } from './data/pricingData';

export default function PricingPlans({ onSelectPlan, isUserPro }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'semester'
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-12">
      {/* Billing Cycle Toggle */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Facturation Mensuelle
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('semester')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'semester'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Semestre UY1 (6 mois)</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
              -25%
            </span>
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tarifs adaptés aux étudiants de l'Université de Yaoundé I · Zéro engagement, résiliable à tout moment.
        </p>
      </div>

      {/* Pricing Cards Grid (Stripe style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => {
          const isPro = plan.id === 'pro';
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.semesterPrice;
          const periodLabel = billingCycle === 'monthly' ? '/ mois' : '/ semestre (6 mois)';

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? 'bg-gradient-to-b from-white via-indigo-50/20 to-white dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border-2 border-indigo-600 dark:border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-102 lg:-translate-y-2'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              {/* Popular Badge */}
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
                    <Crown size={12} className="text-amber-300" />
                    <span>{plan.popularBadge}</span>
                  </span>
                </div>
              )}

              <div className="space-y-5">
                {/* Plan Header */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {plan.id === 'amphi' ? (
                      <Users size={18} className="text-blue-500" />
                    ) : isPro ? (
                      <Sparkles size={18} className="text-indigo-500" />
                    ) : (
                      <Laptop size={18} className="text-slate-400" />
                    )}
                    <span>{plan.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                      {price.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {plan.currency} {periodLabel}
                    </span>
                  </div>

                  {billingCycle === 'semester' && plan.savingsSemester && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {plan.savingsSemester}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ce qui est inclus :
                  </span>
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2.5 ${
                          feat.included
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-400 dark:text-slate-600 line-through opacity-70'
                        }`}
                      >
                        {feat.included ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CloseIcon size={11} />
                          </div>
                        )}
                        <span className="leading-snug">{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                {plan.id === 'free' ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-400 font-semibold text-xs cursor-default"
                  >
                    {isUserPro ? 'Plan Inférieur' : plan.ctaText}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan, billingCycle)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                      isPro
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-102'
                        : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                    }`}
                  >
                    <Zap size={14} className={isPro ? 'text-amber-300' : ''} />
                    <span>{isUserPro && isPro ? 'Gérer mon abonnement Pro' : plan.ctaText}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600" />
            <span>Matrice Comparative Détaillée</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparez en un coup d'œil les quotas et privilèges académiques UY1.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3">Fonctionnalité</th>
                <th className="py-3 px-3 text-center">Standard (0 FCFA)</th>
                <th className="py-3 px-3 text-center text-indigo-600 dark:text-indigo-400 font-black">
                  Étudiant Pro (1 500 FCFA)
                </th>
                <th className="py-3 px-3 text-center">Pack Amphi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  Playground C & Python
                </td>
                <td className="py-3 px-3 text-center text-slate-500">10 runs / jour</td>
                <td className="py-3 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                  Illimité instantané
                </td>
                <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300">
                  Illimité partagé
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  IA Résumés & Quiz interactifs
                </td>
                <td className="py-3 px-3 text-center text-slate-500">3 résumés / semaine</td>
                <td className="py-3 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                  Générations illimitées
                </td>
                <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300">
                  Illimité groupe
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  Stockage Cache Hors-Ligne
                </td>
                <td className="py-3 px-3 text-center text-slate-500">50 Mo</td>
                <td className="py-3 px-3 text-center font-bold text-indigo-600 dark:text-indigo-400">
                  15 Go étendu
                </td>
                <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300">
                  50 Go disque amphi
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  Audit Anti-Plagiat
                </td>
                <td className="py-3 px-3 text-center text-slate-500">1 scan / mois</td>
                <td className="py-3 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                  Scans illimités
                </td>
                <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300">
                  Contrôle délégué
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  Badge Officiel sur le Profil
                </td>
                <td className="py-3 px-3 text-center text-slate-400">—</td>
                <td className="py-3 px-3 text-center font-black text-amber-500">
                  ★ Membre Pro UY1
                </td>
                <td className="py-3 px-3 text-center font-bold text-blue-500">
                  ★ Délégué Certifié
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
            <HelpCircle size={18} className="text-indigo-600" />
            <span>Foire Aux Questions · Abonnements CampusHub</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tout ce que vous devez savoir sur le paiement Mobile Money et la garantie de satisfaction.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {PRICING_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
