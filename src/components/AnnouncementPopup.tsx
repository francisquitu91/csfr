import { useState, useEffect } from 'react';
import { X, FileText, Download } from 'lucide-react';
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

export default function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement_popup')
        .select('*')
        .single();

      if (error) throw error;

      if (data && data.is_active) {
        // Check if user has already seen this announcement
        const lastSeenId = localStorage.getItem('lastSeenAnnouncementId');
        if (lastSeenId !== data.id.toString()) {
          setAnnouncement(data);
          setIsVisible(true);
        }
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  const handleClose = () => {
    if (announcement) {
      localStorage.setItem('lastSeenAnnouncementId', announcement.id.toString());
    }
    setIsVisible(false);
  };

  if (!isVisible || !announcement) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">{announcement.title}</h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {announcement.message}
          </div>

          {/* Expandable Image */}
          {announcement.image_url && announcement.image_enabled && (
            <div className="flex justify-center">
              <div className="w-full max-w-xl">
                <img
                  src={announcement.image_url}
                  alt={announcement.image_name || 'Anuncio imagen'}
                  className="w-full h-auto rounded-lg cursor-pointer shadow-lg"
                  onClick={() => setIsImageOpen(true)}
                />
              </div>
            </div>
          )}

          {/* Image Lightbox */}
          {isImageOpen && announcement.image_url && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-80">
              <button onClick={() => setIsImageOpen(false)} className="absolute top-6 right-6 text-white p-2 rounded-full bg-black/40">
                <X className="h-6 w-6" />
              </button>
              <img src={announcement.image_url} alt={announcement.image_name || 'Imagen'} className="max-h-[90vh] max-w-[90vw] rounded-lg" />
            </div>
          )}

          {/* Document */}
          {announcement.document_url && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Documento adjunto</p>
                  <p className="font-medium text-gray-800">
                    {announcement.document_name || 'Documento'}
                  </p>
                </div>
                <a
                  href={announcement.document_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
