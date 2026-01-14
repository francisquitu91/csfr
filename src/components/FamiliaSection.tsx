import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Heart, BookOpen, HandHeart } from 'lucide-react';

interface FamiliaSectionProps {
  onBack: () => void;
}

const FamiliaSection: React.FC<FamiliaSectionProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Familias
          </h1>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('rol-familia')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-600 flex-shrink-0"
            >
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Rol de la Familia</span>
            </button>
            
            <button
              onClick={() => scrollToSection('centro-padres')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-purple-600 flex-shrink-0"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Centro de Padres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className={`relative h-[600px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="https://cdn.prod.website-files.com/6620da2d02ffa63c31d36ced/6620da2d02ffa63c31d37273_Juntos%20somos%20una%20gran%20familia%20padres%20de%20familia%20y%20escuela.png"
          alt="Familias del Colegio Sagrada Familia"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <img
              src="https://i.postimg.cc/FN3R296R/1.png"
              alt="Logo Colegio Sagrada Familia"
              className="h-28 md:h-36 w-auto mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rol de la Familia Section */}
        <div id="rol-familia" className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Rol de la Familia</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Los padres son los primeros educadores, con ellos establecemos una alianza sólida y coherente para la formación de nuestros estudiantes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start space-x-3 mb-3">
                <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Alianza Formativa</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Los padres comparten la visión cristiana y los valores de la pedagogía kentenijiana, asegurando una formación coherente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-start space-x-3 mb-3">
                <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Testimonio de Fe</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Familias que viven el Evangelio y acompañan activamente el desarrollo espiritual y valórico de sus hijos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 border-l-4 border-green-600">
              <div className="flex items-start space-x-3 mb-3">
                <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Espíritu Comunitario</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Participan activamente en la vida escolar, aportando su originalidad y promoviendo relaciones de respeto y buen trato.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border-l-4 border-orange-600">
              <div className="flex items-start space-x-3 mb-3">
                <HandHeart className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Compromiso Social</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Familias sencillas y solidarias, que educan en la templanza y la justicia para construir una nueva cultura social.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Centro de Padres Section */}
        <div id="centro-padres" className={`bg-white rounded-lg shadow-lg p-8 transition-all duration-1000 delay-200 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Centro de Padres</h2>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-8 border-l-4 border-purple-600">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              El Centro de Padres tiene un rol colaborador activo en la misión educadora del Colegio, promoviendo sus valores, el espíritu de familia y trabajando por crear un <strong>"organismo de vinculaciones"</strong> donde cada padre se sienta responsable no solo de su hijo, sino de toda la comunidad SF.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-purple-600 mb-2">Colaboración Activa</h4>
                <p className="text-gray-600 text-sm">
                  Participación en la misión educadora del colegio
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-purple-600 mb-2">Valores Compartidos</h4>
                <p className="text-gray-600 text-sm">
                  Promoción del espíritu de familia y valores institucionales
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-purple-600 mb-2">Responsabilidad Comunitaria</h4>
                <p className="text-gray-600 text-sm">
                  Compromiso con toda la comunidad educativa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamiliaSection;
