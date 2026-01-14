import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Navbar from './components/Navbar';
import AdminLogin from './components/AdminLogin';
import Historia from './components/Historia';
import VisionMision from './components/VisionMision';
import NewsSection from './components/NewsSection';
import NewsManagement from './components/NewsManagement';
import DirectoryManagement from './components/DirectoryManagement';
import ProyectoEducativo from './components/ProyectoEducativo';
import ProyectoEducativoManagement from './components/ProyectoEducativoManagement';
import StudentWithdrawalControl from './components/StudentWithdrawalControl';
import AdminDashboard from './components/AdminDashboard';
import Tour360Section from './components/Tour360Section';
import ACLESSection from './components/ACLESSection';
import DepartamentoOrientacionSection from './components/DepartamentoOrientacionSection';
import DepartamentoOrientacionManagement from './components/DepartamentoOrientacionManagement';
import VicerretoriaFormacionSection from './components/VicerretoriaFormacionSection';
import InstitutionalDocuments from './components/InstitutionalDocuments';
import InstitutionalDocumentsManagement from './components/InstitutionalDocumentsManagement';
import CEALSection from './components/CEALSection';
import FamiliaSection from './components/FamiliaSection';
import EducadoresSection from './components/EducadoresSection';
import PastoralJuvenilSection from './components/PastoralJuvenilSection';
import CEALManagement from './components/CEALManagement';
import PastoralManagement from './components/PastoralManagement';
import AnuariosSection from './components/AnuariosSection';
import AnuariosManagement from './components/AnuariosManagement';
import FundacionPentecostes from './components/FundacionPentecostes';
import AdmisionSection from './components/AdmisionSection';
import AdmisionManagement from './components/AdmisionManagement';
import BibliotecaSection from './components/BibliotecaSection';
import BibliotecaManagement from './components/BibliotecaManagement';
import UtilesEscolaresSection from './components/UtilesEscolaresSection';
import UtilesEscolaresManagement from './components/UtilesEscolaresManagement';
import CasinoModal from './components/CasinoModal';
import CasinoManagement from './components/CasinoManagement';
import UniformesEscolaresSection from './components/UniformesEscolaresSection';
import UniformesEscolaresManagement from './components/UniformesEscolaresManagement';
import HorariosSection from './components/HorariosSection';
import HorariosManagement from './components/HorariosManagement';
import PagosSection from './components/PagosSection';
import PagosManagement from './components/PagosManagement';
import RecursosDigitalesSection from './components/RecursosDigitalesSection';
import RecursosDigitalesManagement from './components/RecursosDigitalesManagement';
import FechasImportantesSection from './components/FechasImportantesSection';
import FechasImportantesManagement from './components/FechasImportantesManagement';
import AnnouncementPopup from './components/AnnouncementPopup';
import AnnouncementManagement from './components/AnnouncementManagement';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import PlanLectorSection from './components/PlanLectorSection';
import PlanLectorManagement from './components/PlanLectorManagement';

const backgroundImages = [
  'https://i.postimg.cc/63qmNSkN/Vinculos.jpg',
  'https://i.postimg.cc/VNDVp1Hn/Santuario.jpg',
  'https://i.postimg.cc/jSYmJM7R/Infraestructura.jpg',
  'https://i.postimg.cc/kMZk7JMV/Deporte.jpg',
  'https://i.postimg.cc/XJYTYXC6/Cicloinicial1.jpg'
];

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showCasinoModal, setShowCasinoModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePageChange = (page: string) => {
    if (page === 'casino') {
      setShowCasinoModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  // Expose a simple global navigation helper so inner components
  // can switch pages without threading the onPageChange prop everywhere.
  // This keeps existing state-driven navigation but allows button links
  // in components like BibliotecaSection to open the Plan Lector view.
  (window as any).navigateTo = handlePageChange;

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentPage('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
  };

  const handleBackToAdmin = () => {
    setCurrentPage('admin');
  };

  if (currentPage === 'historia') {
    return <Historia onBack={handleBackToHome} />;
  }

  if (currentPage === 'vision-mision') {
    return <VisionMision onBack={handleBackToHome} />;
  }

  if (currentPage === 'acles') {
    return <ACLESSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'departamento-orientacion') {
    return <DepartamentoOrientacionSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'vicerrectoria-formacion') {
    return <VicerretoriaFormacionSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'tour-virtual') {
    return <Tour360Section onBack={handleBackToHome} />;
  }

  if (currentPage === 'documentos-institucionales') {
    return <InstitutionalDocuments onBack={handleBackToHome} />;
  }

  if (currentPage === 'ceal') {
    return <CEALSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'familia') {
    return <FamiliaSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'educadores') {
    return <EducadoresSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'pastoral-juvenil') {
    return <PastoralJuvenilSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'anuarios') {
    return <AnuariosSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'institutional-documents-management') {
    return <InstitutionalDocumentsManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'ceal-management') {
    return <CEALManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'pastoral-management') {
    return <PastoralManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'anuarios-management') {
    return <AnuariosManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'fundacion-pentecostes') {
    return <FundacionPentecostes onBack={handleBackToHome} />;
  }

  if (currentPage === 'admision') {
    return <AdmisionSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'biblioteca') {
    return <BibliotecaSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'utiles-escolares') {
    return <UtilesEscolaresSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'uniformes-escolares') {
    return <UniformesEscolaresSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'horarios') {
    return <HorariosSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'pagos') {
    return <PagosSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'recursos-digitales') {
    return <RecursosDigitalesSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'fechas-importantes') {
    return <FechasImportantesSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'admision-management') {
    return <AdmisionManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'biblioteca-management') {
    return <BibliotecaManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'utiles-escolares-management') {
    return <UtilesEscolaresManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'casino-management') {
    return <CasinoManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'uniformes-escolares-management') {
    return <UniformesEscolaresManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'horarios-management') {
    return <HorariosManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'pagos-management') {
    return <PagosManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'recursos-digitales-management') {
    return <RecursosDigitalesManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'fechas-importantes-management') {
    return <FechasImportantesManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'announcement-management') {
    return <AnnouncementManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'departamento-orientacion-management') {
    return <DepartamentoOrientacionManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'news-management') {
    return <NewsManagement onBack={handleBackToAdmin} />;
  }


  if (currentPage === 'directory-management') {
    return <DirectoryManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'proyecto-educativo') {
    return <ProyectoEducativo onBack={handleBackToHome} />;
  }

  if (currentPage === 'plan-lector') {
    return <PlanLectorSection onBack={handleBackToHome} />;
  }

  if (currentPage === 'plan-lector-management') {
    return <PlanLectorManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'proyecto-educativo-management') {
    return <ProyectoEducativoManagement onBack={handleBackToAdmin} />;
  }

  if (currentPage === 'admin') {
    if (!isAdminAuthenticated) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminDashboard onNavigate={handlePageChange} onLogout={handleAdminLogout} />;
  }

  if (currentPage === 'student-withdrawal') {
    return <StudentWithdrawalControl onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Announcement Popup */}
      <AnnouncementPopup />
      
      {/* Navigation - Static at top */}
      <Navbar onPageChange={handlePageChange} />

      {/* Hero Section with Background */}
      <div className="relative min-h-screen overflow-hidden">
      {/* Background Images with Slideshow */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1500 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          >
            {/* Overlay negro solo para la tercera imagen */}
            {index === 2 && (
              <div className="absolute inset-0 bg-black/40" />
            )}
          </div>
        ))}
        
        {/* Light Overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pt-24 pb-20">
        {/* Hero Section */}
        <main className="px-8 md:px-12 lg:px-16">
          <div className="text-left max-w-4xl">
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-wide drop-shadow-lg">
              Colegio Sagrada Familia
            </h1>
            
            <p className="text-white text-base md:text-lg lg:text-xl mb-6 leading-relaxed font-medium max-w-2xl drop-shadow-md">
              Formamos personas íntegras, comprometidas con Cristo y orientadas al servicio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => handlePageChange('proyecto-educativo')}
                className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-transparent border-2 border-white rounded-none overflow-hidden transition-all duration-300 hover:bg-white hover:text-gray-800 drop-shadow-lg uppercase tracking-wide"
              >
                <span className="relative z-10 flex items-center">
                  VER MÁS
                </span>
              </button>
              
              <button
                onClick={() => {
                  const newsSection = document.getElementById('news-section');
                  if (newsSection) {
                    newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-transparent border-2 border-white rounded-none overflow-hidden transition-all duration-300 hover:bg-white hover:text-gray-800 drop-shadow-lg uppercase tracking-wide"
              >
                <span className="relative z-10 flex items-center">
                  NOTICIAS
                </span>
              </button>
            </div>
          </div>
        </main>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      </div>

      {/* Quiénes Somos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-600 font-medium">
                <div className="w-8 h-0.5 bg-red-600"></div>
                <span>Quiénes Somos</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 leading-tight">
                Una comunidad educativa católica, a semejanza de María
              </h2>
              
              <p className="text-gray-600 text-base leading-relaxed">
                El Colegio Sagrada Familia inició sus actividades en 1992, junto al Santuario de Schoenstatt, 
                ubicado en Reñaca, Viña del Mar. Nació porque el cambio de siglo mostró la necesidad de fomentar 
                valores familiares y sociales y ante esta urgencia, un grupo de laicos y sacerdotes de este 
                Movimiento de Iglesia se vieron motivados a crear una institución, con estilo familiar, orientada 
                por los principios del Evangelio y fundamentada en el modelo pedagógico del P. José Kentenich 
                (1885 – 1968), fundador de Schoenstatt.
              </p>
              
              <button 
                onClick={() => handlePageChange('historia')}
                className="inline-flex items-center bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 group"
              >
                Ver Más
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            
            {/* Right Image */}
            <div className="relative">
              <div className="relative">
                {/* Decorative red square background */}
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-red-400 to-red-600 opacity-20"></div>
                
                {/* Main image with square crop */}
                <div className="relative w-80 h-80 mx-auto overflow-hidden shadow-2xl rounded-lg">
                  <img
                    src="https://i.postimg.cc/9FgP60Wc/Quienessomos.jpg"
                    alt="Colegio Sagrada Familia"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                
                {/* Additional decorative elements */}
                <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 opacity-30 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSection />

      {/* Editorial Section removed */}

      {/* 360 Tour Section */}
      <Tour360Section />

      {/* Map Section */}
      <MapSection />

      {/* Footer */}
      <Footer onPageChange={handlePageChange} />

      {/* Casino Modal */}
      <CasinoModal isOpen={showCasinoModal} onClose={() => setShowCasinoModal(false)} />
    </div>

  );
}

export default App;