/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CampusHubContext = createContext(null);

const STORAGE_KEY_PRO = 'campushub_user_is_pro';
const STORAGE_KEY_SUB = 'campushub_pro_subscription';
const STORAGE_KEY_XP = 'campushub_student_xp';
const STORAGE_KEY_ROLE = 'campushub_user_role';

export function CampusHubProvider({ children }) {
  // Pro Status State
  const [isPro, setIsPro] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PRO) === 'true';
    } catch {
      return false;
    }
  });

  // Subscription Details
  const [subscription, setSubscription] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUB);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Academic Role: 'Étudiant' | 'Délégué' | 'Modérateur' | 'Enseignant' | 'Administrateur'
  const [userRole, setUserRole] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ROLE) || 'Étudiant';
    } catch {
      return 'Étudiant';
    }
  });

  // Student Gamification XP
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_XP);
      return saved ? Number(saved) : 3450;
    } catch {
      return 3450;
    }
  });

  // Global Toast Notification
  const [toastNotification, setToastNotification] = useState(null);

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRO, isPro ? 'true' : 'false');
      if (subscription) {
        localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(subscription));
      } else {
        localStorage.removeItem(STORAGE_KEY_SUB);
      }
      localStorage.setItem(STORAGE_KEY_ROLE, userRole);
      localStorage.setItem(STORAGE_KEY_XP, String(xp));
    } catch (err) {
      console.warn('Erreur synchronisation CampusHubContext :', err);
    }
  }, [isPro, subscription, userRole, xp]);

  // Activate Pro Membership
  const activatePro = (planDetails) => {
    const sub = {
      plan: planDetails?.name || 'Plan Étudiant Pro',
      planId: planDetails?.id || 'pro',
      billingCycle: planDetails?.billingCycle || 'monthly',
      activatedAt: new Date().toISOString(),
      badge: 'Membre Pro Certifié UY1',
    };
    setIsPro(true);
    setSubscription(sub);
    triggerToast({
      title: 'Abonnement CampusHub Pro Activé !',
      message: 'Félicitations ! Vous bénéficiez désormais de l\'accès illimité au Playground et à l\'IA.',
      type: 'success',
    });
  };

  // Cancel / Reset Pro
  const cancelPro = () => {
    setIsPro(false);
    setSubscription(null);
    triggerToast({
      title: 'Abonnement Pro Réinitialisé',
      message: 'Votre compte est revenu au forfait Standard.',
      type: 'info',
    });
  };

  // Switch Role
  const switchRole = (newRole) => {
    setUserRole(newRole);
    triggerToast({
      title: `Rôle mis à jour : ${newRole}`,
      message: `Vos privilèges sur CampusHub ont été ajustés en mode ${newRole}.`,
      type: 'info',
    });
  };

  // Award XP
  const earnXp = (amount, reason) => {
    setXp((prev) => {
      const next = prev + amount;
      return next;
    });
    triggerToast({
      title: `+${amount} XP Gagnés !`,
      message: reason || 'Action méritoire validée sur la plateforme.',
      type: 'xp',
    });
  };

  // Trigger Toast
  const triggerToast = ({ title, message, type = 'info' }) => {
    setToastNotification({ id: Date.now(), title, message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Calculated Level from XP
  const currentLevel = Math.floor(xp / 500) + 1;
  const nextLevelXp = currentLevel * 500;
  const progressPercent = Math.min(100, Math.round(((xp % 500) / 500) * 100));

  // Feature Permissions & Quotas
  const permissions = {
    isPro,
    canAccessAdmin: userRole === 'Administrateur' || userRole === 'Modérateur',
    isDelegate: userRole === 'Délégué',
    isTeacher: userRole === 'Enseignant',
    playgroundRunsLimit: isPro ? Infinity : 10,
    aiSummariesLimit: isPro ? Infinity : 3,
    storageLimitGB: isPro ? 15 : 0.05,
    hasAntiPlagiarismFullAudit: isPro,
  };

  return (
    <CampusHubContext.Provider
      value={{
        // Student Info
        student: {
          name: 'Yanick Fotsing',
          matricule: '23S40192',
          filiere: 'Informatique',
          niveau: 'Licence 2',
          department: 'Faculté des Sciences · UY1',
          email: 'yanfotsing96@gmail.com',
          role: userRole,
          isPro,
          xp,
          currentLevel,
          nextLevelXp,
          progressPercent,
          subscription,
        },
        permissions,
        activatePro,
        cancelPro,
        switchRole,
        earnXp,
        triggerToast,
        toastNotification,
        clearToast: () => setToastNotification(null),
      }}
    >
      {children}
    </CampusHubContext.Provider>
  );
}

export function useCampusHub() {
  const context = useContext(CampusHubContext);
  if (!context) {
    throw new Error('useCampusHub must be used within a CampusHubProvider');
  }
  return context;
}
