import { useState, useEffect } from 'react';
import { Bell, Save, Upload, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnnouncementData {
  id: number;
  is_active: boolean;
  title: string;
  message: string;
  document_url: string | null;
  document_name: string | null;
  image_url?: string | null;
  image_name?: string | null;
  image_enabled?: boolean;
}

interface AnnouncementManagementProps {
  onBack: () => void;
}

export default function AnnouncementManagement({ onBack }: AnnouncementManagementProps) {
  const [announcement, setAnnouncement] = useState<AnnouncementData>({
    id: 0,
    is_active: false,
    title: '',
    message: '',
    document_url: null,
    document_name: null
    ,image_url: null,
    image_name: null,
    image_enabled: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcement_popup')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setAnnouncement(data);
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('announcement_popup')
        .update({
          is_active: announcement.is_active,
          title: announcement.title,
          message: announcement.message,
          document_url: announcement.document_url,
          document_name: announcement.document_name
          ,image_url: announcement.image_url || null,
          image_name: announcement.image_name || null,
          image_enabled: announcement.image_enabled || false
        })
        .eq('id', announcement.id);

      if (error) throw error;

      // Clear users' localStorage to show new announcement
      if (announcement.is_active) {
        localStorage.removeItem('lastSeenAnnouncementId');
      }

      alert('Anuncio guardado exitosamente');
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Error al guardar el anuncio');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `announcements/${Math.random()}.${fileExt}`;

      // Use 'recursos-digitales-files' bucket which accepts all file types
      const { error: uploadError } = await supabase.storage
        .from('recursos-digitales-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recursos-digitales-files')
        .getPublicUrl(fileName);

      setAnnouncement({
        ...announcement,
        document_url: publicUrl,
        document_name: file.name
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir el archivo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `announcements/images/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('recursos-digitales-files')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recursos-digitales-files')
        .getPublicUrl(fileName);

      setAnnouncement({
        ...announcement,
        image_url: publicUrl,
        image_name: file.name,
        image_enabled: true
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!announcement.image_url) return;
    try {
      const urlParts = announcement.image_url.split('/');
      const fileName = urlParts.slice(-2).join('/');

      await supabase.storage
        .from('recursos-digitales-files')
        .remove([fileName]);

      setAnnouncement({
        ...announcement,
        image_url: null,
        image_name: null,
        image_enabled: false
      });
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleRemoveDocument = async () => {
    if (!announcement.document_url) return;

    try {
      // Extract filename from URL
      const urlParts = announcement.document_url.split('/');
      const fileName = urlParts.slice(-2).join('/');

      await supabase.storage
        .from('recursos-digitales-files')
        .remove([fileName]);

      setAnnouncement({
        ...announcement,
        document_url: null,
        document_name: null
      });
    } catch (error) {
      console.error('Error removing document:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver al Panel</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Anuncio Popup</h1>
              <p className="text-gray-600">Configura el anuncio que verán los usuarios al entrar</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {announcement.is_active ? (
                <Eye className="h-6 w-6 text-green-600" />
              ) : (
                <EyeOff className="h-6 w-6 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-gray-800">
                  Estado del Anuncio
                </p>
                <p className="text-sm text-gray-600">
                  {announcement.is_active ? 'Visible para usuarios' : 'Oculto'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={announcement.is_active}
                onChange={(e) => setAnnouncement({ ...announcement, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={announcement.title}
              onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: Información Importante"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje *
            </label>
            <textarea
              value={announcement.message}
              onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Escribe el mensaje que verán los usuarios..."
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documento Adjunto (opcional)
            </label>

            {announcement.document_url ? (
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{announcement.document_name}</p>
                  <a
                    href={announcement.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver documento
                  </a>
                </div>
                <button
                  onClick={handleRemoveDocument}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-red-500 transition-colors">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Haz clic para subir un documento</span>
                <span className="text-xs text-gray-500 mt-1">PDF, Word, Excel, etc.</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}

            {uploading && (
              <div className="flex items-center justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                <span className="ml-2 text-sm text-gray-600">Subiendo archivo...</span>
              </div>
            )}
          </div>

          {/* Image Upload (for expandable image like casino) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen desplegable (PNG/JPG)</label>

            {announcement.image_url ? (
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{announcement.image_name}</p>
                  <a href={announcement.image_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Ver imagen</a>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!announcement.image_enabled} onChange={(e) => setAnnouncement({...announcement, image_enabled: e.target.checked})} />
                    <span className="text-sm text-gray-600">Habilitar imagen desplegable</span>
                  </label>
                  <button onClick={handleRemoveImage} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-red-500 transition-colors">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Haz clic para subir una imagen</span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
            )}

            {uploading && (
              <div className="flex items-center justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                <span className="ml-2 text-sm text-gray-600">Subiendo imagen...</span>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving || !announcement.title || !announcement.message}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Instrucciones</h3>
            <ul className="text-yellow-800 space-y-1 list-disc list-inside text-sm">
              <li>Activa el switch para mostrar el anuncio a los usuarios</li>
              <li>El popup aparecerá una vez por usuario hasta que cambies el contenido</li>
              <li>Puedes adjuntar un documento para que los usuarios lo descarguen</li>
              <li>Desactiva el switch cuando el anuncio ya no sea necesario</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
