import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-dark-800 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg transform -rotate-3"></div>
            <div className="relative bg-primary-400 rounded-lg p-1">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800"
                alt="Professional"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              O Futuro do Código: Desenvolvendo com IA
            </h1>
            
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">
                Bem-vindo ao espaço onde a lógica de programação encontra o potencial ilimitado da Inteligência Artificial. Este blog é dedicado a desenvolvedores que desejam elevar seu nível profissional, explorando como as ferramentas de IA estão transformando a maneira como escrevemos, testamos e implantamos software.
              </p>
              
              <div className="space-y-3 text-base">
                <p className="font-semibold text-white">O que você encontrará aqui:</p>
                
                <p>
                  <span className="font-medium text-primary-400">Aceleração de Workflow:</span> Tutoriais práticos sobre como usar assistentes de código para aumentar a produtividade diária.
                </p>
                
                <p>
                  <span className="font-medium text-primary-400">Arquitetura e IA:</span> Discussões sobre como integrar modelos de linguagem e APIs inteligentes em sistemas robustos.
                </p>
                
                <p>
                  <span className="font-medium text-primary-400">Novas Fronteiras:</span> Análises sobre o impacto da IA generativa em linguagens modernas e frameworks populares.
                </p>
                
                <p>
                  <span className="font-medium text-primary-400">Desafios Reais:</span> Reflexões sobre ética, segurança e a evolução do papel do desenvolvedor no mercado atual.
                </p>
              </div>
              
              <p className="text-lg font-light italic pt-2">
                Não estamos apenas escrevendo código; estamos projetando o amanhã. Explore nossos artigos e descubra como dominar as ferramentas que estão redefinindo a engenharia de software.
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/posts"
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-all transform hover:scale-105"
              >
                Explorar Artigos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
