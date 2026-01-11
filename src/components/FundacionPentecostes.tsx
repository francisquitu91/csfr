import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

interface FundacionPentecostesProps {
  onBack: () => void;
}

const FundacionPentecostes: React.FC<FundacionPentecostesProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Fundación Pentecostés
            </h1>
            <p className="text-lg text-gray-600">Excelencia académica y formación schoenstatiana</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with background image */}
        <div className={`relative mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://i.postimg.cc/g2xNjVJF/Diseno-sin-titulo-1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-orange-600/80 to-pink-600/80"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative px-8 py-16 md:px-12 md:py-20">
              {/* Logo Pentecostés */}
              <div className="flex items-center space-x-4 mb-8">
                <img 
                  src="https://www.pentecostes.cl/website/www.pentecostes.cl/website_logo.png" 
                  alt="Fundación Pentecostés"
                  className="h-16 md:h-20 w-auto object-contain bg-white/90 rounded-lg p-2"
                />
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  <span className="text-white/90 text-lg font-medium">Red de Colegios Schoenstatt</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Excelencia académica y calidad formativa
              </h2>
              <p className="text-white/90 text-lg leading-relaxed max-w-3xl mb-4">
                La Fundación Pentecostés, con la convicción de que es importante la excelencia académica y la calidad en el ámbito formativo, 
                se preocupa por el funcionamiento administrativo y legal de los colegios de la red, generando instancias de asesoría, 
                acompañamiento y capacitación permanente a sus equipos directivos, docentes y comunidad educativa en general.
              </p>
              <p className="text-white/90 text-lg leading-relaxed max-w-3xl mb-8">
                Para esto, ha desarrollado planes de formación y acompañamiento en las áreas de Liderazgo, Gestión del Currículum y Convivencia Escolar. 
                Hoy en día, este asesoramiento técnico se ha abierto a otros establecimientos educacionales que no son parte de la red, pero que han querido sumarse a nuestra línea de trabajo.
              </p>
              
              <a
                href="https://www.pentecostes.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span>Visitar sitio web</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default FundacionPentecostes;
