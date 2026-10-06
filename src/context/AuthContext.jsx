/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS, DEFAULT_USER } from '../constants/academicConstants';
import {
  ROLES,
  ROLE_LABELS,
  normalizeRole,
  hasPermission,
  isRoleAtLeast,
  getDashboardRouteForRole,
  DEMO_PROFILES,
  ROLE_PASSCODE_HINTS,
  verifyRolePasscode,
} from '../constants/rbacConstants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = storageService.get(STORAGE_KEYS.AUTH_USER, DEFAULT_USER);
    const norm = normalizeRole(saved?.role || ROLES.STUDENT);
    const filiereId = saved?.filiereId || saved?.filiere || 'Informatique';
    const niveau = saved?.niveau || 'L2';
    const matricule = saved?.matricule || DEFAULT_USER?.matricule || '26U1001';
    const universityId = saved?.universityId || 'UY1';
    
    // Purify dynamic name: clean up any legacy hardcoded strings
    const rawName = saved?.fullName || saved?.nom || saved?.name || DEFAULT_USER?.fullName || 'Étudiant';
    const fullName = (rawName && !rawName.includes('Yanick')) ? rawName : (DEFAULT_USER?.fullName || 'Étudiant');
    const isPro = saved?.isPro ?? true;
    
    const roleLabel = ROLE_LABELS[norm] || 'Étudiant';
    const status = saved?.status || (norm === ROLES.STUDENT && isPro ? 'Étudiant Pro' : roleLabel);

    return {
      ...saved,
      fullName,
      nom: fullName,
      name: fullName,
      status,
      matricule,
      filiere: saved?.filiere || filiereId,
      filiereId,
      niveau,
      universityId,
      isPro,
      role: norm,
      roleNormalized: norm,
      roleLabel,
      scope: {
        filiereId,
        niveau,
        matricule,
        universityId,
        isFullAccess: norm === ROLES.ADMIN,
      },
    };
  });

  const [sessionToken, setSessionToken] = useState(() => {
    try {
      return (
        storageService.get(STORAGE_KEYS.AUTH_TOKEN, null) ||
        localStorage.getItem('campushub_auth_token') ||
        null
      );
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedToken =
        storageService.get(STORAGE_KEYS.AUTH_TOKEN, null) ||
        localStorage.getItem('campushub_auth_token');
      const savedSession = storageService.get(STORAGE_KEYS.AUTH_SESSION, null);
      if (!savedToken) return false;
      if (savedSession && savedSession.expiresAt && Date.now() > savedSession.expiresAt) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  });

  // Sync to storage
  useEffect(() => {
    if (user && isAuthenticated) {
      storageService.set(STORAGE_KEYS.AUTH_USER, user);
    }
  }, [user, isAuthenticated]);

  // Normalized Role string
  const currentRole = useMemo(() => {
    return normalizeRole(user?.role || ROLES.STUDENT);
  }, [user?.role]);

  // Permission checker
  const can = useCallback(
    (permission) => {
      return hasPermission(currentRole, permission);
    },
    [currentRole]
  );

  // Role hierarchy checker
  const hasRole = useCallback(
    (requiredRole) => {
      return isRoleAtLeast(currentRole, requiredRole);
    },
    [currentRole]
  );

  // Switch role dynamically (instant reactive update across UI)
  const switchRole = useCallback((newRole) => {
    const norm = normalizeRole(newRole);
    setUser((prev) => {
      const roleLabel = ROLE_LABELS[norm] || 'Étudiant';
      const status = norm === ROLES.STUDENT && prev?.isPro ? 'Étudiant Pro' : roleLabel;
      const updated = {
        ...prev,
        role: norm,
        roleNormalized: norm,
        roleLabel,
        status,
        scope: {
          ...prev.scope,
          isFullAccess: norm === ROLES.ADMIN,
        },
      };
      storageService.set(STORAGE_KEYS.AUTH_USER, updated);
      try {
        localStorage.setItem('campushub_user_role', roleLabel);
      } catch (err) {
        console.warn('Erreur stockage role :', err);
      }
      return updated;
    });
  }, []);

  // Privilege Elevation using Secret Access Passcode
  const elevateRole = useCallback((requestedRole, enteredCode) => {
    const norm = normalizeRole(requestedRole);
    const verification = verifyRolePasscode(norm, enteredCode);
    if (!verification.valid) {
      return { success: false, error: verification.error };
    }
    switchRole(norm);
    return { success: true, role: norm, roleLabel: ROLE_LABELS[norm] };
  }, [switchRole]);

  // Quick Login (supports demo role and scope override)
  const login = useCallback(
    (email, requestedRole, requestedFiliere, requestedNiveau, requestedName, requestedMatricule) => {
      const existing = storageService.get(STORAGE_KEYS.AUTH_USER, DEFAULT_USER);
      const targetRole = requestedRole ? normalizeRole(requestedRole) : normalizeRole(existing.role);

      // Check if email or role corresponds to one of the DEMO_PROFILES
      const matchedDemo = DEMO_PROFILES.find(
        (p) =>
          (email && p.email?.toLowerCase() === email?.toLowerCase()) ||
          (requestedRole && p.role === targetRole)
      );

      const filiereId =
        requestedFiliere ||
        (matchedDemo ? matchedDemo.filiereId || matchedDemo.filiere : null) ||
        existing.filiereId ||
        existing.filiere ||
        'Informatique';

      const niveau =
        requestedNiveau ||
        (matchedDemo ? matchedDemo.niveau : null) ||
        existing.niveau ||
        'L2';

      const matricule =
        requestedMatricule ||
        (matchedDemo ? matchedDemo.matricule : null) ||
        existing.matricule ||
        '26U1001';

      const fullName =
        requestedName ||
        (matchedDemo ? matchedDemo.nom : null) ||
        existing.fullName ||
        existing.nom ||
        (email ? email.split('@')[0] : 'Étudiant');

      const roleLabel = ROLE_LABELS[targetRole] || 'Étudiant';
      const isPro = existing.isPro ?? true;
      const status = targetRole === ROLES.STUDENT && isPro ? 'Étudiant Pro' : roleLabel;

      const updated = {
        ...existing,
        email: email || (matchedDemo ? matchedDemo.email : existing.email),
        fullName,
        nom: fullName,
        name: fullName,
        status,
        matricule,
        filiere: filiereId,
        filiereId,
        niveau,
        role: targetRole,
        roleNormalized: targetRole,
        roleLabel,
        scope: {
          filiereId,
          niveau,
          matricule,
          universityId: existing.universityId || 'UY1',
          isFullAccess: targetRole === ROLES.ADMIN,
        },
      };
      const token = `ch_tok_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
      try {
        storageService.set(STORAGE_KEYS.AUTH_TOKEN, token);
        storageService.set(STORAGE_KEYS.AUTH_SESSION, {
          token,
          userId: updated.id || 'usr_' + Date.now(),
          role: targetRole,
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });
        localStorage.setItem('campushub_auth_token', token);
      } catch (e) {
        console.warn('Erreur stockage token de session :', e);
      }
      setSessionToken(token);
      setUser(updated);
      setIsAuthenticated(true);
      storageService.set(STORAGE_KEYS.AUTH_USER, updated);
      return { success: true, token, user: updated, redirectPath: getDashboardRouteForRole(targetRole) };
    },
    []
  );

  // Register New User with mandatory fields & passcode validation for sensitive roles
  const register = useCallback((formData) => {
    const targetRole = normalizeRole(formData?.role || ROLES.STUDENT);

    // Verify secret passcode if registering as Delegate or Moderator
    if (targetRole !== ROLES.STUDENT) {
      const check = verifyRolePasscode(targetRole, formData?.passcode);
      if (!check.valid) {
        throw new Error(check.error || 'Code d\'accès secret obligatoire pour ce rôle.');
      }
    }

    const filiereId = formData?.filiere || formData?.filiereId || 'Informatique';
    const niveau = formData?.niveau || 'L1';
    const matricule = formData?.matricule?.trim() || ('26U' + Math.floor(1000 + Math.random() * 9000));
    const universityId = formData?.universityId || 'UY1';
    const prenom = formData?.prenom?.trim() || '';
    const nomFamille = formData?.nom?.trim() || 'Étudiant UY1';
    const nomComplet = prenom ? `${prenom} ${nomFamille}` : nomFamille;
    const username = formData?.username?.trim() || formData?.email?.split('@')[0] || `etudiant_${Date.now()}`;
    const roleLabel = ROLE_LABELS[targetRole] || 'Étudiant';

    const newUser = {
      id: 'usr_' + Date.now(),
      fullName: nomComplet,
      nom: nomComplet,
      name: nomComplet,
      status: roleLabel,
      prenom,
      nomFamille,
      username,
      email: formData.email,
      matricule,
      filiere: filiereId,
      filiereId,
      niveau,
      universityId,
      bio: formData.bio || `Étudiant inscrit en ${filiereId} (${niveau}) sur la plateforme CampusHub Cameroun.`,
      avatar: formData.avatar || (formData.photo instanceof Blob ? URL.createObjectURL(formData.photo) : formData.photo) || null,
      adminJustification: formData.justification || null,
      badges: ['🚀 Nouvel Arrivant', '📚 CampusHub Cameroun', `🎓 Filière ${filiereId}`],
      role: targetRole,
      roleNormalized: targetRole,
      roleLabel,
      scope: {
        filiereId,
        niveau,
        matricule,
        universityId,
        isFullAccess: targetRole === ROLES.ADMIN,
      },
      stats: {
        contributions: 0,
        downloads: 0,
        favoritesCount: 0,
      },
    };
    const token = `ch_tok_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    try {
      storageService.set(STORAGE_KEYS.AUTH_TOKEN, token);
      storageService.set(STORAGE_KEYS.AUTH_SESSION, {
        token,
        userId: newUser.id,
        role: targetRole,
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      localStorage.setItem('campushub_auth_token', token);
    } catch (e) {
      console.warn('Erreur stockage token de session :', e);
    }
    setSessionToken(token);
    setUser(newUser);
    setIsAuthenticated(true);
    storageService.set(STORAGE_KEYS.AUTH_USER, newUser);
    return { success: true, token, user: newUser, redirectPath: getDashboardRouteForRole(targetRole) };
  }, []);

  const updateProfile = useCallback((partialUpdates) => {
    setUser((prev) => {
      const targetRole = partialUpdates.role ? normalizeRole(partialUpdates.role) : prev.role;
      const roleLabel = ROLE_LABELS[targetRole] || prev.roleLabel;
      const rawName = partialUpdates.fullName || partialUpdates.nom || partialUpdates.name || prev.fullName || prev.nom || '';
      const fullName = (rawName && !rawName.includes('Yanick')) ? rawName : (prev.fullName || 'Étudiant');
      const isPro = partialUpdates.isPro !== undefined ? partialUpdates.isPro : prev.isPro;
      const status = partialUpdates.status || (targetRole === ROLES.STUDENT && isPro ? 'Étudiant Pro' : roleLabel);
      const matricule = partialUpdates.matricule || prev.matricule;
      const filiereId = partialUpdates.filiere || partialUpdates.filiereId || prev.filiereId || 'Informatique';
      const niveau = partialUpdates.niveau || prev.niveau || 'L2';
      const universityId = partialUpdates.universityId || prev.universityId || 'UY1';

      const updated = {
        ...prev,
        ...partialUpdates,
        fullName,
        nom: fullName,
        name: fullName,
        status,
        matricule,
        filiere: filiereId,
        filiereId,
        niveau,
        universityId,
        isPro,
        role: targetRole,
        roleNormalized: targetRole,
        roleLabel,
        scope: {
          ...prev.scope,
          filiereId,
          niveau,
          matricule,
          universityId,
          isFullAccess: targetRole === ROLES.ADMIN,
        },
      };
      storageService.set(STORAGE_KEYS.AUTH_USER, updated);
      try {
        localStorage.setItem('campushub_user_role', roleLabel);
        localStorage.setItem('campushub_user_is_pro', isPro ? 'true' : 'false');
      } catch (err) {
        console.warn('Erreur stockage profil :', err);
      }
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    try {
      storageService.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageService.remove(STORAGE_KEYS.AUTH_SESSION);
      localStorage.removeItem('campushub_auth_token');
      localStorage.removeItem('campushub_auth_session');
    } catch (err) {
      console.warn('Erreur lors du nettoyage de session :', err);
    }
    setSessionToken(null);
    setIsAuthenticated(false);
  }, []);

  const checkSession = useCallback(() => {
    try {
      const token =
        storageService.get(STORAGE_KEYS.AUTH_TOKEN, null) ||
        localStorage.getItem('campushub_auth_token');
      const session = storageService.get(STORAGE_KEYS.AUTH_SESSION, null);
      if (!token || (session && session.expiresAt && Date.now() > session.expiresAt)) {
        logout();
        return false;
      }
      return true;
    } catch {
      logout();
      return false;
    }
  }, [logout]);

  const getDashboardRoute = useCallback(() => {
    return getDashboardRouteForRole(currentRole);
  }, [currentRole]);

  const authContextValue = useMemo(() => {
    return {
      user,
      isAuthenticated,
      token: sessionToken,
      sessionToken,
      checkSession,
      role: currentRole,
      roleLabel: ROLE_LABELS[currentRole],
      isStudent: currentRole === ROLES.STUDENT,
      isDelegate: currentRole === ROLES.DELEGATE,
      isModerator: currentRole === ROLES.MODERATOR,
      isAdmin: currentRole === ROLES.ADMIN,
      can,
      hasRole,
      switchRole,
      elevateRole,
      verifyPasscode: verifyRolePasscode,
      passcodeHints: ROLE_PASSCODE_HINTS,
      login,
      register,
      updateProfile,
      logout,
      getDashboardRoute,
      demoProfiles: DEMO_PROFILES,
    };
  }, [
    user,
    isAuthenticated,
    sessionToken,
    checkSession,
    currentRole,
    can,
    hasRole,
    switchRole,
    elevateRole,
    login,
    register,
    updateProfile,
    logout,
    getDashboardRoute,
  ]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
