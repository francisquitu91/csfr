import React, { useState } from 'react';
import { 
  Dumbbell, 
  Palette, 
  Lightbulb
} from 'lucide-react';

interface ACLESCardProps {
  type: 'deportiva' | 'artistica' | 'cientifica';
  title: string;
  items: string[];
  imageUrl?: string;
}

const ACLESCard: React.FC<ACLESCardProps> = ({ type, title, items, imageUrl }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const configs: {
    [key: string]: {
      bg: string;
      icon: string;
      text: string;
      light: string;
      IconComponent: React.ComponentType<any>;
      useImage: boolean;
      image?: string;
    };
  } = {
    deportiva: {
      bg: 'from-green-500 to-green-700',
      icon: 'bg-green-600',
      text: 'text-green-600',
      light: 'bg-green-50',
      IconComponent: Dumbbell,
      useImage: !!imageUrl,
      image: imageUrl
    },
    artistica: {
      bg: 'from-purple-500 to-purple-700',
      icon: 'bg-purple-600',
      text: 'text-purple-600',
      light: 'bg-purple-50',
      IconComponent: Palette,
      useImage: !!imageUrl,
      image: imageUrl
    },
    cientifica: {
      bg: 'from-orange-500 to-orange-700',
      icon: 'bg-orange-600',
      text: 'text-orange-600',
      light: 'bg-orange-50',
      IconComponent: Lightbulb,
      useImage: !!imageUrl,
      image: imageUrl
    }
  };

  const config = configs[type];
  const Icon = config.IconComponent;

  return (
    <div 
      className={`flip-card h-80 md:h-80 sm:h-72 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        {/* Front of Card */}
        <div className={`flip-card-front shadow-2xl flex flex-col items-center justify-center p-6 md:p-8 text-white relative overflow-hidden ${
          config.useImage ? '' : `bg-gradient-to-br ${config.bg}`
        }`}>
          {/* Background Image */}
          {config.useImage && config.image && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${config.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </>
          )}
          
          <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110 relative w-full">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg flex-shrink-0">
              <Icon className={`w-10 h-10 md:w-12 md:h-12 ${config.text}`} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4 drop-shadow-lg break-words">{title}</h3>
            <div className="flex items-center justify-center space-x-2 text-white/90 animate-pulse drop-shadow-md text-xs md:text-sm">
              <span className="font-semibold">Haz clic para ver actividades</span>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          {/* Decorative elements - only for non-image cards */}
          {!config.useImage && (
            <>
              <div className="absolute top-4 right-4 w-16 md:w-20 h-16 md:h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 md:w-16 h-12 md:h-16 bg-white/10 rounded-full blur-xl"></div>
            </>
          )}
        </div>

        {/* Back of Card */}
        <div className={`flip-card-back ${config.light} shadow-2xl flex flex-col p-4 md:p-6 overflow-hidden relative`}>
          {/* Header section - icon and title */}
          <div className="flex flex-col items-center mb-3 md:mb-4 flex-shrink-0">
            <div className={`w-8 h-8 md:w-10 md:h-10 ${config.icon} rounded-full flex items-center justify-center mb-1 md:mb-2 flex-shrink-0`}>
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className={`text-base md:text-xl font-bold ${config.text} text-center break-words`}>{title}</h3>
          </div>
          
          {/* Content section - scrollable */}
          <div className="flex-1 flex items-center justify-center px-1 md:px-2 overflow-y-auto min-h-[120px]">
            <ul className="space-y-1 md:space-y-2 w-full">
              {items.map((item, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-700 text-xs md:text-sm">
                  <div className={`w-2 h-2 ${config.icon} rounded-full flex-shrink-0 mt-1`}></div>
                  <span className="font-medium break-words">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decorative corner elements - separate from content */}
          <div className={`absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 ${config.icon} opacity-5 rounded-bl-full pointer-events-none`}></div>
          <div className={`absolute bottom-0 left-0 w-16 md:w-24 h-16 md:h-24 ${config.icon} opacity-5 rounded-tr-full pointer-events-none`}></div>
        </div>
      </div>
    </div>
  );
};

export default ACLESCard;
