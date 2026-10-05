import { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  Download,
  Crown,
  Phone,
} from 'lucide-react';
import { TEST_PAYMENT_METHODS } from './data/pricingData';
import { useAuth } from '../../hooks/useAuth';

export default function CheckoutModal({ plan, billingCycle, onClose, onSuccess }) {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('momo'); // 'momo', 'om', 'card'

  // Form Inputs
  const [phoneNumber, setPhoneNumber] = useState('677849210');
  const [studentName, setStudentName] = useState(user?.fullName || user?.nom || 'Yan Fotsing');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Payment Status: 'idle', 'processing', 'success'
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [processingStep, setProcessingStep] = useState(1);

  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.semesterPrice;
  const cycleLabel = billingCycle === 'monthly' ? 'Abonnement Mensuel' : 'Abonnement Semestriel (6 mois)';

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardExpiry(raw);
  };

  // Handle Payment Submit
  const handlePay = (e) => {
    e.preventDefault();
    setPaymentStatus('processing');
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 1000);

    setTimeout(() => {
      setProcessingStep(3);
    }, 1800);

    setTimeout(() => {
      setPaymentStatus('success');

      // Save pro status to localStorage
      try {
        const subData = {
          isPro: true,
          plan: plan.name,
          planId: plan.id,
          billingCycle,
          activatedAt: new Date().toISOString(),
          badge: 'Membre Pro Certifié UY1',
          matricule: '23S40192',
        };
        localStorage.setItem('campushub_user_is_pro', 'true');
        localStorage.setItem('campushub_pro_subscription', JSON.stringify(subData));
      } catch (err) {
        console.warn('Erreur stockage local :', err);
      }

      if (onSuccess) onSuccess();
    }, 2600);
  };

  // Download Simulated Receipt
  const handleDownloadReceipt = () => {
    const receiptText = `FACTURE & REÇU DE PAIEMENT ACADÉMIQUE
Plateforme CampusHub — Université de Yaoundé I
Date: ${new Date().toLocaleDateString()}
Réf Transaction: TX-${Date.now()}
-------------------------------------------
Client: ${studentName} (Matricule: 23S40192)
Formule: ${plan.name} (${cycleLabel})
Montant payé: ${price.toLocaleString()} FCFA
Mode de règlement: ${
      selectedMethod === 'momo'
        ? 'MTN Mobile Money (+237 ' + phoneNumber + ')'
        : selectedMethod === 'om'
        ? 'Orange Money (+237 ' + phoneNumber + ')'
        : 'Carte Bancaire Stripe (•••• ' + (cardNumber.slice(-4) || '4242') + ')'
    }
Statut: VALIDÉ & CERTIFIÉ PCI-DSS
Badge attribué: Membre Pro / Certifié UY1
-------------------------------------------
Merci pour votre confiance sur CampusHub !`;

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const dlUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = dlUrl;
    link.download = `Recu-CampusHub-Pro-${plan.id}.txt`;
    link.click();
    URL.revokeObjectURL(dlUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors z-20"
        >
          <X size={20} />
        </button>

        {paymentStatus === 'success' ? (
          /* Success Screen */
          <div className="p-8 md:p-12 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
              <CheckCircle2 size={42} strokeWidth={2.5} />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/50">
                <Crown size={14} className="text-amber-500" />
                <span>Statut Étudiant Pro Actif</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
                Félicitations {studentName} !
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Votre abonnement à <strong>{plan.name}</strong> ({cycleLabel}) est confirmé. Toutes les fonctionnalités Pro (Playground illimité, IA résumés, 15 Go de stockage) sont déverrouillées instantanément.
              </p>
            </div>

            {/* Granted Badge Preview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800 max-w-sm mx-auto flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black flex-shrink-0 shadow-md">
                <Crown size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Badge de Mérite Débloqué
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Membre Pro / Certifié UY1
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Visible sur vos commentaires & forum
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>Télécharger le reçu (.txt)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25"
              >
                Accéder à mes fonctionnalités Pro
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Split Layout (Stripe Style) */
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/70 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                    CH
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                      CampusHub Checkout
                    </h3>
                    <span className="text-[10px] text-slate-400">Université de Yaoundé I</span>
                  </div>
                </div>

                {/* Plan details */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Formule sélectionnée
                  </span>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Crown size={16} className="text-amber-500" />
                    <span>{plan.name}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {cycleLabel}
                  </div>
                </div>

                {/* Amount breakdown */}
                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Sous-total HT</span>
                    <span className="font-mono font-semibold">{price.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>TVA étudiante (Exonération)</span>
                    <span className="font-mono font-semibold text-emerald-600">0 FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-900 dark:text-slate-100 font-bold text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Net à Régler</span>
                    <span className="font-mono text-base font-black text-indigo-600 dark:text-indigo-400">
                      {price.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Security badges */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>Paiement chiffré SSL 256 bits · Passerelle PCI-DSS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-indigo-500 flex-shrink-0" />
                  <span>Garantie de remboursement étudiante sous 14 jours</span>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Form (7 cols) */}
            <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
              {paymentStatus === 'processing' ? (
                /* Processing State with Animated Steps */
                <div className="py-12 text-center space-y-6 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin mx-auto" />

                  <div className="space-y-2 max-w-sm mx-auto">
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Traitement de votre règlement en cours...
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {processingStep === 1
                        ? 'Connexion sécurisée avec l\'opérateur de paiement...'
                        : processingStep === 2
                        ? 'Validation de la transaction Mobile Money / Bancaire...'
                        : 'Attribution du badge Membre Pro et activation des quotas...'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-indigo-600">
                    <span>Étape {processingStep} sur 3</span>
                  </div>
                </div>
              ) : (
                /* Payment Form */
                <form onSubmit={handlePay} className="space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Moyen de Règlement Sécurisé
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Sélectionnez votre moyen de paiement habituel au Cameroun ou à l'international.
                    </p>
                  </div>

                  {/* Method selector pills */}
                  <div className="grid grid-cols-3 gap-2">
                    {TEST_PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMethod(m.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          selectedMethod === m.id
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {m.badge}
                        </span>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                          {m.name}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Form: Mobile Money */}
                  {(selectedMethod === 'momo' || selectedMethod === 'om') && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5 animate-in fade-in">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Phone size={14} className="text-indigo-600" />
                        <span>Numéro de compte {selectedMethod === 'momo' ? 'MTN MoMo' : 'Orange Money'}</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                            Numéro de téléphone (+237) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                              +237
                            </span>
                            <input
                              type="tel"
                              required
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder={selectedMethod === 'momo' ? '677 84 92 10' : '699 22 15 48'}
                              className="w-full pl-14 pr-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                            Nom de l'étudiant titulaire du compte *
                          </label>
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Ex : Yan Fotsing"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        💡 Une invite de confirmation USSD apparaîtra sur votre téléphone pour valider le débit de {price.toLocaleString()} FCFA avec votre code PIN secret.
                      </p>
                    </div>
                  )}

                  {/* Dynamic Form: Credit Card */}
                  {selectedMethod === 'card' && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5 animate-in fade-in">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <CreditCard size={14} className="text-indigo-600" />
                        <span>Informations de Carte Bancaire (Stripe)</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                            Numéro de carte (Visa / Mastercard) *
                          </label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4242 4242 4242 4242"
                            className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                              Expiration (MM/AA) *
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="12/28"
                              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                              CVC (3 chiffres) *
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              required
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                              placeholder="•••"
                              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 hover:scale-101"
                  >
                    <Lock size={14} />
                    <span>Payer {price.toLocaleString()} FCFA en toute sécurité</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
