/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CAMEROON_UNIVERSITIES } from '../constants/academicConstants';
import { normalizeRole, ROLE_LABELS } from '../constants/rbacConstants';
import { useAuth } from './AuthContext';

const CampusHubContext = createContext(null);

const STORAGE_KEY_PRO = 'campushub_user_is_pro';
const STORAGE_KEY_SUB = 'campushub_pro_subscription';
const STORAGE_KEY_XP = 'campushub_student_xp';
const STORAGE_KEY_ROLE = 'campushub_user_role';
const STORAGE_KEY_UNI = 'campushub_selected_university';

export function CampusHubProvider({ children }) {
  const auth = useAuth();
  const authUser = auth?.user;

  // National University Selection: 'ALL' or specific university ID ('UY1', 'ENSPY', 'UDO', etc.)
  const [selectedUniversityId, setSelectedUniversityId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_UNI) || 'UY1';
    } catch {
      return 'UY1';
    }
  });

  // Pro Status State
  const [isPro, setIsPro] = useState(() => {
    try {
      if (authUser?.isPro !== undefined) return authUser.isPro;
      return localStorage.getItem(STORAGE_KEY_PRO) === 'true';
    } catch {
      return true;
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

  // Academic Role: 'Étudiant' | 'Délégué' | 'Modérateur' | 'Administrateur'
  const [userRole, setUserRole] = useState(() => {
    try {
      if (authUser?.roleLabel) return authUser.roleLabel;
      const saved = localStorage.getItem(STORAGE_KEY_ROLE) || 'Étudiant';
      return ROLE_LABELS[normalizeRole(saved)] || 'Étudiant';
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
      localStorage.setItem(STORAGE_KEY_UNI, selectedUniversityId);
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
  }, [selectedUniversityId, isPro, subscription, userRole, xp]);

  // Selected University Object
  const selectedUniversity = useMemo(() => {
    if (selectedUniversityId === 'ALL') {
      return {
        id: 'ALL',
        code: 'CAMEROUN',
        name: 'Réseau National Universitaire du Cameroun',
        shortName: 'Toutes Universités',
        type: 'Consortium Académique National',
        city: 'National',
        region: 'Cameroun',
        badgeColor: '#10b981',
        isFlagship: true,
      };
    }
    return (
      CAMEROON_UNIVERSITIES.find((u) => u.id === selectedUniversityId) ||
      CAMEROON_UNIVERSITIES[0]
    );
  }, [selectedUniversityId]);

  // Switch University
  const setUniversity = (uniId) => {
    setSelectedUniversityId(uniId);
    const targetUni =
      uniId === 'ALL'
        ? { shortName: 'Toutes les universités du Cameroun' }
        : CAMEROON_UNIVERSITIES.find((u) => u.id === uniId);

    triggerToast({
      title: 'Établissement actualisé 🇨🇲',
      message: `Votre espace d'étude est désormais configuré pour : ${
        targetUni?.shortName || uniId
      }.`,
      type: 'info',
    });
  };

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
    const label = ROLE_LABELS[normalizeRole(newRole)] || newRole;
    setUserRole(label);
    if (auth?.switchRole) {
      auth.switchRole(newRole);
    }
    triggerToast({
      title: `Rôle mis à jour : ${label}`,
      message: `Vos privilèges sur CampusHub ont été ajustés en mode ${label}.`,
      type: 'info',
    });
  };

  // Award XP
  const earnXp = (amount, reason) => {
    setXp((prev) => prev + amount);
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
  const effectiveRole = authUser?.roleLabel || userRole;
  const permissions = {
    isPro,
    canAccessAdmin: effectiveRole === 'Administrateur' || effectiveRole === 'Modérateur',
    isDelegate: effectiveRole === 'Délégué',
    isTeacher: effectiveRole === 'Enseignant',
    playgroundRunsLimit: isPro ? Infinity : 10,
    aiSummariesLimit: isPro ? Infinity : 3,
    storageLimitGB: isPro ? 15 : 0.05,
    hasAntiPlagiarismFullAudit: isPro,
  };

  const studentName = authUser?.fullName || authUser?.nom || authUser?.name || 'Yan Fotsing';
  const studentMatricule = authUser?.matricule || '23S40192';
  const studentStatus = authUser?.status || (isPro ? 'Étudiant Pro' : effectiveRole);

  const student = {
    fullName: studentName,
    name: studentName,
    matricule: studentMatricule,
    status: studentStatus,
    nationalId: authUser?.nationalId || 'CM-UY1-2026-0492',
    filiere: authUser?.filiere || 'Informatique & Génie Logiciel',
    niveau: authUser?.niveau || 'Licence 2',
    universityId: selectedUniversity.id,
    universityName: selectedUniversity.name,
    universityShortName: selectedUniversity.shortName,
    universityCity: selectedUniversity.city,
    department: `${selectedUniversity.shortName} · Département Informatique`,
    email: authUser?.email || 'yanfotsing96@gmail.com',
    role: effectiveRole,
    isPro,
    xp,
    currentLevel,
    nextLevelXp,
    progressPercent,
    subscription,
  };

  return (
    <CampusHubContext.Provider
      value={{
        // Student Info
        student,
        selectedUniversity,
        selectedUniversityId,
        setUniversity,
        allUniversities: CAMEROON_UNIVERSITIES,
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
