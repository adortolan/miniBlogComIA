import { useAuthContext } from '../contexts/AuthContext';

const AdminPanel = () => {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-dark-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Painel Administrativo
        </h1>
        
        <div className="bg-dark-700 p-6 rounded-lg border border-dark-600 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-900/30 rounded-lg">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Área Restrita</h2>
              <p className="text-gray-400 text-sm">Apenas administradores têm acesso</p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">
            Olá, <span className="text-primary-400 font-semibold">{user?.displayName || user?.email}</span>! 
            Você está acessando o painel administrativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-700 p-6 rounded-lg border border-dark-600">
            <h3 className="text-lg font-semibold text-white mb-2">Gerenciar Posts</h3>
            <p className="text-gray-400 text-sm">Criar, editar ou excluir posts do blog</p>
          </div>
          
          <div className="bg-dark-700 p-6 rounded-lg border border-dark-600">
            <h3 className="text-lg font-semibold text-white mb-2">Gerenciar Usuários</h3>
            <p className="text-gray-400 text-sm">Visualizar e gerenciar usuários cadastrados</p>
          </div>
          
          <div className="bg-dark-700 p-6 rounded-lg border border-dark-600">
            <h3 className="text-lg font-semibold text-white mb-2">Estatísticas</h3>
            <p className="text-gray-400 text-sm">Ver métricas e analytics do blog</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
