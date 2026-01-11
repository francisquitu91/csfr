import React, { useState } from 'react';
import { Instagram, Facebook, Briefcase } from 'lucide-react';
import TrabajaConNosotrosModal from './TrabajaConNosotrosModal';

interface FooterProps {
  onPageChange: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  const [showTrabajaModal, setShowTrabajaModal] = useState(false);

  return (
    <footer className="bg-red-600/85 backdrop-blur-lg text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center space-y-8">
          {/* Logos Section */}
          <div className="flex items-center justify-center space-x-8 flex-wrap">
            {/* Sagrada Familia Logo */}
            <div className="flex items-center">
              <img 
                src="https://colegiosagradafamilia.cl/www/wp-content/uploads/2022/04/cropped-logo-hd-1.png"
                alt="Colegio Sagrada Familia Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            
            {/* Additional Logo */}
            <div className="flex items-center">
              <img 
                src="https://uemtn.edu.ec/wp-content/uploads/2025/04/logos1.png"
                alt="Logo Adicional"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Botón Trabaja con Nosotros */}
          <button
            onClick={() => setShowTrabajaModal(true)}
            className="inline-flex items-center space-x-2 bg-white text-red-900 px-6 py-3 rounded-lg font-bold hover:bg-red-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Briefcase className="w-5 h-5" />
            <span>Trabaja con Nosotros</span>
          </button>

          {/* Copyright Text */}
          <div className="text-center">
            <p className="text-gray-300 text-sm md:text-base">
              Colegio Sagrada Familia | Copyright ® 1999 - 2025 | 
              <span className="hover:text-white transition-colors cursor-pointer ml-1">
                Política de Privacidad
              </span>
            </p>
          </div>

          {/* Additional Info */}
          <div className="text-center text-gray-400 text-xs">
            <p>Parcela 4, Los Pinos, Reñaca - Casilla 5104 – Correo Reñaca</p>
            <p className="mt-1">Formando líderes desde 1992</p>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="mt-8 pt-8 border-t border-red-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="text-red-200 text-xs">
                <p>Sitio web desarrollado por Tourify.cl</p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.instagram.com/colegiosagradafamilia_oficial/?hl=es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/pages/Colegio-Sagrada-Familia-Re%C3%B1aca/170422360190468"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-200 hover:text-white transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Admin Button */}
            <button
              onClick={() => onPageChange('admin')}
              className="text-xs text-red-200 hover:text-white transition-colors duration-200 px-3 py-1 border border-red-600 rounded hover:bg-red-600"
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Modal Trabaja con Nosotros */}
      <TrabajaConNosotrosModal isOpen={showTrabajaModal} onClose={() => setShowTrabajaModal(false)} />
    </footer>
  );
};

export default Footer;