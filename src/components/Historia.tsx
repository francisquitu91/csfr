import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, MapPin, Award, BookOpen } from 'lucide-react';
import DirectoryCarousel, { DirectoryItem } from './DirectoryCarousel';
import FlipCard from './FlipCard';
import { supabase } from '../lib/supabase';
import type { DirectoryMember } from '../lib/supabase';

interface HistoriaProps {
  onBack: () => void;
}

// Componente para las tarjetas de Sellos Educativos
const SelloCard: React.FC<{ title: string; description: string; image?: string }> = ({ title, description, image }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="flip-card h-64 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div className="flip-card-front rounded-lg shadow-xl flex items-center justify-center p-6 overflow-hidden relative">
          {image ? (
            <>
              <img src={image} alt={title} className="w-full h-full object-cover absolute inset-0" />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700"></div>
          )}
          <h4 className="text-2xl font-bold text-white text-center relative z-10 drop-shadow-lg">{title}</h4>
        </div>
        {/* Back */}
        <div className="flip-card-back bg-white rounded-lg shadow-xl p-6 flex items-center justify-center border-4 border-red-600">
          <p className="text-gray-700 text-center leading-relaxed text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Componente para la tarjeta del Padre Kentenich con PEI
const PEICard: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="flip-card h-[32rem] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front - Foto del Padre Kentenich con overlay */}
        <div className="flip-card-front rounded-lg shadow-xl overflow-hidden relative">
          {/* Imagen de fondo */}
          <img
            src="https://colegiosagradafamilia.cl/www/wp-content/uploads/2018/08/foto-mision-vision.jpg"
            alt="Padre José Kentenich"
            className="w-full h-full object-cover"
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Contenido overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="transform transition-transform duration-300 hover:scale-110 relative w-full flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg flex-shrink-0">
                <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-center mb-3 md:mb-4 drop-shadow-lg text-white">Proyecto Educativo</h3>
              <div className="flex items-center justify-center space-x-2 text-white/90 animate-pulse drop-shadow-md text-xs md:text-sm">
                <span className="font-semibold">Haz clic para descubrir</span>
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Back - Acceso al PEI */}
        <div className="flip-card-back bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-xl p-8 flex flex-col items-center justify-center">
          <BookOpen className="w-16 h-16 text-white mb-4" />
          <h4 className="text-2xl font-bold text-white text-center mb-4">Proyecto Educativo</h4>
          <p className="text-white text-center mb-6 opacity-90">Conoce nuestro Proyecto Educativo Institucional</p>
          <a
            href="https://drive.google.com/file/d/1Md8klWWoGqQO1IiaQDaG9uKH2BIJbK7O/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            Ver Documento PEI
          </a>
        </div>
      </div>
    </div>
  );
};

const Historia: React.FC<HistoriaProps> = ({ onBack }) => {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [directoryMembers, setDirectoryMembers] = useState<DirectoryItem[]>([]);
  const [rectoriaMembers, setRectoriaMembers] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchDirectoryMembers();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const fetchDirectoryMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('directory_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      const directorio = (data || [])
        .filter((m: DirectoryMember) => m.category === 'directorio')
        .map((m: DirectoryMember) => ({
          name: `${m.name} - ${m.position}`,
          photoUrl: m.photo_url || 'https://via.placeholder.com/150'
        }));

      const rectoria = (data || [])
        .filter((m: DirectoryMember) => m.category === 'rectoria')
        .map((m: DirectoryMember) => ({
          name: `${m.name} - ${m.position}`,
          photoUrl: m.photo_url || 'https://via.placeholder.com/150'
        }));

      setDirectoryMembers(directorio);
      setRectoriaMembers(rectoria);
    } catch (error) {
      console.error('Error fetching directory members:', error);
    } finally {
      setLoading(false);
    }
  };

  const timelineEvents = [
    {
      year: '1998',
      title: 'Inicios del Colegio',
      description: 'El Colegio inicia sus actividades cuando un grupo de laicos y sacerdotes unieron sus esfuerzos para hacerse cargo del colegio Jesus´Heart, como una iniciativa apostólica orientada a aportar a la comunidad desde el ámbito de la educación bajo la espiritualidad de Schoenstatt y la pedagogía del padre José Kentenich.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '15 de Agosto 1998',
      title: 'Consagración a la Virgen María',
      description: 'En un acto religioso, el Directorio le pidió a la Virgen María que fuese Madre, Reina y Educadora del Colegio, consagrándole el cuidado, protección y desarrollo de la comunidad educativa. Este acto solemne marcó profundamente la identidad del colegio, estableciendo a María como el corazón de la propuesta educativa.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '1999',
      title: 'Reconocimiento como Colegio',
      description: 'Se realizó un acto similar, esta vez como Colegio, agradeciendo la conducción que la Virgen María había tenido del colegio desde sus inicios hasta entonces, y reconociendo la magnitud de la misión que les encargaba. La comunidad educativa asumió con valentía el compromiso de formar integralmente a las nuevas generaciones bajo su maternal protección.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '2001',
      title: 'Colegio Sagrada Familia',
      description: 'El Colegio recibe el nombre de Colegio Sagrada Familia, reflejando la centralidad de la comunidad educativa en el proceso de formación, donde el niño se desarrolla en un verdadero ambiente de hogar, creando vínculos reales de amor y responsabilidad consigo mismo, con Dios, con las personas y las cosas. El nombre destaca la relevancia del padre y de la madre como primeros educadores, quienes, a imagen de la Sagrada Familia, son los principales responsables de la educación de sus hijos, haciéndolo con alegría. En ese mismo año, egresa la primera generación conformada por 6 alumnas del Colegio.',
      icon: <Users className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with back button */}
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
            Quiénes Somos
          </h1>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('historia-timeline')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-600 flex-shrink-0"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Historia</span>
            </button>
            
            <button
              onClick={() => scrollToSection('vision-mision')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-purple-600 flex-shrink-0"
            >
              <Award className="w-5 h-5" />
              <span className="font-semibold">Visión & Misión</span>
            </button>
            
            <button
              onClick={() => scrollToSection('objetivos')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-green-600 flex-shrink-0"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Objetivos</span>
            </button>
            
            <button
              onClick={() => scrollToSection('directorio-rectoria')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-red-600 flex-shrink-0"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Directorio & Rectoría</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className={`relative h-[600px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="https://i.postimg.cc/8z934gtQ/25anos.jpg"
          alt="Historia del Colegio Sagrada Familia"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Interactive Timeline */}
      <div id="historia-timeline" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className={`text-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Historia</h2>
          <p className="text-gray-600">Descubre los momentos más importantes de nuestra historia</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Timeline Navigation */}
          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  activeTimeline === index
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-red-50 shadow-md'
                }`}
                onClick={() => setActiveTimeline(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${activeTimeline === index ? 'bg-white text-red-600' : 'bg-red-100 text-red-600'}`}>
                    {event.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{event.year}</h3>
                    <p className="text-sm opacity-90">{event.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                {timelineEvents[activeTimeline].icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{timelineEvents[activeTimeline].year}</h3>
              <h4 className="text-xl text-red-600 font-semibold">{timelineEvents[activeTimeline].title}</h4>
            </div>
            <p className="text-gray-700 leading-relaxed text-center">
              {timelineEvents[activeTimeline].description}
            </p>
          </div>
        </div>

        {/* Full History Text */}
        <div id="vision-mision" className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-700 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visión & Misión</h2>
            
            {/* Vision y Mision Flip Cards with Padre Kentenich Image */}
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
              {/* Image Padre Kentenich con PEI */}
              <div className="relative order-2 lg:order-1">
                <PEICard />
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500 italic">
                    💡 Haz clic en la tarjeta para acceder al Proyecto Educativo
                  </p>
                </div>
              </div>

              {/* Flip Cards */}
              <div className="space-y-6 order-1 lg:order-2">
                <FlipCard
                  type="vision"
                  title="Visión"
                  content="El colegio Sagrada Familia, a partir de la pedagogía y espiritualidad de Schoenstatt, quiere ser una comunidad de aprendizaje que forma personas íntegras, comprometidas con Cristo y orientadas al servicio, brindando una educación orgánica, de excelencia e innovadora, para dar respuesta a los desafíos de la sociedad y de su tiempo."
                />
                
                <FlipCard
                  type="mision"
                  title="Misión"
                  content='Su Misión es educar orgánicamente a sus estudiantes en una atmósfera de vínculos sólidos, confianza y libertad posibilitando el descubrimiento de su misión en la vida –pedagógicamente denominada "ideal personal"– con la que se experimentan amados, y llamados a seguir a Cristo, servir y transformar el mundo.'
                />
              </div>
            </div>

            {/* Sellos Educativos Section */}
            <div id="sellos" className="mt-12 scroll-mt-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sellos Educativos</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <SelloCard
                  title="Ideal Personal"
                  description="Bajo el carisma de Schoenstatt, promovemos que cada estudiante descubra y desarrolle su originalidad, plasmada en su Ideal Personal como propósito y vocación de vida."
                  image="https://i.postimg.cc/SxdLQ6Yz/ideapersonl.png"
                />
                <SelloCard
                  title="Ser Orgánico"
                  description="Siguiendo la pedagogía de Schoenstatt, creemos que un desarrollo orgánico que integre las dimensiones intelectual, emocional y espiritual, es clave para que los estudiantes alcancen su potencial y se conviertan en agentes de cambio social."
                  image="https://i.postimg.cc/MGwLNm2V/rezar.png"
                />
                <SelloCard
                  title="Estilo Mariano"
                  description="Reconocemos en María, Madre de Jesús y Corredentora, nuestra Madre, quien nos ofrece un camino para encontrarnos con su Hijo Jesús. Inspirados en la espiritualidad de Schoenstatt y en los hitos que dieron origen a nuestro colegio, surge un vínculo personal con María quien regala permanentemente a nuestra comunidad tres gracias desde su Santuario: el acogimiento, la transformación y el envío apostólico."
                  image="https://i.postimg.cc/sX74rtY1/iglesia.png"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className={`grid md:grid-cols-3 gap-6 mt-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-red-600 mb-2">25+</div>
            <div className="text-gray-700">Años de Historia</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-red-600 mb-2">730+</div>
            <div className="text-gray-700">Estudiantes Actuales</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-red-600 mb-2">12+</div>
            <div className="text-gray-700">Generaciones Egresadas</div>
          </div>
        </div>

        {/* Directorio y Rectoría Section */}
        <div id="directorio-rectoria" className={`bg-white rounded-lg shadow-lg overflow-hidden mt-12 transition-all duration-1000 scroll-mt-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Directorio y Rectoría</h2>
            
            {/* Directorio Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Directorio</h3>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  La conducción superior del Colegio es realizada por un Directorio, cuyos miembros son nombrados 
                  por el Superior Provincial de la Comunidad de los Padres de Schoenstatt.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Este Directorio tiene la responsabilidad de definir los lineamientos generales del Colegio y velar 
                  por la fidelidad a los principios que inspiran el proyecto desde sus inicios, como así mismo su 
                  financiamiento y desarrollo.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  El Directorio está compuesto por un grupo de laicos, que participan en la Obra Familiar del 
                  Movimiento de Schoenstatt, y un sacerdote de la Comunidad de los Padres de Schoenstatt.
                </p>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Cargando miembros del directorio...</p>
                </div>
              ) : directoryMembers.length > 0 ? (
                <DirectoryCarousel items={directoryMembers} />
              ) : (
                <p className="text-center text-gray-600 py-4">No hay miembros del directorio registrados.</p>
              )}
            </div>

            {/* Rectoría Section */}
            <div>
              <h3 className="text-2xl font-bold text-red-900 mb-6">Rectoría</h3>
              <div className="bg-red-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Queridas familias, nuestro colegio nace como una iniciativa apostólica que anhela contribuir en 
                  la construcción de una Iglesia nueva y de un Chile nuevo. Animados por la espiritualidad de Schoenstatt, 
                  quiere ofrecer una propuesta educativa que le permita a sus alumnos crecer armónicamente desde una 
                  auténtica vivencia de familia.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El Padre José Kentenich, fundador del movimiento de Schoenstatt, nos llamó a "forjar al hombre nuevo, 
                  para la nueva comunidad", lo que se presenta como una invitación a formar niños y jóvenes llamados a 
                  superar una cultura individualista para salir al encuentro de los demás, en quienes el amor se manifieste 
                  en todo su poder y sean capaces de aportar significativamente en la renovación de nuestra sociedad.
                </p>
                <p className="text-gray-700 leading-relaxed italic">
                  Le pedimos a la Virgen María que nos acompañe y anime en este camino.
                </p>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Cargando equipo directivo...</p>
                </div>
              ) : rectoriaMembers.length > 0 ? (
                <DirectoryCarousel items={rectoriaMembers} />
              ) : (
                <p className="text-center text-gray-600 py-4">No hay miembros de rectoría registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historia;