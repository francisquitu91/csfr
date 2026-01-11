import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, Save, X, Upload, Loader2, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface InstitutionalDocumentsManagementProps {
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

interface DocumentForm {
  category: string;
  title: string;
  description: string;
  file: File | null;
  order_index: number;
}

const InstitutionalDocumentsManagement: React.FC<InstitutionalDocumentsManagementProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<DocumentForm>({
    category: 'Documentos de Matrícula 2026',
    title: '',
    description: '',
    file: null,
    order_index: 0
  });

  const categories = [
    'Documentos de Matrícula 2026',
    'Documentos, protocolos y reglamentos del Colegio',
    'Seguros escolares',
    'Otros'
  ];

  useEffect(() => {
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
      setError('Error al cargar los documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('institutional-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('institutional-documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!editingId && !formData.file) {
      setError('Debe seleccionar un archivo');
      return;
    }

    try {
      setUploading(true);

      let fileUrl = '';
      let fileName = '';
      let fileType = '';
      let fileSize = 0;

      if (formData.file) {
        fileUrl = await uploadFile(formData.file);
        fileName = formData.file.name;
        fileType = formData.file.type;
        fileSize = formData.file.size;
      }

      if (editingId) {
        // Update existing document
        const updateData: any = {
          category: formData.category,
          title: formData.title,
          description: formData.description || null,
          order_index: formData.order_index,
          updated_at: new Date().toISOString()
        };

        // Only update file fields if a new file was uploaded
        if (formData.file) {
          updateData.file_url = fileUrl;
          updateData.file_name = fileName;
          updateData.file_type = fileType;
          updateData.file_size = fileSize;
        }

        const { error } = await supabase
          .from('institutional_documents')
          .update(updateData)
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Documento actualizado exitosamente');
      } else {
        // Insert new document
        const { error } = await supabase
          .from('institutional_documents')
          .insert([{
            category: formData.category,
            title: formData.title,
            description: formData.description || null,
            file_url: fileUrl,
            file_name: fileName,
            file_type: fileType,
            file_size: fileSize,
            order_index: formData.order_index
          }]);

        if (error) throw error;
        setSuccess('Documento agregado exitosamente');
      }

      // Reset form
      setFormData({
        category: 'Documentos de Matrícula 2026',
        title: '',
        description: '',
        file: null,
        order_index: 0
      });
      setIsEditing(false);
      setEditingId(null);
      fetchDocuments();
    } catch (error: any) {
      console.error('Error saving document:', error);
      setError(error.message || 'Error al guardar el documento');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (doc: Document) => {
    setFormData({
      category: doc.category,
      title: doc.title,
      description: doc.description || '',
      file: null,
      order_index: doc.order_index
    });
    setEditingId(doc.id);
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este documento?')) return;

    try {
      const { error } = await supabase
        .from('institutional_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Documento eliminado exitosamente');
      fetchDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      setError('Error al eliminar el documento');
    }
  };

  const handleCancel = () => {
    setFormData({
      category: 'Documentos de Matrícula 2026',
      title: '',
      description: '',
      file: null,
      order_index: 0
    });
    setIsEditing(false);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al panel de administración
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de Documentos Institucionales</h1>
          <p className="text-gray-600 mt-2">Administra los documentos oficiales del colegio</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Documento' : 'Agregar Nuevo Documento'}
            </h2>
            {isEditing && (
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Documento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Reglamento Interno 2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Breve descripción del documento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo {!editingId && '*'}
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Seleccionar archivo</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                  />
                </label>
                {formData.file && (
                  <span className="text-sm text-gray-600">
                    {formData.file.name} ({formatFileSize(formData.file.size)})
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Formatos aceptados: PDF, Word, Excel, PowerPoint, Imágenes
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{editingId ? 'Actualizar' : 'Guardar'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Documentos Registrados</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Cargando documentos...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay documentos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archivo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{doc.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                        {doc.description && (
                          <div className="text-sm text-gray-500">{doc.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{doc.file_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatFileSize(doc.file_size)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{doc.order_index}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(doc)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionalDocumentsManagement;
