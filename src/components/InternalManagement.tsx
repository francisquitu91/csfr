import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save, Loader2, AlertCircle, FileText, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { normalizeVisualizationLink, resolveDocumentAccess } from '../lib/institutionalDocuments';

interface InternalManagementProps {
  onBack: () => void;
}

interface Document {
  id: string;
  category: string;
  title: string;
  file_name: string;
  file_url: string;
  order_index: number;
  visualization_url?: string | null;
  download_url?: string | null;
  use_visualization_link?: boolean;
}

interface RowState {
  useVisualizationLink: boolean;
  visualizationLink: string;
}

const InternalManagement: React.FC<InternalManagementProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [rowState, setRowState] = useState<Record<string, RowState>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('institutional_documents')
        .select('*')
        .order('category')
        .order('order_index');

      if (error) throw error;

      const docs = (data || []) as Document[];
      setDocuments(docs);

      const draftState: Record<string, RowState> = {};
      docs.forEach((doc) => {
        const access = resolveDocumentAccess(doc);
        draftState[doc.id] = {
          useVisualizationLink: Boolean(access && doc.use_visualization_link),
          visualizationLink: access?.visualizationUrl || doc.visualization_url || ''
        };
      });
      setRowState(draftState);
    } catch (fetchError) {
      console.error('Error fetching institutional documents:', fetchError);
      setError('No se pudieron cargar los documentos para gestión interna.');
    } finally {
      setLoading(false);
    }
  };

  const groupedDocuments = useMemo(() => {
    return documents.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);
  }, [documents]);

  const sortedCategories = useMemo(() => Object.keys(groupedDocuments), [groupedDocuments]);

  const setRowValue = (id: string, patch: Partial<RowState>) => {
    setRowState((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch
      }
    }));
  };

  const handleSave = async (doc: Document) => {
    const draft = rowState[doc.id];
    if (!draft) return;

    if (draft.useVisualizationLink && !draft.visualizationLink.trim()) {
      setError('Debes ingresar un enlace de visualización antes de guardar.');
      return;
    }

    try {
      setSavingId(doc.id);
      setError(null);
      setSuccess(null);

      const normalizedLink = draft.useVisualizationLink
        ? normalizeVisualizationLink(draft.visualizationLink)
        : null;

      const payload: Record<string, unknown> = {
        use_visualization_link: draft.useVisualizationLink,
        updated_at: new Date().toISOString(),
      };

      if (normalizedLink) {
        payload.visualization_url = normalizedLink.visualizationUrl;
        payload.download_url = normalizedLink.downloadUrl;
      }

      const { error: updateError } = await supabase
        .from('institutional_documents')
        .update(payload)
        .eq('id', doc.id);

      if (updateError) throw updateError;

      setSuccess('Configuración interna actualizada.');
      await fetchDocuments();
    } catch (saveError) {
      console.error('Error saving internal configuration:', saveError);
      setError('No se pudo guardar la configuración interna del documento.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-red-600 hover:text-red-700 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al panel de administración
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Gestión interna</h1>
          <p className="text-gray-600 mt-2">
            Configura la visualización y descarga de documentos institucionales ya cargados.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando documentos...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay documentos para configurar.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedCategories.map((category) => (
              <div key={category} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {groupedDocuments[category].map((doc) => {
                    const draft = rowState[doc.id] || { useVisualizationLink: false, visualizationLink: '' };
                    const preview = draft.useVisualizationLink
                      ? normalizeVisualizationLink(draft.visualizationLink)
                      : null;

                    return (
                      <div key={doc.id} className="p-5">
                        <div className="flex flex-col gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                            <p className="text-sm text-gray-500">Archivo actual: {doc.file_name}</p>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setRowValue(doc.id, { useVisualizationLink: !draft.useVisualizationLink })}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                draft.useVisualizationLink
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {draft.useVisualizationLink ? 'Visualización activa' : 'Usar archivo local'}
                            </button>

                            <input
                              type="url"
                              value={draft.visualizationLink}
                              onChange={(e) => setRowValue(doc.id, { visualizationLink: e.target.value })}
                              disabled={!draft.useVisualizationLink}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                              placeholder="Enlace de visualización"
                            />

                            <button
                              type="button"
                              onClick={() => handleSave(doc)}
                              disabled={savingId === doc.id}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {savingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Guardar
                            </button>
                          </div>

                          {draft.useVisualizationLink && preview && (
                            <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <p className="break-all">Visualización: {preview.visualizationUrl}</p>
                              <p className="break-all mt-1">Descarga automática: {preview.downloadUrl}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalManagement;
