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
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-400">MiniBlog</span>
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/criar-post"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Criar Post
                </Link>
                
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Dashboard
                </Link>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    Olá, {user?.displayName || user?.email?.split('@')[0]}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="px-5 py-2 bg-transparent border border-white text-white rounded-md hover:bg-white hover:text-dark-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {loading ? 'Saindo...' : 'Sair'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Entrar
                </Link>
                
                <Link
                  to="/registro"
                  className="px-5 py-2 bg-transparent border border-white text-white rounded-md hover:bg-white hover:text-dark-800 transition-all text-sm font-medium"
                >
                  Explorar artigos
                </Link>
              </>
            )}
            
            <button className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
