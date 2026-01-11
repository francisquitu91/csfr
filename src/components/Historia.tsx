import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, MapPin, Award } from 'lucide-react';
import DirectoryCarousel, { DirectoryItem } from './DirectoryCarousel';
import FlipCard from './FlipCard';
import { supabase } from '../lib/supabase';
import type { DirectoryMember } from '../lib/supabase';

interface HistoriaProps {
  onBack: () => void;
}

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
      year: '1992',
      title: 'Fundación del Colegio',
      description: 'Inicia sus actividades a partir del Jardín Infantil Jesus´Heart en Reñaca, Viña del Mar. Nace como una iniciativa apostólica donde sacerdotes y laicos se unieron para servir a la comunidad desde el ámbito educativo. El proyecto educativo se fundamenta en los principios pedagógicos del Padre José Kentenich, fundador del Movimiento de Schoenstatt, buscando formar integralmente a los estudiantes en un ambiente familiar y cristiano.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '1994',
      title: 'Sistema Coeducacional',
      description: 'Se incorporan los hombres implementándose el sistema coeducacional, marcando un hito importante en la historia del colegio. Esta decisión permitió que hermanos y hermanas pudieran educarse juntos, fortaleciendo los valores familiares y la complementariedad entre géneros. El sistema coeducacional se alineó perfectamente con la pedagogía de Schoenstatt, que valora la originalidad de cada persona desde su modalidad femenina o masculina.',
      icon: <Users className="w-6 h-6" />
    },
    {
      year: '1997',
      title: 'Nueva Ubicación',
      description: 'Se traslada a su actual ubicación en el sector Los Pinos de Reñaca, estableciéndose en un campus especialmente diseñado para la educación integral. Las nuevas instalaciones permitieron expandir la oferta educativa y mejorar significativamente la infraestructura. Este traslado representó un crecimiento importante en la capacidad de atención a estudiantes y en la calidad de los espacios educativos, deportivos y recreativos.',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      year: '1998',
      title: 'Coronación de María',
      description: 'El 15 de agosto de 1998, el Directorio coronó a la Virgen María como Madre, Reina y Educadora del Colegio, consagrando y comprometiéndose con María en el cuidado, protección y desarrollo de la comunidad educativa. Este acto solemne marcó profundamente la identidad del colegio, estableciendo a María como el corazón de la propuesta educativa y como modelo de educadora para toda la comunidad escolar.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '1999',
      title: 'Coronación como Colegio',
      description: 'Se realizó la coronación como colegio, agradeciendo la conducción que María había tenido desde los inicios y reconociendo la magnitud de la misión educativa encomendada. En este momento histórico, la comunidad educativa reconoció su pequeñez y debilidad en contraste con la grandeza de María, pero también asumió con valentía el compromiso de formar integralmente a las nuevas generaciones bajo su maternal protección.',
      icon: <Award className="w-6 h-6" />
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
      <div className={`relative h-[500px] overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="https://colegiosagradafamilia.cl/www/wp-content/uploads/2022/03/Historia.jpg"
          alt="Historia del Colegio Sagrada Familia"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Más de 30 años educando</h2>
            <p className="text-xl">Formando líderes desde 1992</p>
          </div>
        </div>
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
            
            {/* Vision y Mision Flip Cards with Image */}
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://i.postimg.cc/j2G7Cj6J/foto-mision-vision.jpg"
                    alt="Visión y Misión"
                    className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-200 rounded-full opacity-20 blur-2xl"></div>
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

            {/* Instruction hint */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 italic flex items-center justify-center space-x-2">
                <span>💡</span>
                <span>Haz clic en las tarjetas para ver el contenido completo</span>
              </p>
            </div>

            {/* Objetivos Section */}
            <div id="objetivos" className="mt-12 scroll-mt-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Objetivos Educacionales</h3>
              <div className="space-y-4">
                {[
                  { titulo: 'Educar en la vivencia de la fe', descripcion: 'Para poder vivir en consecuencia con ella, como hijo de Dios y miembro de su familia, la Iglesia, integrando el mundo natural con el sobrenatural.' },
                  { titulo: 'Educar a la persona para que llegue a ser plenamente ella misma', descripcion: 'Según el Plan de Dios, desde su modalidad femenina o masculina, a través de personas que presten un servicio desinteresado a la originalidad de cada alumno.' },
                  { titulo: 'Educar en comunidad', descripcion: 'Sustentándose en vínculos sólidos a personas, ideas y lugares (curso, colegio, familia e Iglesia).' },
                  { titulo: 'Educar para la excelencia', descripcion: 'De modo que cada alumno (a) desarrolle con el máximo esfuerzo todas sus potencialidades cognitivas, afectivas y valóricas, para asumir responsablemente su misión en la familia y en la sociedad.' },
                  { titulo: 'Educar para servir en la sociedad', descripcion: 'Conociéndola desde su realidad social y ética, para que reconozcan en ella las necesidades, como posibilidad de respuesta personal y construcción de un nuevo orden social inspirado en valores cristianos y en la doctrina social de la Iglesia.' }
                ].map((objetivo, index) => (
                  <div key={index} className="bg-white border-l-4 border-blue-600 p-4 rounded-r-lg shadow-md">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">{objetivo.titulo}</h4>
                        <p className="text-gray-700 text-sm">{objetivo.descripcion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className={`grid md:grid-cols-3 gap-6 mt-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-red-600 mb-2">30+</div>
            <div className="text-gray-700">Años de Historia</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-red-600 mb-2">730+</div>
            <div className="text-gray-700">Estudiantes Actuales</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-red-600 mb-2">14+</div>
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