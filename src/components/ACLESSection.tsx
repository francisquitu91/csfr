import React, { useState } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import ACLESCard from './ACLESCard';

interface ACLESSectionProps {
  onBack: () => void;
}

const ACLESSection: React.FC<ACLESSectionProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const deportivas = [
    'Fútbol',
    'Hockey',
    'Rugby',
    'Voleibol',
    'Cheerleader'
  ];

  const artisticas = [
    'Taller de arte',
    'Taller de Electroacústica'
  ];

  const cientificas = [
    'Ecología',
    'Robótica',
    'Ajedrez'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            ACLES - Actividades de Libre Elección
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Descripción ACLES */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué son las ACLES?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Las ACLES son actividades de libre elección que se enmarcan dentro del proceso formativo del colegio y permiten a nuestros alumnos y alumnas ejercitar su libertad y su responsabilidad.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Todos los alumnos que cursan entre 4to básico y II medio tienen la obligación de participar, como mínimo, en una de las actividades que el Colegio ofrece, inscribiéndose a comienzos de cada año de acuerdo a sus intereses y/o aptitudes personales.
              </p>
            </div>
          </div>
        </div>

        {/* Título de actividades */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Actividades</h2>
          <p className="text-gray-600">Descubre las ACLES disponibles para nuestros alumnos</p>
        </div>

        {/* Tarjetas ACLES */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ACLESCard
              type="deportiva"
              title="ACLES Deportivas"
              items={deportivas}
              imageUrl="https://i.postimg.cc/LshbW0t1/DSC00747.jpg"
            />
          </div>

          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ACLESCard
              type="artistica"
              title="ACLES Artísticas"
              items={artisticas}
              imageUrl="https://i.postimg.cc/hPkvvHG5/artes.png"
            />
          </div>

          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ACLESCard
              type="cientifica"
              title="ACLES Científicas"
              items={cientificas}
              imageUrl="https://i.postimg.cc/brbJ9TVc/cientifica.png"
            />
          </div>
        </div>

        {/* Instruction hint */}
        <div className={`text-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-sm text-gray-500 italic flex items-center justify-center space-x-2">
            <span>💡</span>
            <span>Haz clic en las tarjetas para ver las actividades disponibles</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ACLESSection;
