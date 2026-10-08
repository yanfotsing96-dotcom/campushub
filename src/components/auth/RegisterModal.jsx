import { X } from 'lucide-react';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess }) {
  const { register } = useAuth();
  if (!isOpen) return null;

  const handleRegister = (formData) => {
    try {
      const res = register ? register(formData) : null;
      if (onRegisterSuccess) {
        onRegisterSuccess(res?.user || formData);
      }
    } catch (e) {
      console.warn('Registration failed:', e);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl p-2 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Fermer"
        >
          <X size={18} />
        </button>

        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  );
}
