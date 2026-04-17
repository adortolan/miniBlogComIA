import { useAuthContext } from '../contexts/AuthContext';

const AuthStatus = () => {
  const { user, loading, isAuthenticated } = useAuthContext();

  if (loading) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">🔄 Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded border ${isAuthenticated ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-400'}`}>
      <h2 className="font-bold mb-2">Status de Autenticação</h2>
      {isAuthenticated ? (
        <div className="text-green-700">
          <p>✅ Usuário autenticado</p>
          <p className="mt-1">Email: {user.email}</p>
          <p>UID: {user.uid}</p>
        </div>
      ) : (
        <p className="text-gray-700">❌ Nenhum usuário autenticado</p>
      )}
    </div>
  );
};

export default AuthStatus;
