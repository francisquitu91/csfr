import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Plus, X, Upload, Download, Edit, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnuariosManagementProps {
  onBack: () => void;
}

interface DocumentoAnuario {
  id?: number;
  title: string;
  file_url: string;
  year: string;
}

const AnuariosManagement: React.FC<AnuariosManagementProps> = ({ onBack }) => {
  const [documentos, setDocumentos] = useState<DocumentoAnuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingDoc, setEditingDoc] = useState<DocumentoAnuario | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('anuarios')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      if (data) setDocumentos(data);
    } catch (error) {
      console.error('Error fetching documentos:', error);
      setMessage('Error al cargar documentos');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('anuarios-files')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('anuarios-files')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      setMessage('Solo se permiten archivos PDF');
      return;
    }

    setUploadingFile(true);
    try {
      const fileUrl = await uploadFile(file);
      if (editingDoc) {
        setEditingDoc({ ...editingDoc, file_url: fileUrl });
      }
      setMessage('Archivo subido exitosamente');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error al subir archivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveDoc = async () => {
    if (!editingDoc) return;

    if (!editingDoc.title || !editingDoc.year || !editingDoc.file_url) {
      setMessage('Por favor completa todos los campos y sube un archivo');
      return;
    }

    setLoading(true);
    try {
      if (editingDoc.id) {
        const { error } = await supabase
          .from('anuarios')
          .update({
            title: editingDoc.title,
            year: editingDoc.year,
            file_url: editingDoc.file_url
          })
          .eq('id', editingDoc.id);

        if (error) throw error;
        setMessage('Documento actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('anuarios')
          .insert([{
            title: editingDoc.title,
            year: editingDoc.year,
            file_url: editingDoc.file_url
          }]);

        if (error) throw error;
        setMessage('Documento creado exitosamente');
      }
      
      setEditingDoc(null);
      fetchDocumentos();
    } catch (error) {
      console.error('Error saving documento:', error);
      setMessage('Error al guardar documento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoc = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este anuario?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('anuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage('Anuario eliminado');
      fetchDocumentos();
    } catch (error) {
      console.error('Error deleting documento:', error);
      setMessage('Error al eliminar documento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al panel de administración
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Anuarios</h1>
          <p className="text-gray-600">Administra los anuarios escolares con protección de contraseña</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Anuarios</h2>
            <button
              onClick={() => setEditingDoc({
                title: '',
                file_url: '',
                year: new Date().getFullYear().toString()
              })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Anuario</span>
            </button>
          </div>

          {/* Formulario de Edición */}
          {editingDoc && (
            <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-500">
              <h3 className="text-lg font-semibold mb-4">
                {editingDoc.id ? 'Editar Anuario' : 'Nuevo Anuario'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Documento
                  </label>
                  <input
                    type="text"
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Anuario 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año
                  </label>
                  <input
                    type="text"
                    value={editingDoc.year}
                    onChange={(e) => setEditingDoc({ ...editingDoc, year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documento PDF
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5 mr-2" />
                      <span>{uploadingFile ? 'Subiendo...' : 'Seleccionar archivo'}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                        className="hidden"
                      />
                    </label>
                    {editingDoc.file_url && (
                      <span className="text-green-600 flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        Archivo listo
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveDoc}
                    disabled={loading || uploadingFile}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingDoc(null)}
                    className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Documentos */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-6 py-3 text-left font-semibold">Título</th>
                  <th className="border border-gray-300 px-6 py-3 text-left font-semibold">Año</th>
                  <th className="border border-gray-300 px-6 py-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-6 py-3">{doc.title}</td>
                    <td className="border border-gray-300 px-6 py-3">{doc.year}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => setEditingDoc(doc)}
                          className="text-amber-600 hover:text-amber-700"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => doc.id && handleDeleteDoc(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {documentos.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No hay anuarios disponibles. Crea uno nuevo para comenzar.
            </div>
          )}
        </div>

        {/* Info de protección */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="flex items-start">
            <Lock className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Protección de Contraseña</h3>
              <p className="text-yellow-800 text-sm">
                Los anuarios están protegidos con contraseña para acceso público.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para descargar
const FileText = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export default AnuariosManagement;
