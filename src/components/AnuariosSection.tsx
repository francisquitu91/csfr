import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Calendar, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnuariosProps {
  onBack: () => void;
}

interface DocumentoAnuario {
  id: number;
  title: string;
  file_url: string;
  year: string;
  created_at: string;
}

const AnuariosSection: React.FC<AnuariosProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [documentos, setDocumentos] = useState<DocumentoAnuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const CORRECT_PASSWORD = 'Anuario2022CSFR';

  useEffect(() => {
    setIsVisible(true);
    // No cargar documentos hasta que se ingrese la contraseña
  }, []);

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setIsPasswordProtected(false);
      setPasswordError('');
      fetchDocumentos();
    } else {
      setPasswordError('Contraseña incorrecta. Por favor intenta de nuevo.');
      setPassword('');
    }
  };

  const fetchDocumentos = async () => {
    try {
      const { data, error } = await supabase
        .from('anuarios')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      if (data) setDocumentos(data);
    } catch (error) {
      console.error('Error fetching documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center">
              <Lock className="w-8 h-8 mr-3 text-blue-600" />
              Anuarios
            </h1>
            <p className="text-lg text-gray-600">Documentos históricos y memorables del colegio</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Si está protegida por contraseña, mostrar diálogo */}
        {isPasswordProtected ? (
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Lock className="w-8 h-8 text-white" />
                    <h2 className="text-2xl font-bold text-white">Acceso Restringido</h2>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <p className="text-gray-700 text-center">
                    Para acceder a los anuarios, ingresa la contraseña:
                  </p>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      placeholder="Ingresa la contraseña"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {passwordError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {passwordError}
                    </div>
                  )}

                  <button
                    onClick={handlePasswordSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Acceder
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Descripción */}
            <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-white" />
                    <h2 className="text-3xl font-bold text-white">Información General</h2>
                  </div>
                </div>

                <div className="p-8 space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Los anuarios son documentos que recopilan los momentos más importantes y memorables de nuestra comunidad escolar. 
                    Aquí encontrarás un registro histórico de actividades, graduaciones y eventos especiales del colegio.
                  </p>

                  <p className="text-lg">
                    Te invitamos a descargar y revizar los anuarios de los diferentes años escolares. Estos documentos son 
                    una excelente manera de recordar los momentos compartidos en nuestra institución educativa.
                  </p>

                  <div className="bg-blue-50 rounded-xl p-6 mt-6 border-l-4 border-blue-600">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">Recomendaciones</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2">•</span>
                        <span>Los archivos están en formato PDF para fácil acceso.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2">•</span>
                        <span>Puedes descargar los anuarios para guardados en tu dispositivo.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2">•</span>
                        <span>Los anuarios contienen información importante y recuerdos del colegio.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Anuarios */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} delay-300`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Anuarios Disponibles</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Cargando anuarios...</p>
                </div>
              ) : documentos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documentos.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-white opacity-30" />
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {doc.title}
                        </h3>

                        <p className="text-sm text-gray-500 mb-4 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Año: {doc.year}
                        </p>

                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          <Download className="w-5 h-5" />
                          <span>Descargar PDF</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aún no se han publicado anuarios.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnuariosSection;
