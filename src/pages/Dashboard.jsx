import { useAuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-dark-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Dashboard
        </h1>
        
        <div className="bg-dark-700 p-6 rounded-lg border border-dark-600">
          <p className="text-gray-300 mb-4">
            Bem-vindo(a), <span className="text-primary-400 font-semibold">{user?.displayName || user?.email}</span>!
          </p>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Informações da Conta</h2>
              <ul className="space-y-2 text-gray-400">
                <li><strong className="text-gray-300">Email:</strong> {user?.email}</li>
                <li><strong className="text-gray-300">Nome:</strong> {user?.displayName || 'Não informado'}</li>
                <li><strong className="text-gray-300">ID:</strong> {user?.uid}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
