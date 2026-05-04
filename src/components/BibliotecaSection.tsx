import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Search, Globe, FileText, Download, ExternalLink } from 'lucide-react';

interface BibliotecaSectionProps {
  onBack: () => void;
}

const BibliotecaSection: React.FC<BibliotecaSectionProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  const openPlanLector = (year: '2025' | '2026') => {
    (window as any).planLectorYear = year;
    if ((window as any).navigateTo) {
      (window as any).navigateTo('plan-lector');
    }
  };

  const openEstanteriaVirtual = () => {
    if ((window as any).navigateTo) {
      (window as any).navigateTo('estanteria-virtual');
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-amber-600 hover:text-amber-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Biblioteca
            </h1>
            <p className="text-lg text-gray-600">Un espacio de conocimiento, imaginación y crecimiento</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sección 1: Descripción Principal */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">Nuestra Biblioteca</h2>
              </div>
            </div>
            
            <div className="p-8 space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Al recorrer las páginas de un libro, se nos abre la puerta hacia un mundo donde la imaginación, 
                la creatividad, el conocimiento, la fantasía y la magia no tienen límites. A través de la lectura, 
                vamos formando a niños y jóvenes curiosos que buscan respuestas y motivaciones, niños que sueñan y 
                viajan permanentemente entre historias y aventuras, que van armando su propia percepción de la vida 
                y son capaces de aportar significativamente a la comunidad.
              </p>

              <p className="text-lg">
                La biblioteca de nuestro colegio, está inserta en una comunidad que valora profundamente la cultura 
                y el conocimiento, fomenta la investigación, el pensamiento crítico, los espacios de búsqueda y la 
                creación. Su objetivo principal es fomentar la lectura en cada uno de nuestros alumnos, siendo esta 
                una herramienta trascendental que permite fortalecer su desarrollo cognitivo y emocional, además de 
                propiciar el desarrollo de habilidades fundamentales para la vida.
              </p>

              <p className="text-lg">
                Para generar un primer acercamiento a la lectura, la biblioteca cuenta con un programa dirigido a 
                los alumnos de Ciclo Inicial, el cual considera una visita de los niños para compartir y disfrutar 
                de manera lúdica la narración de cuentos. Asimismo, el Primer Ciclo también participa de entretenidas 
                actividades y cuenta cuentos preparados especialmente para ellos.
              </p>

              <p className="text-lg">
                Para nosotros es muy importante que nuestros alumnos tengan un aprendizaje en la medida que logren 
                interiorizarse en el cuidado de los libros, sensibilizarse con su valor cultural y la importancia de 
                la lectura social.
              </p>

              {/* Normas de Préstamo */}
              <div className="bg-amber-50 rounded-xl p-6 mt-8 border-l-4 border-amber-600">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">Normas de Préstamo</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-2">•</span>
                    <span>Los libros se prestan por una semana - el incumplimiento perjudica a tus compañeros.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-2">•</span>
                    <span>Puedes renovar el préstamo hasta tres veces.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-2">•</span>
                    <span>Son usuarios de Biblioteca: alumnos, profesores y familias.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 font-bold mr-2">•</span>
                    <span>Los libros que sean devueltos rotos deberán ser reemplazados por el mismo libro nuevo.</span>
                  </li>
                </ul>
              </div>

              {/* Firma */}
              <div className="mt-8 text-right">
                <p className="text-lg font-semibold text-gray-900">Carolina Birke Vidal</p>
                <p className="text-gray-600">Bibliotecóloga</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 2: Acceso a Recursos */}
        <div className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-semibold text-[#2E3A87] mb-2">
              Acceso a Recursos
            </h2>
            <div className="w-48 h-1 bg-[#8B5E3C] mx-auto rounded"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Buscador de Libros */}
            <a
              href="https://colegiosagradafamilia.colegium.com/mt"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Search className="w-12 h-12" />
                  <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Buscador de Libros</h3>
                <p className="text-blue-100">Biblioteca Física</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Busca y consulta la disponibilidad de libros en nuestra biblioteca física.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Acceder al buscador</span>
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Estantería Virtual */}
            <button
              onClick={openEstanteriaVirtual}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 text-left cursor-pointer"
            >
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-12 h-12" />
                  <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Estantería Virtual</h3>
                <p className="text-indigo-100">Colección de Libros Digital</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Accede a nuestra colección de libros disponibles en línea. Lectura directa sin descargas.
                </p>
                <div className="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700">
                  <span>Explorar estantería</span>
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Recursos Digitales */}
            <a
              href="https://sites.google.com/csfr.cl/biblioteca-csfr/p%C3%A1gina-principal"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="w-12 h-12" />
                  <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Recursos Digitales</h3>
                <p className="text-purple-100">Biblioteca Digital</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Explora nuestra biblioteca digital con recursos, enlaces y materiales educativos.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                  <span>Visitar biblioteca digital</span>
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Sección 3: Planes Lectores */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-semibold text-[#2E3A87] mb-2">
              Planes Lectores
            </h2>
            <div className="w-48 h-1 bg-[#8B5E3C] mx-auto rounded"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    2025
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Plan Lector 2025 (Buscador)</h3>
                <p className="text-sm text-gray-600 mb-4">Versión actual del buscador de libros para el plan lector 2025.</p>
                <button
                  onClick={() => openPlanLector('2025')}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group"
                >
                  <Search className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  <span>Ir al Plan Lector</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Search className="w-8 h-8 text-emerald-600" />
                  </div>
                  <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    2026
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Plan Lector 2026 (Buscador)</h3>
                <p className="text-sm text-gray-600 mb-4">Nuevo bloque autogestionable desde admin para el plan lector 2026.</p>
                <button
                  onClick={() => openPlanLector('2026')}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 group"
                >
                  <Search className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  <span>Ir al Plan Lector</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BibliotecaSection;
