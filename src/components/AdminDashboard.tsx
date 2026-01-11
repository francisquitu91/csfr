import React from 'react';
import { FileText, Users, ArrowLeft, LogOut, BookOpen, FolderOpen, UserCheck, Heart, ShoppingBag, UtensilsCrossed, Shirt, Clock, CreditCard, Monitor, Calendar, Bell, Lock } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const adminOptions = [
    {
      id: 'news-management',
      title: 'Gestión de Noticias',
      description: 'Crear, editar y administrar las noticias del colegio',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'directory-management',
      title: 'Gestión de Directorio',
      description: 'Administrar miembros del directorio y rectoría',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-600 hover:bg-purple-700',
      iconBg: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'proyecto-educativo-management',
      title: 'Gestión Proyecto Educativo',
      description: 'Administrar contenido del proyecto educativo',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-orange-600 hover:bg-orange-700',
      iconBg: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'institutional-documents-management',
      title: 'Gestión de Documentos Institucionales',
      description: 'Administrar documentos oficiales del colegio',
      icon: <FolderOpen className="w-8 h-8" />,
      color: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100 text-red-600'
    },
    {
      id: 'ceal-management',
      title: 'Gestión CEAL',
      description: 'Administrar Centro de Alumnos y fotos',
      icon: <UserCheck className="w-8 h-8" />,
      color: 'bg-cyan-600 hover:bg-cyan-700',
      iconBg: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 'pastoral-management',
      title: 'Gestión Pastoral Juvenil',
      description: 'Administrar Pastoral Juvenil y fotos',
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-pink-600 hover:bg-pink-700',
      iconBg: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'anuarios-management',
      title: 'Gestión de Anuarios',
      description: 'Administrar anuarios escolares protegidos',
      icon: <Lock className="w-8 h-8" />,
      color: 'bg-purple-600 hover:bg-purple-700',
      iconBg: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'admision-management',
      title: 'Gestión de Admisión',
      description: 'Administrar información de admisión y contacto',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      iconBg: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'biblioteca-management',
      title: 'Gestión de Biblioteca',
      description: 'Administrar planes lectores y recursos',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-amber-600 hover:bg-amber-700',
      iconBg: 'bg-amber-100 text-amber-600'
    },
    {
      id: 'utiles-escolares-management',
      title: 'Gestión de Útiles Escolares',
      description: 'Administrar listas de útiles por nivel',
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'bg-teal-600 hover:bg-teal-700',
      iconBg: 'bg-teal-100 text-teal-600'
    },
    {
      id: 'casino-management',
      title: 'Gestión de Casino',
      description: 'Administrar menú del casino',
      icon: <UtensilsCrossed className="w-8 h-8" />,
      color: 'bg-orange-600 hover:bg-orange-700',
      iconBg: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'uniformes-escolares-management',
      title: 'Gestión de Uniformes Escolares',
      description: 'Administrar especificaciones de uniformes',
      icon: <Shirt className="w-8 h-8" />,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      iconBg: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'horarios-management',
      title: 'Gestión de Horarios',
      description: 'Administrar horarios por curso',
      icon: <Clock className="w-8 h-8" />,
      color: 'bg-green-600 hover:bg-green-700',
      iconBg: 'bg-green-100 text-green-600'
    },
    {
      id: 'pagos-management',
      title: 'Gestión de Pagos',
      description: 'Configurar link de plataforma de pagos',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'recursos-digitales-management',
      title: 'Gestión de Recursos Digitales',
      description: 'Administrar instructivos de ClassRoom',
      icon: <Monitor className="w-8 h-8" />,
      color: 'bg-purple-600 hover:bg-purple-700',
      iconBg: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'fechas-importantes-management',
      title: 'Gestión de Fechas Importantes',
      description: 'Administrar calendario de actividades y eventos',
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-amber-600 hover:bg-amber-700',
      iconBg: 'bg-amber-100 text-amber-600'
    },
    {
      id: 'announcement-management',
      title: 'Anuncio Popup',
      description: 'Gestionar anuncio emergente para usuarios',
      icon: <Bell className="w-8 h-8" />,
      color: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100 text-red-600'
    },
    {
      id: 'departamento-orientacion-management',
      title: 'Dpto. de Orientación',
      description: 'Administrar equipo y contenido de orientación',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Panel de Administración
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Gestiona el contenido del sitio web del Colegio Sagrada Familia
          </p>
          
          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="absolute top-0 right-0 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>

        {/* Admin Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {adminOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => onNavigate(option.id)}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${option.iconBg}`}>
                    {option.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  {option.title}
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  {option.description}
                </p>
                
                <button
                  className={`w-full text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${option.color}`}
                >
                  Acceder
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Gestión Integral</h4>
            <p className="text-gray-600 text-sm">
              Administra todo el contenido desde un solo lugar
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fácil de Usar</h4>
            <p className="text-gray-600 text-sm">
              Interface intuitiva y amigable para todos los usuarios
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Contenido Rico</h4>
            <p className="text-gray-600 text-sm">
              Soporte para imágenes, videos y texto formateado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;