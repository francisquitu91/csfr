import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Instagram, Facebook } from 'lucide-react';

interface NavbarProps {
  onPageChange: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      name: 'COLEGIO',
      href: '#',
      dropdown: [
        'QUIÉNES SOMOS',
        'PROYECTO EDUCATIVO',
        'ÁREA ACADÉMICA',
        'TOUR VIRTUAL',
        'FORMACIÓN',
        'DOCUMENTOS INSTITUCIONALES'
      ]
    },
    {
      name: 'COMUNIDAD ESCOLAR',
      href: '#',
      dropdown: [
        'CEAL',
        'PASTORAL JUVENIL',
        'ANUARIOS',
        'RECURSOS DIGITALES',
        'FUNDACIÓN PENTÉCOSTES'
      ]
    },
    { name: 'ADMISIÓN', href: '#' },
    {
      name: 'INFORMACIÓN',
      href: '#',
      dropdown: [
        'BIBLIOTECA',
        'ÚTILES ESCOLARES',
        'CASINO',
        'UNIFORMES ESCOLARES',
        'HORARIOS',
        'PAGOS',
        'FECHAS IMPORTANTES'
      ]
    }
  ];

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const handleMenuClick = (itemName: string) => {
    if (itemName === 'QUIÉNES SOMOS') {
      onPageChange('historia');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'PROYECTO EDUCATIVO') {
      onPageChange('proyecto-educativo');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'TOUR VIRTUAL') {
      onPageChange('tour-virtual');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'DOCUMENTOS INSTITUCIONALES') {
      onPageChange('documentos-institucionales');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'CEAL') {
      onPageChange('ceal');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'PASTORAL JUVENIL') {
      onPageChange('pastoral-juvenil');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'ANUARIOS') {
      onPageChange('anuarios');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'FUNDACIÓN PENTÉCOSTES') {
      onPageChange('fundacion-pentecostes');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'ADMISIÓN') {
      onPageChange('admision');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'BIBLIOTECA') {
      onPageChange('biblioteca');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'ÚTILES ESCOLARES') {
      onPageChange('utiles-escolares');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'CASINO') {
      onPageChange('casino');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'UNIFORMES ESCOLARES') {
      onPageChange('uniformes-escolares');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'HORARIOS') {
      onPageChange('horarios');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'PAGOS') {
      onPageChange('pagos');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'FECHAS IMPORTANTES') {
      onPageChange('fechas-importantes');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'RECURSOS DIGITALES') {
      onPageChange('recursos-digitales');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'ACLES') {
      onPageChange('acles');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'DEPARTAMENTO DE ORIENTACIÓN') {
      onPageChange('departamento-orientacion');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'VICERRECTORÍA DE FORMACIÓN') {
      onPageChange('vicerrectoria-formacion');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'GESTIÓN DE NOTICIAS') {
      onPageChange('news-management');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'ADMIN') {
      onPageChange('admin');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    }
    else if (itemName === 'PLAN LECTOR') {
      onPageChange('plan-lector');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'PLAN LECTOR') {
      onPageChange('plan-lector');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'GESTIÓN PLAN LECTOR') {
      onPageChange('plan-lector-management');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    } else if (itemName === 'GESTIÓN PLAN LECTOR') {
      onPageChange('plan-lector-management');
      setActiveDropdown(null);
      setActiveSubDropdown(null);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-red-600/85 backdrop-blur-lg shadow-lg' 
        : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 ml-8">
            <img
              src="https://i.postimg.cc/FN3R296R/1.png"
              alt="Colegio Sagrada Familia Logo"
              className="h-32 w-auto object-contain"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-end">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-300 rounded whitespace-nowrap ${
                    isScrolled 
                      ? 'text-white hover:bg-white/20 hover:text-white' 
                      : 'text-white hover:bg-red-600 hover:text-white'
                  }`}
                  onClick={() => !item.dropdown && handleMenuClick(item.name)}
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => !item.dropdown && setActiveDropdown(null)}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 mt-0 w-80 bg-white shadow-lg z-[9999] transition-all duration-200 border border-gray-200 ${
                      activeDropdown === item.name ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="py-2">
                      {item.dropdown.map((subItem) => (
                        <div key={subItem} className="relative">
                          <button
                            onClick={() => handleMenuClick(subItem)}
                            onMouseEnter={() => (subItem === 'ÁREA ACADÉMICA' || subItem === 'FORMACIÓN') ? setActiveSubDropdown(subItem) : setActiveSubDropdown(null)}
                            className="flex items-center justify-between w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                          >
                            {subItem}
                            {(subItem === 'ÁREA ACADÉMICA' || subItem === 'FORMACIÓN') && (
                              <ChevronDown className="ml-1 h-4 w-4 rotate-[-90deg]" />
                            )}
                          </button>
                          
                          {/* Sub-dropdown for Área Académica */}
                          {subItem === 'ÁREA ACADÉMICA' && (
                            <div
                              className={`absolute left-full top-0 w-60 bg-white shadow-lg border border-gray-200 transition-all duration-200 ${
                                activeSubDropdown === 'ÁREA ACADÉMICA' ? 'opacity-100 visible' : 'opacity-0 invisible'
                              }`}
                              onMouseEnter={() => setActiveSubDropdown('ÁREA ACADÉMICA')}
                              onMouseLeave={() => setActiveSubDropdown(null)}
                            >
                              <div className="py-2">
                                <button
                                  onClick={() => handleMenuClick('ACLES')}
                                  className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                                >
                                  ACLES
                                </button>
                              </div>
                            </div>
                          )}
                          {/* Plan Lector mobile options */}
                          {subItem === 'DOCUMENTOS INSTITUCIONALES' && activeSubDropdown === 'DOCUMENTOS INSTITUCIONALES' && (
                            <div className="pl-4 space-y-1">
                              <button
                                onClick={() => handleMenuClick('PLAN LECTOR')}
                                className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-red-600 transition-colors duration-200 rounded"
                              >
                                PLAN LECTOR
                              </button>
                              <button
                                onClick={() => handleMenuClick('GESTIÓN PLAN LECTOR')}
                                className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-red-600 transition-colors duration-200 rounded"
                              >
                                GESTIÓN PLAN LECTOR
                              </button>
                            </div>
                          )}

                          {/* Sub-dropdown for Formación */}
                          {subItem === 'FORMACIÓN' && (
                            <div
                              className={`absolute left-full top-0 w-72 bg-white shadow-lg border border-gray-200 transition-all duration-200 ${
                                activeSubDropdown === 'FORMACIÓN' ? 'opacity-100 visible' : 'opacity-0 invisible'
                              }`}
                              onMouseEnter={() => setActiveSubDropdown('FORMACIÓN')}
                              onMouseLeave={() => setActiveSubDropdown(null)}
                            >
                              <div className="py-2">
                                <button
                                  onClick={() => handleMenuClick('DEPARTAMENTO DE ORIENTACIÓN')}
                                  className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200 border-b border-gray-200"
                                >
                                  DEPARTAMENTO DE ORIENTACIÓN
                                </button>
                                <button
                                  onClick={() => handleMenuClick('VICERRECTORÍA DE FORMACIÓN')}
                                  className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                                >
                                  VICERRECTORÍA DE FORMACIÓN
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 ml-6">
              <a
                href="https://www.instagram.com/colegiosagradafamilia_oficial/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-300 ${
                  isScrolled ? 'text-white hover:text-red-200' : 'text-white hover:text-red-300'
                }`}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/pages/Colegio-Sagrada-Familia-Re%C3%B1aca/170422360190468"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-300 ${
                  isScrolled ? 'text-white hover:text-red-200' : 'text-white hover:text-red-300'
                }`}
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-colors duration-300 focus:outline-none ${
                isScrolled 
                  ? 'text-white hover:text-red-200 focus:text-red-200' 
                  : 'text-white hover:text-red-300 focus:text-red-300'
              }`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
  {/* Horizontal line delimiter: full width */}
  <div className={`absolute bottom-0 left-0 right-0 h-px transition-colors duration-300 ${
    isScrolled ? 'bg-white/20' : 'bg-white/30'
  }`}></div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200/30 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                <button
                  className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-white hover:bg-red-600 hover:text-white transition-colors duration-200 rounded"
                  onClick={() => item.dropdown ? handleDropdownToggle(item.name) : handleMenuClick(item.name)}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </button>

                {/* Mobile Dropdown */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="pl-4 space-y-1">
                    {item.dropdown.map((subItem) => (
                      <div key={subItem}>
                        <button
                          onClick={() => (subItem === 'ÁREA ACADÉMICA' || subItem === 'FORMACIÓN') ? setActiveSubDropdown(activeSubDropdown === subItem ? null : subItem) : handleMenuClick(subItem)}
                          className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-red-600 transition-colors duration-200 rounded"
                        >
                          {subItem}
                          {(subItem === 'ÁREA ACADÉMICA' || subItem === 'FORMACIÓN') && (
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform duration-200 ${
                                activeSubDropdown === subItem ? 'rotate-180' : ''
                              }`} 
                            />
                          )}
                        </button>

                        {/* Mobile Sub-dropdown for Área Académica */}
                        {subItem === 'ÁREA ACADÉMICA' && activeSubDropdown === 'ÁREA ACADÉMICA' && (
                          <div className="pl-4 space-y-1">
                            <button
                              onClick={() => handleMenuClick('ACLES')}
                              className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-red-600 transition-colors duration-200 rounded"
                            >
                              ACLES
                            </button>
                          </div>
                        )}

                        {/* Mobile Sub-dropdown for Formación */}
                        {subItem === 'FORMACIÓN' && activeSubDropdown === 'FORMACIÓN' && (
                          <div className="pl-4 space-y-1">
                            <button
                              onClick={() => handleMenuClick('DEPARTAMENTO DE ORIENTACIÓN')}
                              className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-red-600 transition-colors duration-200 rounded"
                            >
                              DEPARTAMENTO DE ORIENTACIÓN
                            </button>
                            <button
                              onClick={() => handleMenuClick('VICERRECTORÍA DE FORMACIÓN')}
                              className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-red-600 transition-colors duration-200 rounded"
                            >
                              VICERRECTORÍA DE FORMACIÓN
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Social Media Icons for Mobile */}
            <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200/30 mt-4">
              <a
                href="https://www.instagram.com/colegiosagradafamilia_oficial/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-300 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/pages/Colegio-Sagrada-Familia-Re%C3%B1aca/170422360190468"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-300 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;