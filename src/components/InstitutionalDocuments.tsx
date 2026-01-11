import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Calendar, FileType, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface InstitutionalDocumentsProps {
  onBack: () => void;
}

interface Document {
  id: string;
  category: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  order_index: number;
  created_at: string;
}

const InstitutionalDocuments: React.FC<InstitutionalDocumentsProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isVisible, setIsVisible] = useState(false);

  const categories = [
    { id: 'all', name: 'Todos', color: 'blue' },
    { id: 'Documentos de Matrícula 2026', name: 'Matrícula 2026', color: 'green' },
    { id: 'Documentos, protocolos y reglamentos del Colegio', name: 'Protocolos y Reglamentos', color: 'purple' },
    { id: 'Seguros escolares', name: 'Seguros Escolares', color: 'orange' },
    { id: 'Otros', name: 'Otros', color: 'gray' }
  ];

  useEffect(() => {
    setIsVisible(true);
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('institutional_documents')
        .select('*')
        .order('category')
        .order('order_index');

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('image')) return '🖼️';
    return '📎';
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const MATR_2025 = 'Documentos de Matrícula 2025';
  const MATR_2026 = 'Documentos de Matrícula 2026';

  let filteredDocuments: Document[] = documents;
  if (activeCategory !== 'all') {
    if (activeCategory === MATR_2026) {
      // Treat 2025 and 2026 as the same category in the UI so existing documents appear under 2026
      filteredDocuments = documents.filter(doc => doc.category === MATR_2026 || doc.category === MATR_2025);
    } else {
      filteredDocuments = documents.filter(doc => doc.category === activeCategory);
    }
  }

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    // Normalize old 2025 category to 2026 for display/grouping
    const key = doc.category === MATR_2025 ? MATR_2026 : doc.category;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'gray';
  };

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
            Documentos Institucionales
          </h1>
          <p className="text-gray-600 mt-2">Accede a todos los documentos oficiales del colegio</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className={`bg-white rounded-lg shadow-md p-4 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-${category.color}-600 text-white shadow-lg`
                    : `bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200`
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando documentos...</span>
          </div>
        ) : (
          /* Documents by Category */
          <div className="space-y-8">
            {Object.keys(groupedDocuments).length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No hay documentos disponibles en esta categoría</p>
              </div>
            ) : (
              Object.entries(groupedDocuments).map(([category, docs], index) => {
                const color = getCategoryColor(category);
                return (
                  <div
                    key={category}
                    className={`transition-all duration-1000 delay-${(index + 2) * 100} ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  >
                    <h2 className={`text-2xl font-bold text-${color}-700 mb-4 flex items-center`}>
                      <div className={`w-1 h-8 bg-${color}-600 mr-3 rounded`}></div>
                      {category}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      {docs.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-3xl">{getFileIcon(doc.file_type)}</span>
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {doc.title}
                                </h3>
                                {doc.description && (
                                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <FileType className="w-4 h-4" />
                                <span>{doc.file_type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatFileSize(doc.file_size)}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDownload(doc.file_url, doc.file_name)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                            >
                              <Download className="w-4 h-4" />
                              <span>Descargar</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionalDocuments;
