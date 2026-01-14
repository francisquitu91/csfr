import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PastoralJuvenilSectionProps {
  onBack: () => void;
}

interface CoreMember {
  id: string;
  name: string;
  order_index: number;
  year: number;
}

interface Teacher {
  id: string;
  name: string;
  order_index: number;
}

interface Photo {
  id: string;
  photo_url: string;
  photo_name: string;
  order_index: number;
}

interface PastoralTeamMember {
  id: string;
  name: string;
  order_index: number;
}

const PastoralJuvenilSection: React.FC<PastoralJuvenilSectionProps> = ({ onBack }) => {
  const [coreMembers, setCoreMembers] = useState<CoreMember[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pastoralTeam, setPastoralTeam] = useState<PastoralTeamMember[]>([]);
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
      
      const [coreMembersData, teachersData, photosData, pastoralTeamData] = await Promise.all([
        supabase.from('pastoral_core_members').select('*').order('order_index'),
        supabase.from('pastoral_teachers').select('*').order('order_index'),
        supabase.from('pastoral_photos').select('*').order('order_index'),
        supabase.from('pastoral_team').select('*').order('order_index')
      ]);

      if (coreMembersData.error) throw coreMembersData.error;
      if (teachersData.error) throw teachersData.error;
      if (photosData.error) throw photosData.error;
      if (pastoralTeamData.error) throw pastoralTeamData.error;

      setCoreMembers(coreMembersData.data || []);
      setTeachers(teachersData.data || []);
      setPhotos(photosData.data || []);
      setPastoralTeam(pastoralTeamData.data || []);
    } catch (error) {
      console.error('Error fetching Pastoral data:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
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
            Pastoral
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pastoral del Colegio Section */}
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">Pastoral del Colegio</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="space-y-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                La pastoral de nuestro colegio brinda caminos concretos para hacer vida la espiritualidad del Colegio en diversos espacios formativos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Para los alumnos ofrece instancias para facilitar la vivencia de la fe en el camino al encuentro personal y comunitario con Jesús y con María, en momentos de oración y capilla, clases de religión, catequesis, misiones, trabajo social, hitos formativos y diversas celebraciones litúrgicas, integrando el mundo natural y sobrenatural de nuestros niños y jóvenes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Para los padres, apoderados y para profesores, la pastoral ofrece catequesis, jornadas de formación, reflexión y retiros. Además realiza actividades para motivar el compromiso social, con la finalidad de acompañar la vida de cada integrante.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Para trabajar cada uno de estos objetivos, la Pastoral cuenta con diversos equipos, quienes, a su vez, son acompañados por los Capellanes del Colegio.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="w-7 h-7 text-red-600 mr-3" />
              Equipo Pastoral
            </h3>
            {loading ? (
              <p className="text-center text-gray-600 py-4">Cargando...</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {pastoralTeam.map((member, index) => (
                  <div key={member.id} className="bg-gradient-to-r from-red-50 to-white px-4 py-3 rounded-full border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-gray-800 font-medium">{member.name}</span>
                    {index < pastoralTeam.length - 1 && <span className="text-gray-400 ml-2">•</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Photo Carousel */}
        {photos.length > 0 && (
          <div className={`relative mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                    alt={`Pastoral ${index + 1}`}
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
                      onClick={() => { setCurrentPhotoIndex(index); resetZoom(); }}
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

        {/* Mission Statement */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-purple-900">Nuestra Misión</h2>
          </div>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              La Pastoral Juvenil tiene como objetivo fundamental favorecer el cultivo de la fe de nuestros alumnos, 
              a través de la conducción, gestión y organización de diversas actividades y proyectos apostólicos y pastorales de nuestro colegio.
            </p>
            
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-6 rounded">
              <h3 className="font-bold text-purple-900 mb-3">Proyectos Pastorales:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Trabajos de invierno</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Preparación de Vía crucis y Pentecostés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Misiones Siembra (para alumnos de 7º y 8º básico)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Vinculación con María Ayuda</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Misiones de verano</span>
                </li>
              </ul>
            </div>
            
            <p>
              Nuestra Pastoral promueve que nuestros alumnos, desde su propia originalidad y motivación, sean capaces de salir al encuentro del otro 
              y crecer como personas íntegras, preparados a responder de las problemáticas sociales de nuestro país y nuestro tiempo, 
              desde una mirada cristiana basada en la entrega y misericordia.
            </p>
            
            <p>
              La Pastoral Juvenil SF es integrada por un amplio número de alumnos de 7º básico a IVº medio y conducida por un núcleo de 6 alumnos 
              de enseñanza media y tres profesores, quienes acogen las inquietudes y necesidades de nuestra comunidad y organizan las tareas propias 
              de cada proyecto, que luego son delegadas y gestionadas por los alumnos integrantes de la pastoral juvenil.
            </p>
          </div>
        </div>

        {/* Core Members */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">
            Alumnos Núcleo Pastoral Juvenil 2025
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-3 bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors duration-300"
              >
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-800 font-medium">{member.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Teachers */}
        {teachers.length > 0 && (
          <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">Profesores</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center space-x-3 bg-purple-50 rounded-lg px-6 py-3 hover:bg-purple-100 transition-colors duration-300"
                >
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-800 font-medium">{teacher.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram Link */}
        <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="https://www.instagram.com/pastoraljuvenil_csfr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Instagram className="w-6 h-6" />
            <span className="font-semibold text-lg">Visita nuestro Instagram</span>
          </a>
          <p className="mt-3 text-gray-600">@pastoraljuvenil_csfr</p>
        </div>
      </div>
    </div>
  );
};

export default PastoralJuvenilSection;
