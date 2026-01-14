import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, ChevronLeft, ChevronRight, BookOpen, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CEALSectionProps {
  onBack: () => void;
}

interface CEALMember {
  id: string;
  position: string;
  name: string;
  order_index: number;
  year: number;
}

interface Photo {
  id: string;
  photo_url: string;
  photo_name: string;
  order_index: number;
}

const CEALSection: React.FC<CEALSectionProps> = ({ onBack }) => {
  const [members, setMembers] = useState<CEALMember[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (photos.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [photos]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [membersData, photosData] = await Promise.all([
        supabase.from('ceal_members').select('*').order('order_index'),
        supabase.from('ceal_photos').select('*').order('order_index')
      ]);

      if (membersData.error) throw membersData.error;
      if (photosData.error) throw photosData.error;

      setMembers(membersData.data || []);
      setPhotos(photosData.data || []);
    } catch (error) {
      console.error('Error fetching CEAL data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

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
            Alumnos
          </h1>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('proyecto-educativo')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-600 flex-shrink-0"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Proyecto Educativo</span>
            </button>
            
            <button
              onClick={() => scrollToSection('ceal-section')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-purple-600 flex-shrink-0"
            >
              <Award className="w-5 h-5" />
              <span className="font-semibold">CEAL</span>
            </button>
            
            <button
              onClick={() => scrollToSection('integrantes-ceal')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-red-600 flex-shrink-0"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Integrantes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className={`relative h-[600px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="https://i.postimg.cc/R06fLcy9/Manto.jpg"
          alt="Alumnos del Colegio Sagrada Familia"
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
        {/* Proyecto Educativo Section */}
        <div id="proyecto-educativo" className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestro Proyecto Educativo: Una Alianza Formativa</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Educamos bajo el Modelo Pedagógico Kentenijiano (MPK). Nuestro enfoque se centra en el crecimiento integral de la persona a través de tres pilares fundamentales: <strong>Vida Interior, Comunidad y Mundo</strong>.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfil del Alumno:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Buscamos formar personas con una vida interior rica y auténtica, capaces de liderar con espíritu de servicio.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Excelencia Orgánica:</h4>
                  <p className="text-gray-700">Cultivan sus talentos únicos con dedicación, buscando un desarrollo que trasciende lo académico.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Vínculo Espiritual:</h4>
                  <p className="text-gray-700">Encuentran en Cristo y María la inspiración y fortaleza para vivir con propósito.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Autonomía y Autoeducación:</h4>
                  <p className="text-gray-700">Son responsables de su propio aprendizaje, forjando un carácter auténtico y comprometido.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Liderazgo Solidario:</h4>
                  <p className="text-gray-700">Se reconocen como agentes de cambio que ponen sus capacidades al servicio del bien común y la transformación social.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CEAL Section */}
        <div id="ceal-section" className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 delay-200 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">CEAL - Centro de Alumnos</h2>
        
        {/* Photo Carousel */}
        {photos.length > 0 && (
          <div className="relative mb-8">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-100">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`transition-opacity duration-1000 ${
                    index === currentPhotoIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <img
                    src={photo.photo_url}
                    alt={`CEAL ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
              
              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentPhotoIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CEAL 2025 Content */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">Centro de Alumnos 2025</h3>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Este año, como Centro de Alumnos, queremos ser una voz cercana y presente. Nuestra meta es simple pero importante: 
              aportar con pequeños gestos y grandes ideas para que este 2025 sea un año especial para todos.
            </p>
            
            <p>
              Nos propusimos fortalecer la convivencia, hacer comunidad y darle vida al sello SF que nos une como colegio. 
              Pero también queremos reafirmar el rol del CEAL como un espacio representativo, activo y comprometido, 
              que contribuya de forma concreta a la vida escolar y al crecimiento de cada curso.
            </p>
            
            <p>
              Creemos que cada uno de nosotros tiene algo valioso que aportar, y que todos podemos dejar una huella en el camino.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6 rounded">
              <p className="text-xl font-semibold text-blue-900 mb-2">
                "Avanzando juntos, dejando huellas"
              </p>
              <p className="text-gray-700">
                Queremos seguir creando espacios que nos acerquen, como el Torneo de Media, las Alianzas o la Semana de la Convivencia, 
                donde cada encuentro sea una oportunidad para disfrutar y construir recuerdos.
              </p>
            </div>
            
            <p className="text-right italic">Con cariño,<br />Centro de Alumnos 2025</p>
          </div>
        </div>

        {/* Members Grid */}
        <div id="integrantes-ceal" className="mt-8 scroll-mt-24">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Integrantes CEAL 2025</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{member.position}</h3>
                  <p className="text-blue-600 font-medium">{member.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CEALSection;
