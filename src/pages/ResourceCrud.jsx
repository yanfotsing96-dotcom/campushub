import NationalResourcesSection from '../components/resources/NationalResourcesSection';
import { useAuth } from '../hooks/useAuth';

/**
 * Page "Ressources Nationales"
 * Cloisonnement strict selon l'architecture MINESUP Cameroun :
 * Université -> Faculté / Grande École -> Filière -> Niveau Exact.
 * Design moderne aux tons beige/crème (#F7F5F0, #EFECE6, #E3DEC9, accents #5C4033)
 * avec panneau de contrôle interactif pour tester en direct le filtrage dynamique.
 */
export default function ResourceCrud() {
  const { user } = useAuth();

  const initialProfile = user
    ? {
        universityId: user.universityId || 'UY1',
        facultyId:
          user.facultyId ||
          (user.filiere === 'Médecine Générale'
            ? 'FMSB'
            : user.filiere === 'Génie Civil'
            ? 'IUT'
            : user.filiere === 'Droit Privé'
            ? 'FSJP'
            : user.filiere === 'English'
            ? 'FA'
            : 'FS'),
        filiereId: user.filiereLabel || user.filiere || user.filiereId || 'Informatique',
        niveau: user.niveau || 'L2',
      }
    : undefined;

  const profileKey = initialProfile
    ? `${initialProfile.universityId}-${initialProfile.facultyId}-${initialProfile.filiereId}-${initialProfile.niveau}`
    : 'default';

  return <NationalResourcesSection key={profileKey} initialProfile={initialProfile} />;
}
