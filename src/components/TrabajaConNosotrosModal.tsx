import React, { useState, useEffect } from 'react';
import { X, Briefcase, Mail, FileText, Download, ChevronRight } from 'lucide-react';
import { supabase, JobPosting } from '../lib/supabase';

interface TrabajaConNosotrosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JobDetailModalProps {
  posting: JobPosting;
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ posting, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl p-6 sticky top-0 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Briefcase className="w-6 h-6" />
            <span className="truncate">{posting.title}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {posting.description && (
            <div>
              <p className="text-gray-700 leading-relaxed">{posting.description}</p>
            </div>
          )}

          {posting.file_url ? (
            <a
              href={posting.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg group"
            >
              <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              <span>Descargar Folleto</span>
            </a>
          ) : (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 text-sm">
                <strong>Nota:</strong> No hay archivo adjunto para esta oferta.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>¿Te interesa?</strong> Envía tu CV a{' '}
              <a
                href="mailto:postulaciones@csfr.cl"
                className="text-red-600 hover:text-red-700 font-semibold underline"
              >
                postulaciones@csfr.cl
              </a>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const TrabajaConNosotrosModal: React.FC<TrabajaConNosotrosModalProps> = ({ isOpen, onClose }) => {
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosting, setSelectedPosting] = useState<JobPosting | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPostings();
    }
  }, [isOpen]);

  const fetchPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPostings(data || []);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setPostings([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Trabaja con Nosotros</h2>
                <p className="text-red-100 text-sm mt-1">Únete a Nuestro Equipo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando ofertas...</p>
            </div>
          ) : postings.length === 0 ? (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Únete a Nuestro Equipo
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Si deseas integrarte a nuestra comunidad interna y ser parte del{' '}
                    <strong>Colegio Sagrada Familia de Reñaca</strong>, te invitamos a enviarnos
                    tu Currículum Vitae actualizado con el propósito de incorporarte en nuestros
                    continuos procesos de selección.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-6 h-6 text-red-600" />
                  <h4 className="text-lg font-bold text-gray-900">Envía tu CV a:</h4>
                </div>
                <a
                  href="mailto:postulaciones@csfr.cl"
                  className="text-2xl font-bold text-red-600 hover:text-red-700 hover:underline transition-colors block"
                >
                  postulaciones@csfr.cl
                </a>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> Todos los currículums recibidos serán evaluados y
                  considerados para futuras vacantes según las necesidades del colegio.
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Selecciona una oferta para ver los detalles:
              </p>
              <div className="grid gap-3">
                  {postings.map((posting) => (
                    <button
                      key={posting.id}
                      onClick={() => setSelectedPosting(posting)}
                      className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-red-100 rounded-full p-2 group-hover:bg-red-200 transition-colors">
                            <Briefcase className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                              {posting.title}
                            </h4>
                            {posting.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {posting.description.substring(0, 60)}
                                {posting.description.length > 60 ? '...' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-600">
                  <strong>¿No ves la oferta que buscas?</strong> Envía tu CV a{' '}
                  <a
                    href="mailto:postulaciones@csfr.cl"
                    className="text-red-600 hover:text-red-700 font-semibold underline"
                  >
                    postulaciones@csfr.cl
                  </a>
                  . Todos los currículums son evaluados para futuras oportunidades.
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedPosting && (
        <JobDetailModal
          posting={selectedPosting}
          onClose={() => setSelectedPosting(null)}
        />
      )}
    </div>
  );
};

export default TrabajaConNosotrosModal;
