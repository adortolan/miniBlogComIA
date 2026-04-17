import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const { isAuthenticated, user } = useAuthContext();
  const { logout, loading } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">MiniBlog</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/criar-post"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Criar Post
                </Link>
                
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Olá, {user?.displayName || user?.email?.split('@')[0]}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saindo...' : 'Sair'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Entrar
                </Link>
                
                <Link
                  to="/registro"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
