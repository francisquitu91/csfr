import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Heart, Users, TrendingUp, Globe } from 'lucide-react';

interface EducadoresSectionProps {
  onBack: () => void;
}

const EducadoresSection: React.FC<EducadoresSectionProps> = ({ onBack }) => {
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
            Educadores
          </h1>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('perfil-educador')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-600 flex-shrink-0"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Perfil del Educador</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className={`relative h-[600px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/021/553/488/non_2x/illustration-with-kids-and-teacher-in-a-classroom-education-illustration-interior-teacher-with-pupils-in-a-classroom-primary-school-kids-children-listen-to-teacher-vector.jpg"
          alt="Educadores del Colegio Sagrada Familia"
          className="w-full h-full object-cover object-top"
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
        {/* Perfil del Educador Section */}
        <div id="perfil-educador" className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Perfil del Educador</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Nuestros educadores son agentes de cambio que educan desde el vínculo y el testimonio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start space-x-3 mb-3">
                <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Compromiso Pedagógico</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Despiertan la curiosidad y educan orgánicamente, integrando los valores del colegio en cada disciplina.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-start space-x-3 mb-3">
                <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Vínculos Significativos</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Crean atmósferas de confianza, libertad y respeto, abordando la enseñanza como un servicio desinteresado.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 border-l-4 border-green-600">
              <div className="flex items-start space-x-3 mb-3">
                <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Autoeducación Constante</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Se comprometen con su desarrollo profesional y espiritual, manteniéndose en constante reflexión y aprendizaje.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border-l-4 border-orange-600">
              <div className="flex items-start space-x-3 mb-3">
                <Globe className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Puente con el Mundo</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Actúan como mediadores que ayudan a los alumnos a discernir la realidad y comprometerse con la misión de la Iglesia y la sociedad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducadoresSection;
