import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Plus, X, Upload, FileText, Download, Link } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchLibrosEstanteria, addLibroEstanteria, updateLibroEstanteria, deleteLibroEstanteria, extractGoogleDriveFileId } from '../lib/estanteriaVirtual';

interface BibliotecaManagementProps {
  onBack: () => void;
}

interface PlanLector {
  id?: number;
  title: string;
  file_url: string;
  year: string;
}

const BibliotecaManagement: React.FC<BibliotecaManagementProps> = ({ onBack }) => {
  const [planesLectores, setPlanesLectores] = useState<PlanLector[]>([]);
  const [librosEstanteria, setLibrosEstanteria] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'planes' | 'estanteria'>('planes');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingPlan, setEditingPlan] = useState<PlanLector | null>(null);
  const [editingLibro, setEditingLibro] = useState<any | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchPlanesLectores();
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    const libros = await fetchLibrosEstanteria();
    setLibrosEstanteria(libros);
  };

  const fetchPlanesLectores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('planes_lectores')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      if (data) setPlanesLectores(data);
    } catch (error) {
      console.error('Error fetching planes lectores:', error);
      setMessage('Error al cargar planes lectores');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLibro = async () => {
    if (!editingLibro) return;

    if (!editingLibro.title || !editingLibro.drive_link) {
      setMessage('Por favor completa título y link de Drive');
      return;
    }

    // Extract file ID from Drive link
    const fileId = extractGoogleDriveFileId(editingLibro.drive_link);
    if (!fileId) {
      setMessage('Link de Google Drive inválido');
      return;
    }

    setLoading(true);
    try {
      if (editingLibro.id) {
        const result = await updateLibroEstanteria(editingLibro.id, editingLibro);
        if (result) setMessage('Libro actualizado exitosamente');
        else setMessage('Error al actualizar libro');
      } else {
        const result = await addLibroEstanteria(editingLibro);
        if (result) setMessage('Libro agregado exitosamente');
        else setMessage('Error al agregar libro');
      }
      setEditingLibro(null);
      fetchLibros();
    } catch (error) {
      console.error('Error saving libro:', error);
      setMessage('Error al guardar libro');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLibro = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;

    setLoading(true);
    try {
      const success = await deleteLibroEstanteria(id);
      if (success) {
        setMessage('Libro eliminado exitosamente');
        fetchLibros();
      } else {
        setMessage('Error al eliminar libro');
      }
    } catch (error) {
      console.error('Error deleting libro:', error);
      setMessage('Error al eliminar libro');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `planes-lectores/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('biblioteca-files')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('biblioteca-files')
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
      if (editingPlan) {
        setEditingPlan({ ...editingPlan, file_url: fileUrl });
      }
      setMessage('Archivo subido exitosamente');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error al subir archivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    if (!editingPlan.title || !editingPlan.year || !editingPlan.file_url) {
      setMessage('Por favor completa todos los campos y sube un archivo');
      return;
    }

    setLoading(true);
    try {
      if (editingPlan.id) {
        const { error } = await supabase
          .from('planes_lectores')
          .update({
            title: editingPlan.title,
            year: editingPlan.year,
            file_url: editingPlan.file_url
          })
          .eq('id', editingPlan.id);

        if (error) throw error;
        setMessage('Plan lector actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('planes_lectores')
          .insert([{
            title: editingPlan.title,
            year: editingPlan.year,
            file_url: editingPlan.file_url
          }]);

        if (error) throw error;
        setMessage('Plan lector creado exitosamente');
      }
      
      setEditingPlan(null);
      fetchPlanesLectores();
    } catch (error) {
      console.error('Error saving plan lector:', error);
      setMessage('Error al guardar plan lector');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este plan lector?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('planes_lectores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage('Plan lector eliminado');
      fetchPlanesLectores();
    } catch (error) {
      console.error('Error deleting plan lector:', error);
      setMessage('Error al eliminar plan lector');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Biblioteca</h1>
          <p className="text-gray-600">Administra planes lectores y la estantería virtual de libros</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('planes')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'planes'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Planes Lectores
          </button>
          <button
            onClick={() => setActiveTab('estanteria')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'estanteria'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Estantería Virtual
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Planes Lectores Tab */}
        {activeTab === 'planes' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Planes Lectores</h2>
            <button
              onClick={() => setEditingPlan({
                title: '',
                file_url: '',
                year: new Date().getFullYear().toString()
              })}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Plan Lector</span>
            </button>
          </div>

          {/* Formulario de Edición */}
          {editingPlan && (
            <div className="mb-6 p-6 bg-amber-50 rounded-lg border-2 border-amber-500">
              <h3 className="text-lg font-semibold mb-4">
                {editingPlan.id ? 'Editar Plan Lector' : 'Nuevo Plan Lector'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Plan Lector
                  </label>
                  <input
                    type="text"
                    value={editingPlan.title}
                    onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Ej: Plan Lector 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año
                  </label>
                  <input
                    type="text"
                    value={editingPlan.year}
                    onChange={(e) => setEditingPlan({ ...editingPlan, year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo PDF
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-amber-500 transition-colors">
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                          <Upload className="w-5 h-5" />
                          <span>{uploadingFile ? 'Subiendo...' : 'Haz clic para subir PDF'}</span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploadingFile}
                      />
                    </label>
                  </div>
                  {editingPlan.file_url && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                      <FileText className="w-4 h-4" />
                      <span>Archivo cargado correctamente</span>
                      <a
                        href={editingPlan.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Ver archivo
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSavePlan}
                    disabled={loading || uploadingFile}
                    className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Guardando...' : 'Guardar Plan Lector'}</span>
                  </button>
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Planes Lectores */}
          <div className="space-y-4">
            {planesLectores.length > 0 ? (
              planesLectores.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-amber-600" />
                        <h3 className="font-semibold text-lg text-gray-900">{plan.title}</h3>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                          {plan.year}
                        </span>
                      </div>
                      {plan.file_url ? (
                        <a
                          href={plan.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Ver archivo (respaldo)</span>
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">Sin archivo</span>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => plan.id && handleDeletePlan(plan.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No hay planes lectores registrados</p>
                <p className="text-sm mt-2">Haz clic en "Nuevo Plan Lector" para agregar uno</p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Estantería Virtual Tab */}
        {activeTab === 'estanteria' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Estantería Virtual</h2>
            <button
              onClick={() => setEditingLibro({
                title: '',
                drive_link: '',
                cover_image_url: '',
                author: '',
                description: '',
                category: '',
                order_index: 0
              })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Libro</span>
            </button>
          </div>

          {/* Formulario de Edición de Libro */}
          {editingLibro && (
            <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-500">
              <h3 className="text-lg font-semibold mb-4">
                {editingLibro.id ? 'Editar Libro' : 'Nuevo Libro'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Libro *
                  </label>
                  <input
                    type="text"
                    value={editingLibro.title}
                    onChange={(e) => setEditingLibro({ ...editingLibro, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: El Quijote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={editingLibro.author || ''}
                    onChange={(e) => setEditingLibro({ ...editingLibro, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Miguel de Cervantes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link de Google Drive * 
                  </label>
                  <input
                    type="text"
                    value={editingLibro.drive_link}
                    onChange={(e) => setEditingLibro({ ...editingLibro, drive_link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://drive.google.com/file/d/FILE_ID/view"
                  />
                  <p className="text-xs text-gray-600 mt-1">Copia el enlace del PDF desde Google Drive</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Imagen de Portada
                  </label>
                  <input
                    type="text"
                    value={editingLibro.cover_image_url || ''}
                    onChange={(e) => setEditingLibro({ ...editingLibro, cover_image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                  {editingLibro.cover_image_url && (
                    <div className="mt-2 w-20 h-28 rounded overflow-hidden border">
                      <img src={editingLibro.cover_image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curso / Nivel *
                  </label>
                  <select
                    value={editingLibro.category || ''}
                    onChange={(e) => setEditingLibro({ ...editingLibro, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un curso</option>
                    <option value="Primero Básico">Primero Básico</option>
                    <option value="Segundo Básico">Segundo Básico</option>
                    <option value="Tercero Básico">Tercero Básico</option>
                    <option value="Cuarto Básico">Cuarto Básico</option>
                    <option value="Quinto Básico">Quinto Básico</option>
                    <option value="Sexto Básico">Sexto Básico</option>
                    <option value="Séptimo Básico">Séptimo Básico</option>
                    <option value="Octavo Básico">Octavo Básico</option>
                    <option value="Primero Medio">Primero Medio</option>
                    <option value="Segundo Medio">Segundo Medio</option>
                    <option value="Tercero Medio">Tercero Medio</option>
                    <option value="Cuarto Medio">Cuarto Medio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={editingLibro.description || ''}
                    onChange={(e) => setEditingLibro({ ...editingLibro, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Breve descripción del libro"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    value={editingLibro.order_index || 0}
                    onChange={(e) => setEditingLibro({ ...editingLibro, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveLibro}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Guardando...' : 'Guardar Libro'}</span>
                  </button>
                  <button
                    onClick={() => setEditingLibro(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Libros */}
          <div className="space-y-4">
            {librosEstanteria.length > 0 ? (
              librosEstanteria.map((libro) => (
                <div
                  key={libro.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex gap-4"
                >
                  {libro.cover_image_url && (
                    <div className="flex-shrink-0 w-16 h-24 rounded overflow-hidden border bg-gray-100">
                      <img src={libro.cover_image_url} alt={libro.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{libro.title}</h3>
                        {libro.author && <p className="text-sm text-gray-600">Por {libro.author}</p>}
                        {libro.category && (
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-1">
                            {libro.category}
                          </span>
                        )}
                        {libro.description && (
                          <p className="text-sm text-gray-600 mt-2">{libro.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingLibro(libro)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLibro(libro.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Link className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No hay libros en la estantería virtual</p>
                <p className="text-sm mt-2">Haz clic en "Agregar Libro" para agregar uno</p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default BibliotecaManagement;
