import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useRegister } from '../hooks/useRegister';

const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { isAuthenticated } = useAuthContext();
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = () => {
    if (!displayName.trim()) {
      setValidationError('Nome é obrigatório');
      return false;
    }

    if (!email.trim()) {
      setValidationError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Email inválido');
      return false;
    }

    if (!password) {
      setValidationError('Senha é obrigatória');
      return false;
    }

    if (password.length < 6) {
      setValidationError('Senha deve ter no mínimo 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError('As senhas não coincidem');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await register(displayName, email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800 px-4">
      <div className="max-w-md w-full space-y-8 bg-dark-700 p-8 rounded-xl border border-dark-600">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Criar Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Registre-se para começar a usar o MiniBlog
          </p>
        </div>

        {displayError && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded relative">
            <span className="block sm:inline">{displayError}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">
                Nome
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Criando conta...' : 'Registrar'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
