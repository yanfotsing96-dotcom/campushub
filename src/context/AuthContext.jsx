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
    const matricule = saved?.matricule || '23S40192';
    const universityId = saved?.universityId || 'UY1';

    return {
      ...saved,
      matricule,
      filiere: saved?.filiere || 'Informatique',
      filiereId,
      niveau,
      universityId,
      role: norm,
      roleNormalized: norm,
      roleLabel: ROLE_LABELS[norm],
      scope: {
        filiereId,
        niveau,
        matricule,
        universityId,
        isFullAccess: norm === ROLES.ADMIN,
      },
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Sync to storage
  useEffect(() => {
    if (user) {
      storageService.set(STORAGE_KEYS.AUTH_USER, user);
    }
  }, [user]);

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
      const updated = {
        ...prev,
        role: norm,
        roleNormalized: norm,
        roleLabel: ROLE_LABELS[norm],
        scope: {
          ...prev.scope,
          isFullAccess: norm === ROLES.ADMIN,
        },
      };
      storageService.set(STORAGE_KEYS.AUTH_USER, updated);
      try {
        localStorage.setItem('campushub_user_role', ROLE_LABELS[norm]);
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
  const login = (email, requestedRole, requestedFiliere, requestedNiveau) => {
    const existing = storageService.get(STORAGE_KEYS.AUTH_USER, DEFAULT_USER);
    const targetRole = requestedRole ? normalizeRole(requestedRole) : normalizeRole(existing.role);
    const filiereId = requestedFiliere || existing.filiereId || existing.filiere || 'Informatique';
    const niveau = requestedNiveau || existing.niveau || 'L2';
    const matricule = existing.matricule || '23S40192';

    const updated = {
      ...existing,
      email: email || existing.email,
      matricule,
      filiere: filiereId,
      filiereId,
      niveau,
      role: targetRole,
      roleNormalized: targetRole,
      roleLabel: ROLE_LABELS[targetRole],
      scope: {
        filiereId,
        niveau,
        matricule,
        universityId: existing.universityId || 'UY1',
        isFullAccess: targetRole === ROLES.ADMIN,
      },
    };
    setUser(updated);
    setIsAuthenticated(true);
    storageService.set(STORAGE_KEYS.AUTH_USER, updated);
    return { user: updated, redirectPath: getDashboardRouteForRole(targetRole) };
  };

  // Register New User with mandatory fields & passcode validation for sensitive roles
  const register = (formData) => {
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

    const newUser = {
      id: 'usr_' + Date.now(),
      nom: nomComplet,
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
      avatar: formData.photo ? URL.createObjectURL(formData.photo) : null,
      badges: ['🚀 Nouvel Arrivant', '📚 CampusHub Cameroun', `🎓 Filière ${filiereId}`],
      role: targetRole,
      roleNormalized: targetRole,
      roleLabel: ROLE_LABELS[targetRole],
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
    setUser(newUser);
    setIsAuthenticated(true);
    storageService.set(STORAGE_KEYS.AUTH_USER, newUser);
    return { user: newUser, redirectPath: getDashboardRouteForRole(targetRole) };
  };

  const updateProfile = (partialUpdates) => {
    setUser((prev) => {
      const targetRole = partialUpdates.role ? normalizeRole(partialUpdates.role) : prev.role;
      const updated = {
        ...prev,
        ...partialUpdates,
        role: targetRole,
        roleNormalized: targetRole,
        roleLabel: ROLE_LABELS[targetRole],
      };
      storageService.set(STORAGE_KEYS.AUTH_USER, updated);
      return updated;
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
        getDashboardRoute: () => getDashboardRouteForRole(currentRole),
        demoProfiles: DEMO_PROFILES,
      }}
    >
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
