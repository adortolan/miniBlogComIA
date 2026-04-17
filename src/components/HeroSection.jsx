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
              Aumente a produtividade do seu negócio e conquiste qualidade de vida com o MiniBlog.
            </h1>
            
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">
                Com projetos personalizados, nossa equipe mapeia as atividades da sua organização e modela um fluxo de automação exclusivo para cada processo.
              </p>
              
              <p className="text-lg font-light">
                Uma consultoria completa com treinamento, implantação e suporte!
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/registro"
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-all transform hover:scale-105"
              >
                Fale com Especialista
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
