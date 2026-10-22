/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CAMEROON_UNIVERSITIES } from '../constants/academicConstants';
import { normalizeRole, ROLE_LABELS } from '../constants/rbacConstants';
import { useAuth } from './AuthContext';

const CampusHubContext = createContext(null);
const CampusToastContext = createContext(null);

export function useCampusToast() {
  const context = useContext(CampusToastContext);
  return context || { toastNotification: null, clearToast: () => {} };
}

const STORAGE_KEY_PRO = 'campushub_user_is_pro';
const STORAGE_KEY_SUB = 'campushub_pro_subscription';
const STORAGE_KEY_XP = 'campushub_student_xp';
const STORAGE_KEY_ROLE = 'campushub_user_role';
const STORAGE_KEY_UNI = 'campushub_selected_university';

export function CampusHubProvider({ children }) {
  const auth = useAuth();
  const authUser = auth?.user;

  // National University Selection: explicit override or fallback to authUser university or default
  const [universityOverride, setUniversityOverride] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_UNI) || null;
    } catch {
      return null;
    }
  });

  const selectedUniversityId = universityOverride || authUser?.universityId || 'UY1';

  // Pro Status State
  const [localIsPro, setLocalIsPro] = useState(() => {
    try {
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

  // Academic Role
  const [localUserRole, setLocalUserRole] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE) || 'Étudiant';
      return ROLE_LABELS[normalizeRole(saved)] || 'Étudiant';
    } catch {
      return 'Étudiant';
    }
  });

  // Derived effective values directly from AuthContext
  const isPro = authUser?.isPro !== undefined ? authUser.isPro : localIsPro;
  const userRole = authUser?.roleLabel || localUserRole;

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

  // Synchronize with global custom events dispatched from Registration or Profile updates
  useEffect(() => {
    const handleAuthChange = (e) => {
      if (e.detail?.universityId) {
        setUniversityOverride(e.detail.universityId);
      }
    };
    const handleUniChange = (e) => {
      if (e.detail?.universityId) {
        setUniversityOverride(e.detail.universityId);
      }
    };
    window.addEventListener('campushub:auth_changed', handleAuthChange);
    window.addEventListener('campushub:university_changed', handleUniChange);
    return () => {
      window.removeEventListener('campushub:auth_changed', handleAuthChange);
      window.removeEventListener('campushub:university_changed', handleUniChange);
    };
  }, []);

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

  // Trigger Toast
  const triggerToast = useCallback(({ title, message, type = 'info' }) => {
    setToastNotification({ id: Date.now(), title, message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  }, []);

  // Switch University with two-way profile synchronization
  const setUniversity = useCallback((uniId) => {
    setUniversityOverride(uniId);
    const targetUni =
      uniId === 'ALL'
        ? { id: 'ALL', name: 'Réseau National Universitaire du Cameroun', shortName: 'Toutes les universités' }
        : CAMEROON_UNIVERSITIES.find((u) => u.id === uniId);

    if (auth?.updateProfile && uniId !== 'ALL' && authUser?.universityId !== uniId) {
      auth.updateProfile({
        universityId: uniId,
        universityName: targetUni?.name,
        universityShortName: targetUni?.shortName,
      });
    }

    triggerToast({
      title: 'Établissement actualisé 🇨🇲',
      message: `Votre espace d'étude est désormais configuré pour : ${
        targetUni?.shortName || uniId
      }.`,
      type: 'info',
    });
  }, [auth, authUser?.universityId, triggerToast]);

  // Activate Pro Membership
  const activatePro = useCallback((planDetails) => {
    const sub = {
      plan: planDetails?.name || 'Plan Étudiant Pro',
      planId: planDetails?.id || 'pro',
      billingCycle: planDetails?.billingCycle || 'monthly',
      activatedAt: new Date().toISOString(),
      badge: 'Membre Pro Certifié UY1',
    };
    setLocalIsPro(true);
    setSubscription(sub);
    if (auth?.updateProfile) {
      auth.updateProfile({ isPro: true });
    }
    triggerToast({
      title: 'Abonnement CampusHub Pro Activé !',
      message: 'Félicitations ! Vous bénéficiez désormais de l\'accès illimité au Playground et à l\'IA.',
      type: 'success',
    });
  }, [auth, triggerToast]);

  // Cancel / Reset Pro
  const cancelPro = useCallback(() => {
    setLocalIsPro(false);
    setSubscription(null);
    if (auth?.updateProfile) {
      auth.updateProfile({ isPro: false });
    }
    triggerToast({
      title: 'Abonnement Pro Réinitialisé',
      message: 'Votre compte est revenu au forfait Standard.',
      type: 'info',
    });
  }, [auth, triggerToast]);

  // Switch Role
  const switchRole = useCallback((newRole) => {
    const label = ROLE_LABELS[normalizeRole(newRole)] || newRole;
    setLocalUserRole(label);
    if (auth?.switchRole) {
      auth.switchRole(newRole);
    }
    triggerToast({
      title: `Rôle mis à jour : ${label}`,
      message: `Vos privilèges sur CampusHub ont été ajustés en mode ${label}.`,
      type: 'info',
    });
  }, [auth, triggerToast]);

  // Award XP
  const earnXp = useCallback((amount, reason) => {
    setXp((prev) => prev + amount);
    triggerToast({
      title: `+${amount} XP Gagnés !`,
      message: reason || 'Action méritoire validée sur la plateforme.',
      type: 'xp',
    });
  }, [triggerToast]);

  // Calculated Level from XP
  const currentLevel = Math.floor(xp / 500) + 1;
  const nextLevelXp = currentLevel * 500;
  const progressPercent = Math.min(100, Math.round(((xp % 500) / 500) * 100));

  // Feature Permissions & Quotas
  const effectiveRole = authUser?.roleLabel || userRole;
  const permissions = useMemo(() => {
    return {
      isPro,
      canAccessAdmin: effectiveRole === 'Administrateur' || effectiveRole === 'Modérateur',
      isDelegate: effectiveRole === 'Délégué',
      isTeacher: effectiveRole === 'Enseignant',
      playgroundRunsLimit: isPro ? Infinity : 10,
      aiSummariesLimit: isPro ? Infinity : 3,
      storageLimitGB: isPro ? 15 : 0.05,
      hasAntiPlagiarismFullAudit: isPro,
    };
  }, [isPro, effectiveRole]);

  const studentName = authUser?.fullName || authUser?.nom || authUser?.name || 'Étudiant';
  const studentMatricule = authUser?.matricule || '';
  const studentStatus = authUser?.status || (isPro ? 'Étudiant Pro' : effectiveRole);
  const userFiliere = authUser?.filiereLabel || authUser?.filiere || 'Informatique';
  const userFiliereId = authUser?.filiereId || 'inf';
  const userFaculty = authUser?.faculty || selectedUniversity.faculties?.[0] || 'Faculté des Sciences (FS)';
  const userFacultyId = authUser?.facultyId || 'UY1_FS';
  const userNiveau = authUser?.niveau || 'L2';

  const student = useMemo(() => {
    const uniId = selectedUniversity.id;
    const uniName = selectedUniversity.name;
    const uniShort = selectedUniversity.shortName;

    return {
      fullName: studentName,
      name: studentName,
      nom: studentName,
      matricule: studentMatricule,
      status: studentStatus,
      nationalId: authUser?.nationalId || `CM-${uniId}-${studentMatricule || '0000'}`,
      filiere: userFiliere,
      filiereId: userFiliereId,
      filiereLabel: userFiliere,
      niveau: userNiveau,
      faculty: userFaculty,
      facultyId: userFacultyId,
      universityId: uniId,
      universityName: uniName,
      universityShortName: uniShort,
      universityCity: selectedUniversity.city,
      department: `${uniShort} · ${userFaculty} · ${userFiliere}`,
      email: authUser?.email || '',
      avatar: authUser?.avatar || null,
      role: effectiveRole,
      isPro,
      xp,
      currentLevel,
      nextLevelXp,
      progressPercent,
      subscription,
    };
  }, [
    studentName,
    studentMatricule,
    studentStatus,
    authUser?.nationalId,
    authUser?.avatar,
    userNiveau,
    userFaculty,
    userFacultyId,
    userFiliere,
    userFiliereId,
    authUser?.email,
    selectedUniversity,
    effectiveRole,
    isPro,
    xp,
    currentLevel,
    nextLevelXp,
    progressPercent,
    subscription,
  ]);

  const clearToast = useCallback(() => {
    setToastNotification(null);
  }, []);

  const toastValue = useMemo(() => {
    return {
      toastNotification,
      clearToast,
    };
  }, [toastNotification, clearToast]);

  const contextValue = useMemo(() => {
    return {
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
      clearToast,
    };
  }, [
    student,
    selectedUniversity,
    selectedUniversityId,
    setUniversity,
    permissions,
    activatePro,
    cancelPro,
    switchRole,
    earnXp,
    triggerToast,
    clearToast,
  ]);

  return (
    <CampusHubContext.Provider value={contextValue}>
      <CampusToastContext.Provider value={toastValue}>
        {children}
      </CampusToastContext.Provider>
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
