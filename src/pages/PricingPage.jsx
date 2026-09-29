import { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import PricingPlans from '../components/pricing/PricingPlans';
import CheckoutModal from '../components/pricing/CheckoutModal';

export default function PricingPage() {
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [checkoutBillingCycle, setCheckoutBillingCycle] = useState('monthly');

  const [isUserPro, setIsUserPro] = useState(() => {
    try {
      return localStorage.getItem('campushub_user_is_pro') === 'true';
    } catch {
      return false;
    }
  });

  const [subscriptionDetails, setSubscriptionDetails] = useState(() => {
    try {
      const sub = localStorage.getItem('campushub_pro_subscription');
      return sub ? JSON.parse(sub) : null;
    } catch {
      return null;
    }
  });

  const handleSelectPlan = (plan, billingCycle) => {
    setSelectedPlanForCheckout(plan);
    setCheckoutBillingCycle(billingCycle);
  };

  const handlePaymentSuccess = () => {
    try {
      const isPro = localStorage.getItem('campushub_user_is_pro') === 'true';
      setIsUserPro(isPro);
      const sub = localStorage.getItem('campushub_pro_subscription');
      if (sub) setSubscriptionDetails(JSON.parse(sub));
    } catch {
      setIsUserPro(true);
    }
  };

  // Reset Pro simulation for testing
  const handleResetPro = () => {
    localStorage.removeItem('campushub_user_is_pro');
    localStorage.removeItem('campushub_pro_subscription');
    setIsUserPro(false);
    setSubscriptionDetails(null);
  };

  return (
    <div className="page-content py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Stripe-style Hero Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
          <Crown size={14} className="text-amber-500" />
          <span>Module 10 · Tarification & CampusHub Pro</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          L'excellence académique à portée de main
        </h1>

        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Débloquez la pleine puissance de l'Université de Yaoundé I : exécutions illimitées sur le Playground C/Python, résumés IA d'examens, espace hors-ligne de 15 Go et badge de certification officiel.
        </p>
      </div>

      {/* Pro User Active Banner (If already subscribed) */}
      {isUserPro && (
        <div className="max-w-4xl mx-auto p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Votre abonnement Étudiant Pro est actif
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Membre Pro UY1
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Formule : {subscriptionDetails?.plan || 'Plan Étudiant Pro'} ({subscriptionDetails?.billingCycle === 'semester' ? 'Semestriel' : 'Mensuel'}) · Quotas illimités actifs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetPro}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
            title="Réinitialiser pour simuler un nouveau paiement"
          >
            <RotateCcw size={13} />
            <span>Réinitialiser simulation</span>
          </button>
        </div>
      )}

      {/* Pricing Plans & Features */}
      <PricingPlans
        isUserPro={isUserPro}
        onSelectPlan={handleSelectPlan}
      />

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          plan={selectedPlanForCheckout}
          billingCycle={checkoutBillingCycle}
          onClose={() => setSelectedPlanForCheckout(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
