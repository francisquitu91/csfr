import React, { useState } from 'react';
import { Eye, Target } from 'lucide-react';

interface FlipCardProps {
  type: 'vision' | 'mision';
  title: string;
  content: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ type, title, content }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const colors: {
    [key: string]: {
      bg: string;
      icon: string;
      text: string;
      light: string;
      useImage: boolean;
      image?: string;
    };
  } = {
    vision: {
      bg: 'from-blue-500 to-blue-700',
      icon: 'bg-blue-600',
      text: 'text-blue-600',
      light: 'bg-blue-50',
      useImage: true,
      image: 'https://i.postimg.cc/8zxZX2Y6/Diseno-sin-titulo-5.png'
    },
    mision: {
      bg: 'from-red-500 to-red-700',
      icon: 'bg-red-600',
      text: 'text-red-600',
      light: 'bg-red-50',
      useImage: true,
      image: 'https://i.postimg.cc/R09gz7MN/Diseno-sin-titulo-6.png'
    }
  };

  const Icon = type === 'vision' ? Eye : Target;
  const color = colors[type];

  return (
    <div 
      className={`flip-card h-80 md:h-80 sm:h-72 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        {/* Front of Card - SOLO FRENTE */}
        <div className={`flip-card-front shadow-2xl flex flex-col items-center justify-center p-6 md:p-8 text-white relative overflow-hidden ${
          color.useImage ? '' : `bg-gradient-to-br ${color.bg}`
        }`}>
          {/* Background Image */}
          {color.useImage && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${color.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </>
          )}
          
          {/* Content wrapper - no z-index here to avoid layering issues */}
          <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110 relative w-full">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg flex-shrink-0">
              <Icon className={`w-10 h-10 md:w-12 md:h-12 ${color.text}`} />
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-center mb-3 md:mb-4 drop-shadow-lg break-words">{title}</h3>
            <div className="flex items-center justify-center space-x-2 text-white/90 animate-pulse drop-shadow-md text-xs md:text-sm">
              <span className="font-semibold">Haz clic para descubrir</span>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          {/* Decorative elements */}
          {!color.useImage && (
            <>
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </>
          )}
        </div>

        {/* Back of Card - SOLO ATRÁS */}
        <div className={`flip-card-back ${color.light} shadow-2xl flex flex-col p-4 md:p-6 overflow-hidden relative`}>
          {/* Header section - icon and title */}
          <div className="flex flex-col items-center mb-3 md:mb-4 flex-shrink-0">
            <div className={`w-8 h-8 md:w-10 md:h-10 ${color.icon} rounded-full flex items-center justify-center mb-1 md:mb-2 flex-shrink-0`}>
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className={`text-base md:text-xl font-bold ${color.text} text-center break-words`}>{title}</h3>
          </div>
          
          {/* Content section - scrollable */}
          <div className="flex-1 flex items-center justify-center px-1 md:px-2 overflow-y-auto min-h-[120px]">
            <p className="text-gray-700 leading-relaxed text-xs md:text-sm text-center break-words">{content}</p>
          </div>

          {/* Decorative corner elements - separate from content */}
          <div className={`absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 ${color.icon} opacity-5 rounded-bl-full pointer-events-none`}></div>
          <div className={`absolute bottom-0 left-0 w-16 md:w-24 h-16 md:h-24 ${color.icon} opacity-5 rounded-tr-full pointer-events-none`}></div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
