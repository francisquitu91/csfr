import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { fetchLibrosEstanteria, getGoogleDrivePreviewUrl } from '../lib/estanteriaVirtual';

interface EstanteriaVirtualSectionProps {
  onBack: () => void;
}

interface LibroEstanteria {
  id: string;
  title: string;
  drive_link: string;
  cover_image_url?: string;
  author?: string;
  description?: string;
  category?: string;
  order_index?: number;
}

const EstanteriaVirtualSection: React.FC<EstanteriaVirtualSectionProps> = ({ onBack }) => {
  const [libros, setLibros] = useState<LibroEstanteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLibro, setSelectedLibro] = useState<LibroEstanteria | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    loadLibros();
  }, []);

  const loadLibros = async () => {
    setLoading(true);
    try {
      const data = await fetchLibrosEstanteria();
      setLibros(data);
      
      // Extract unique categories
      const cats = Array.from(new Set(data.map(l => l.category).filter(Boolean)));
      setCategories(cats as string[]);
    } catch (error) {
      console.error('Error loading libros:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLibros = selectedCategory
    ? libros.filter(l => l.category === selectedCategory)
    : libros;

  const handleLibroClick = (libro: LibroEstanteria) => {
    setSelectedLibro(libro);
  };

  useEffect(() => {
    if (!selectedLibro) return;

    const focusViewer = () => {
      iframeRef.current?.focus();
    };

    const timer = window.setTimeout(focusViewer, 200);
    return () => window.clearTimeout(timer);
  }, [selectedLibro]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Estantería Virtual</h1>
          <p className="text-gray-600 mt-2">Accede a nuestra colección de libros disponibles en línea</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Filtrar por categoría</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando libros...</p>
          </div>
        ) : filteredLibros.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay libros disponibles en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLibros.map(libro => (
              <div
                key={libro.id}
                onClick={() => handleLibroClick(libro)}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden"
              >
                <div className="relative">
                  {libro.cover_image_url ? (
                    <img
                      src={libro.cover_image_url}
                      alt={libro.title}
                      className="w-full h-80 object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center">
                      <span className="text-white text-center px-4 font-semibold">{libro.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold opacity-0 hover:opacity-100 transition-opacity">
                      Ver Libro
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-2">{libro.title}</h3>
                  {libro.author && <p className="text-sm text-gray-600 mt-1">{libro.author}</p>}
                  {libro.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-2">
                      {libro.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Reader */}
      {selectedLibro && (
        <div className="fixed inset-0 z-[100] bg-black/80">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-black/70 flex items-center justify-between px-4 md:px-6">
            <div className="flex-1">
              <h3 className="text-white font-semibold line-clamp-1">{selectedLibro.title}</h3>
              {selectedLibro.author && (
                <p className="text-gray-300 text-sm">Por {selectedLibro.author}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedLibro(null)}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ml-4 flex-shrink-0"
            >
              <X className="w-4 h-4" />
              Cerrar
            </button>
          </div>

          {/* PDF Viewer with iframe wrapper for zoom and margins */}
          <div className="w-full h-full pt-16 flex items-center justify-center p-4">
            <div className="w-full bg-white rounded-lg shadow-2xl overflow-hidden flex" style={{ height: '70vh' }}>
              {/* Margins container with enhanced zoom - maintains internal padding */}
              <div className="flex-1 flex items-center justify-center bg-gray-100 p-8 overflow-hidden">
                <div className="w-full h-full bg-white rounded overflow-hidden" style={{ 
                  width: '130%', 
                  height: '150%',
                  marginTop: '-15px',
                  marginBottom: '-40px',
                  marginLeft: '-15%'
                }}>
                  <iframe
                    ref={iframeRef}
                    title={`Lectura: ${selectedLibro.title}`}
                    src={getGoogleDrivePreviewUrl(selectedLibro.drive_link.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1] || '')}
                    className="w-full h-full border-none"
                    allow="autoplay"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
                    tabIndex={0}
                    onLoad={() => {
                      iframeRef.current?.focus();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstanteriaVirtualSection;
