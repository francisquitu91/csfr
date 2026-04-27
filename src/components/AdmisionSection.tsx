import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, MapPin, Phone, FileText, Users, CheckCircle, ChevronDown, Calendar, Banknote, BookOpen, X, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdmisionSectionProps {
  onBack: () => void;
}

interface InfoCard {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  image: string;
}

interface ProcessStep {
  id: number;
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaAction?: () => void;
}

interface InfoSection {
  id: number;
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
  file_url?: string | null;
  file_name?: string | null;
}

interface ContactPerson {
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  photo: string;
}

interface Vacante {
  id: number;
  curso: string;
  vacantes: number;
  order_index: number;
}

const AdmisionSection: React.FC<AdmisionSectionProps> = ({ onBack }) => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null); // kept for potential future interactions
  const [expandedInfo, setExpandedInfo] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [infoSections, setInfoSections] = useState<InfoSection[]>([]);
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [fechaActualizacion, setFechaActualizacion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showPEIViewer, setShowPEIViewer] = useState(false);
  const [peiLoaded, setPeiLoaded] = useState(false);
  const peiIframeRef = useRef<HTMLIFrameElement | null>(null);
  const peiPresentationId = '19N_2apJTsztXiJ4yrxUv52LpNOoOIFANDNoh170Viwg';
  const peiEmbedUrl = `https://docs.google.com/presentation/d/${peiPresentationId}/embed?start=false&loop=false&delayms=30000`;

  const openPEIViewer = () => {
    setPeiLoaded(false);
    setShowPEIViewer(true);
  };

  useEffect(() => {
    setIsVisible(true);
    fetchAdmisionData();
  }, []);

  const fetchAdmisionData = async () => {
    try {
      setLoading(true);
      
      // Fetch info sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('admision_info_sections')
        .select('*')
        .order('order_index');
      
      if (sectionsError) throw sectionsError;
      
      // Fetch vacantes
      const { data: vacantesData, error: vacantesError } = await supabase
        .from('admision_vacantes')
        .select('*')
        .order('order_index');
      
      if (vacantesError) throw vacantesError;
      
      // Fetch fecha actualización
      const { data: fechaData, error: fechaError } = await supabase
        .from('admision_vacantes_fecha')
        .select('fecha_actualizacion')
        .single();
      
      if (fechaError) throw fechaError;
      
      // Map sections with icons
      const mappedSections = (sectionsData || []).map((section: any) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        icon: getIconComponent(section.icon_name),
        color: section.color,
        file_url: section.file_url,
        file_name: section.file_name
      }));
      
      setInfoSections(mappedSections);
      setVacantes(vacantesData || []);
      setFechaActualizacion(fechaData?.fecha_actualizacion || 'Actualizadas al 15 de octubre');
    } catch (error) {
      console.error('Error fetching admision data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string): React.ReactNode => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'FileText': <FileText className="w-8 h-8" />,
      'Users': <Users className="w-8 h-8" />,
      'Calendar': <Calendar className="w-8 h-8" />,
      'CheckCircle': <CheckCircle className="w-8 h-8" />,
      'Banknote': <Banknote className="w-8 h-8" />,
      'Mail': <Mail className="w-8 h-8" />
    };
    return iconMap[iconName] || <FileText className="w-8 h-8" />;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const renderContentWithLinks = (content: string) => {
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

    return content.split('\n').map((line, lineIndex) => {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = markdownLinkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }

        parts.push(
          <a
            key={`link-${lineIndex}-${match.index}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-800 underline font-medium"
          >
            {match[1]}
          </a>
        );

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }

      markdownLinkRegex.lastIndex = 0;

      return (
        <p key={`line-${lineIndex}`} className="text-gray-700 leading-relaxed">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  // Info Cards con animación 3D flip
  const infoCards: InfoCard[] = [
    {
      id: 1,
      title: 'Proceso de Admisión',
      description: 'Conoce los pasos a seguir para postular al Colegio Sagrada Familia.',
      icon: <FileText className="w-12 h-12" />,
      color: 'from-blue-600 to-blue-800',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Proyecto Educativo',
      description: 'Formación católica integral y de excelencia orientada al servicio.',
      icon: <Users className="w-12 h-12" />,
      color: 'from-blue-600 to-blue-800',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Comunidad Educativa',
      description: 'Familias que comparten valores y cultivan una atmósfera de vínculos sólidos, de confianza y libertad.',
      icon: <CheckCircle className="w-12 h-12" />,
      color: 'from-blue-600 to-blue-800',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop'
    }
  ];

  // Etapas del proceso horizontal
  const processSteps: ProcessStep[] = [
    {
      id: 1,
      step: 'PASO 1',
      title: 'Conócenos',
      description: 'Revisa aquí los aspectos esenciales de nuestro proyecto educativo.',
      icon: (
        <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
        </svg>
      ),
      color: 'bg-blue-600',
      ctaLabel: 'Ir a Proyecto Educativo Institucional',
      ctaAction: openPEIViewer
    },
    {
      id: 2,
      step: 'PASO 2',
      title: 'Postula',
      description: 'Completa el formulario de postulación con los datos de tu familia.',
      icon: <FileText className="w-20 h-20" />,
      color: 'bg-green-600',
      ctaLabel: 'Ir a Colegium',
      ctaHref: 'https://schoolnet.colegium.com/webapp/es_CL/login'
    },
    {
      id: 3,
      step: 'PASO 3',
      title: 'Entrevista padres y visita al colegio',
      description: 'Conoce nuestras instalaciones y conversa con nuestro equipo.',
      icon: <Users className="w-20 h-20" />,
      color: 'bg-teal-600'
    },
    {
      id: 4,
      step: 'PASO 4',
      title: 'Respuesta a la postulación',
      description: 'Te comunicaremos la decisión del proceso de admisión.',
      icon: <CheckCircle className="w-20 h-20" />,
      color: 'bg-cyan-600'
    },
    {
      id: 5,
      step: 'PASO 5',
      title: 'Incorporación',
      description: 'Bienvenido a la familia Sagrada Familia.',
      icon: (
        <svg className="w-20 h-20" viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="60" r="18" />
          <circle cx="60" cy="90" r="15" />
          <circle cx="140" cy="90" r="15" />
          <path d="M100 82 Q100 95 85 110 L85 145 L115 145 L115 110 Q100 95 100 82" />
          <path d="M60 108 Q60 118 50 128 L50 155 L70 155 L70 128 Q60 118 60 108" />
          <path d="M140 108 Q140 118 130 128 L130 155 L150 155 L150 128 Q140 118 140 108" />
        </svg>
      ),
      color: 'bg-indigo-600'
    }
  ];

  // Información de contacto
  const contactPerson: ContactPerson = {
    name: 'Jennifer Nielsen Varela',
    role: 'Encargada de Admisión',
    email: 'admision@csfr.cl',
    phone: '9 3242 2220',
    address: 'Colegio Sagrada Familia\nParcela 4, Los Pinos, Reñaca\nCasilla 5104 – Correo Reñaca',
    photo: 'https://i.postimg.cc/B6RMxtwm/1516855554215.jpg'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Admisión
            </h1>
            <p className="text-2xl font-semibold text-blue-600">¡Bienvenidos al Colegio Sagrada Familia!</p>
          </div>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => scrollToSection('por-que-elegirnos')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-blue-600 flex-shrink-0"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Nuestro Proceso de Admisión</span>
            </button>
            
            <button
              onClick={() => scrollToSection('etapas-proceso')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-purple-600 flex-shrink-0"
            >
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Etapas del Proceso</span>
            </button>
            
            <button
              onClick={() => scrollToSection('informacion-admision')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-green-600 flex-shrink-0"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Información de Admisión</span>
            </button>
            
            <button
              onClick={() => scrollToSection('contacto')}
              className="flex items-center space-x-2 px-6 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-red-600 flex-shrink-0"
            >
              <Mail className="w-5 h-5" />
              <span className="font-semibold">Contacto</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Cards con flip 3D */}
        <div id="por-que-elegirnos" className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-6">
            <h2 className="text-4xl font-semibold text-[#2E3A87] mb-2">
              Nuestro Proceso de Admisión
            </h2>
            <div className="w-48 h-1 bg-[#8B5E3C] mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {infoCards.map((card) => (
              <div
                key={card.id}
                className="h-80 cursor-pointer"
                style={{ perspective: '1000px' }}
                onMouseEnter={() => setFlippedCard(card.id)}
                onMouseLeave={() => setFlippedCard(null)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                    flippedCard === card.id ? 'rotate-y-180' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCard === card.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`}></div>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                    />
                    <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4">
                        {card.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-center">{card.title}</h3>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl bg-white p-8 flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="text-center">
                      <div className={`inline-block bg-gradient-to-br ${card.color} rounded-full p-4 mb-4`}>
                        <div className="text-white">{card.icon}</div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Etapas del Proceso - Horizontal con expansión */}
        <div id="etapas-proceso" className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-6">
            <h2 className="text-4xl font-semibold text-[#2E3A87] mb-2">
              Etapas del proceso
            </h2>
            <div className="w-48 h-1 bg-[#8B5E3C] mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {processSteps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center justify-start text-white p-6 min-h-[220px] rounded-lg shadow-lg transition-all duration-300 ${step.color}`}
              >
                <div className="mb-4 flex items-center justify-center" style={{ height: '60px' }}>{step.icon}</div>
                <p className="text-sm font-medium opacity-90">{step.step}</p>
                <h3 className="text-base font-semibold text-center mt-2 leading-tight px-2">
                  {step.title}
                </h3>

                <div className="mt-3 text-sm text-white/90 text-center">
                  {step.description}
                </div>

                {step.ctaLabel && step.ctaAction && (
                  <button
                    type="button"
                    onClick={step.ctaAction}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-md transition-transform hover:scale-105"
                  >
                    {step.ctaLabel}
                  </button>
                )}

                {step.ctaLabel && step.ctaHref && !step.ctaAction && (
                  <a
                    href={step.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-green-700 shadow-md transition-transform hover:scale-105"
                  >
                    {step.ctaLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Secciones de Información Expandibles */}
        <div id="informacion-admision" className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Información del Proceso de Admisión
            </h2>
            <p className="text-gray-600 text-lg">Conoce todos los detalles del proceso</p>
          </div>

          <div className="space-y-4">
            {infoSections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setExpandedInfo(expandedInfo === section.id ? null : section.id)}
                  className="w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
                >
                    <div className="flex-1 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className={`bg-gradient-to-br ${section.color} rounded-xl p-3 text-white`}>
                          {section.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <ChevronDown
                          className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                            expandedInfo === section.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                </button>

                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    expandedInfo === section.id ? 'max-h-[2600px] sm:max-h-[1800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      {section.file_url && (
                        <div className="mb-6">
                          <a
                            href={section.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                          >
                            DESCARGAR DOCUMENTO
                          </a>
                          {section.file_name && (
                            <p className="text-sm text-gray-500 mt-2">{section.file_name}</p>
                          )}
                        </div>
                      )}
                      {section.content.includes('[TABLA_VACANTES]') ? (
                        <>
                          <div className="space-y-2 mb-6">
                            {renderContentWithLinks(section.content.replace('[TABLA_VACANTES]', ''))}
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-md">
                            <p className="text-sm text-gray-600 mb-4 font-semibold">{fechaActualizacion}</p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                                    <th className="py-3 px-4 font-semibold text-sm">CURSO</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-center">VACANTES</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {vacantes.map((vacante, idx) => (
                                    <tr
                                      key={vacante.id}
                                      className={`${
                                        idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                      } border-b border-gray-200 hover:bg-blue-50 transition-colors`}
                                    >
                                      <td className="py-3 px-4 text-gray-700 font-medium">{vacante.curso}</td>
                                      <td className="py-3 px-4 text-center">
                                        <span
                                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                            vacante.vacantes > 0
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}
                                        >
                                          {vacante.vacantes}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          {renderContentWithLinks(section.content)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto - A tu disposición */}
        <div id="contacto" className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Lado izquierdo - Texto */}
              <div className="flex flex-col justify-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Contacto
                </h2>
                <div className="w-48 h-1 bg-purple-900 mb-8 rounded-full"></div>
              </div>

              {/* Lado derecho - Información de contacto */}
              <div className="flex flex-col items-center justify-center">
                <div className="mb-6">
                  <img
                    src={contactPerson.photo}
                    alt={contactPerson.name}
                    className="w-48 h-48 rounded-full object-cover border-8 border-white shadow-2xl"
                  />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{contactPerson.name}</h3>
                <p className="text-xl text-white/90 mb-2">{contactPerson.role}</p>
                <a
                  href="tel:+56932422220"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full border border-white/40 text-2xl font-semibold text-white mb-6 hover:bg-white/30 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{contactPerson.phone}</span>
                </a>
                
                <div className="space-y-4 text-white w-full max-w-md">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">E-mail:</p>
                      <a href={`mailto:${contactPerson.email}`} className="hover:underline">
                        {contactPerson.email}
                      </a>
                    </div>
                  </div>
                  
                  {/* Teléfono eliminado por solicitud - anteriormente mostrado aquí */}
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Dirección:</p>
                      <p>{contactPerson.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPEIViewer && (
        <div className="fixed inset-0 z-[100] bg-black/80">
          <div className="absolute top-0 left-0 right-0 h-16 bg-black/70 flex items-center justify-between px-4 md:px-6">
            <h3 className="text-white font-semibold">PEI - Proyecto Educativo Institucional</h3>
            <button
              onClick={() => setShowPEIViewer(false)}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Cerrar
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 top-16 bg-black">
            {!peiLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                  <p className="text-sm text-white/80">Cargando PEI...</p>
                </div>
              </div>
            )}

            <iframe
              ref={peiIframeRef}
              title="PEI en pantalla completa"
              src={peiEmbedUrl}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen"
              tabIndex={0}
              onLoad={() => setPeiLoaded(true)}
            />
          </div>
        </div>
      )}

          <style>{`
            .perspective-1000 {
              perspective: 1000px;
            }
            .transform-style-3d {
              transform-style: preserve-3d;
            }
            .backface-hidden {
              backface-visibility: hidden;
            }
            .rotate-y-180 {
              transform: rotateY(180deg);
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default AdmisionSection;
