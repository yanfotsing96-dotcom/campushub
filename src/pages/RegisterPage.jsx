import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = (data) => {
    const userObj = data instanceof FormData ? Object.fromEntries(data.entries()) : (data || {});

    register(userObj);
    navigate('/profile');
  };

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}