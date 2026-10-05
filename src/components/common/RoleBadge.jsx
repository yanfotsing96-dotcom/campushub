import {
  Crown,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import { normalizeRole, ROLE_BADGES, ROLES } from '../../constants/rbacConstants';

const ICONS = {
  [ROLES.ADMIN]: Crown,
  [ROLES.MODERATOR]: ShieldCheck,
  [ROLES.DELEGATE]: Award,
  [ROLES.STUDENT]: BookOpen,
};

export default function RoleBadge({ role, size = 'sm', showIcon = true, className = '' }) {
  const normRole = normalizeRole(role);
  const badgeConfig = ROLE_BADGES[normRole] || ROLE_BADGES[ROLES.STUDENT];
  const Icon = ICONS[normRole] || BookOpen;

  const sizeClasses = {
    xs: 'px-1.5 py-0.2 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2 font-bold',
  }[size] || 'px-2 py-0.5 text-[10px] gap-1.5';

  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
  }[size] || 12;

  return (
    <span
      className={`inline-flex items-center font-black uppercase tracking-wider rounded-lg border transition-all ${badgeConfig.bgColor} ${badgeConfig.textColor} ${badgeConfig.borderColor} ${badgeConfig.badgeGlow} ${sizeClasses} ${className}`}
      title={badgeConfig.description}
    >
      {showIcon && <Icon size={iconSizes} className="flex-shrink-0" />}
      <span>{badgeConfig.label}</span>
    </span>
  );
}
