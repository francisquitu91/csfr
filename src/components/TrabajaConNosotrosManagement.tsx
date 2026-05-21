import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Plus, X, Edit, Upload, FileText, Eye } from 'lucide-react';
import { supabase, JobPosting } from '../lib/supabase';

interface TrabajaConNosotrosManagementProps {
  onBack: () => void;
}

interface JobPostingForm extends JobPosting {
  file: File | null;
}

const TrabajaConNosotrosManagement: React.FC<TrabajaConNosotrosManagementProps> = ({ onBack }) => {
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingPosting, setEditingPosting] = useState<JobPostingForm | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewPosting, setPreviewPosting] = useState<JobPosting | null>(null);

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPostings(data || []);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setMessage('Error al cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  const removeStoredFile = async (fileUrl: string | undefined | null) => {
    if (!fileUrl) return;
    try {
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('institutional-documents')
          .remove([fileName]);
      }
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const uploadJobFile = async (file: File): Promise<{ fileUrl: string; fileName: string }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `job-posting-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('institutional-documents')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('institutional-documents')
      .getPublicUrl(fileName);

    return {
      fileUrl: data.publicUrl,
      fileName: file.name
    };
  };

  const handleSavePosting = async (posting: JobPostingForm) => {
    setLoading(true);
    try {
      let fileUrl = posting.file_url ?? null;
      let fileName = posting.file_name ?? null;

      if (posting.file) {
        await removeStoredFile(posting.file_url);
        const uploadedFile = await uploadJobFile(posting.file);
        fileUrl = uploadedFile.fileUrl;
        fileName = uploadedFile.fileName;
      }

      if (posting.id) {
        await supabase
          .from('job_postings')
          .update({
            title: posting.title,
            description: posting.description,
            file_url: fileUrl,
            file_name: fileName,
            order_index: posting.order_index,
            is_active: posting.is_active
          })
          .eq('id', posting.id);
        setMessage('Oferta actualizada exitosamente');
      } else {
        await supabase
          .from('job_postings')
          .insert([{
            title: posting.title,
            description: posting.description,
            file_url: fileUrl,
            file_name: fileName,
            order_index: postings.length,
            is_active: true
          }]);
        setMessage('Oferta creada exitosamente');
      }
      setEditingPosting(null);
      setIsCreating(false);
      fetchPostings();
    } catch (error) {
      console.error('Error saving posting:', error);
      setMessage('Error al guardar la oferta');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePosting = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta oferta?')) return;
    
    setLoading(true);
    try {
      const postingToDelete = postings.find((p) => p.id === id);
      if (postingToDelete?.file_url) {
        await removeStoredFile(postingToDelete.file_url);
      }

      await supabase
        .from('job_postings')
        .delete()
        .eq('id', id);
      setMessage('Oferta eliminada');
      fetchPostings();
    } catch (error) {
      console.error('Error deleting posting:', error);
      setMessage('Error al eliminar la oferta');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (posting: JobPosting) => {
    setEditingPosting({ ...posting, file: null });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingPosting({
      id: 0,
      title: '',
      description: '',
      file_url: null,
      file_name: null,
      order_index: postings.length,
      is_active: true,
      file: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingPosting(null);
    setIsCreating(false);
  };

  const movePosting = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = postings.findIndex(p => p.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === postings.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const [movedPosting, targetPosting] = [postings[currentIndex], postings[newIndex]];

    try {
      await Promise.all([
        supabase
          .from('job_postings')
          .update({ order_index: newIndex })
          .eq('id', movedPosting.id),
        supabase
          .from('job_postings')
          .update({ order_index: currentIndex })
          .eq('id', targetPosting.id)
      ]);
      fetchPostings();
    } catch (error) {
      console.error('Error moving posting:', error);
    }
  };

  if (loading && postings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Ofertas Laborales</h1>
              <p className="text-gray-600 mt-1">Administra las ofertas de trabajo del colegio</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Oferta</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Content */}
        {editingPosting ? (
          // Edit Form
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">
              {isCreating ? 'Nueva Oferta de Trabajo' : 'Editar Oferta'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título de la Oferta *
                </label>
                <input
                  type="text"
                  value={editingPosting.title}
                  onChange={(e) => setEditingPosting({ ...editingPosting, title: e.target.value })}
                  placeholder="Ej: Se busca Profesor de Matemáticas"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={editingPosting.description || ''}
                  onChange={(e) => setEditingPosting({ ...editingPosting, description: e.target.value })}
                  placeholder="Ej: Educación General Básica con mención en Matemáticas"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Archivo o Folleto (PDF, DOC, JPG, etc.)
                </label>
                <div className="mt-2">
                  {editingPosting.file_url && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">{editingPosting.file_name}</p>
                        <p className="text-xs text-blue-600">Archivo actual</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingPosting({
                            ...editingPosting,
                            file_url: null,
                            file_name: null,
                            file: null
                          });
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Reemplazar
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditingPosting({ ...editingPosting, file });
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-red-50 file:text-red-700
                        hover:file:bg-red-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={editingPosting.is_active}
                    onChange={(e) => setEditingPosting({ ...editingPosting, is_active: e.target.checked })}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Activa</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSavePosting(editingPosting)}
                  disabled={!editingPosting.title.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {postings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>No hay ofertas de trabajo. Crea una nueva oferta.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Archivo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {postings.map((posting, idx) => (
                      <tr key={posting.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{posting.title}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {posting.description ? posting.description.substring(0, 50) + (posting.description.length > 50 ? '...' : '') : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {posting.file_name ? (
                            <div className="flex items-center space-x-1">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => window.open(posting.file_url, '_blank')}>
                                {posting.file_name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Sin archivo</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            posting.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {posting.is_active ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-2">
                            {idx > 0 && (
                              <button
                                onClick={() => movePosting(posting.id, 'up')}
                                className="text-gray-500 hover:text-gray-700"
                                title="Subir"
                              >
                                ↑
                              </button>
                            )}
                            {idx < postings.length - 1 && (
                              <button
                                onClick={() => movePosting(posting.id, 'down')}
                                className="text-gray-500 hover:text-gray-700"
                                title="Bajar"
                              >
                                ↓
                              </button>
                            )}
                            <button
                              onClick={() => setPreviewPosting(posting)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Ver"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(posting)}
                              className="text-yellow-600 hover:text-yellow-700"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePosting(posting.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewPosting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{previewPosting.title}</h2>
              <button
                onClick={() => setPreviewPosting(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {previewPosting.description && (
                <p className="text-gray-700 mb-4">{previewPosting.description}</p>
              )}
              {previewPosting.file_url && (
                <a
                  href={previewPosting.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Descargar {previewPosting.file_name}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrabajaConNosotrosManagement;
