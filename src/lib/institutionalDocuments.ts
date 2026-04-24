const SUPABASE_INSTITUTIONAL_BUCKET = 'institutional-documents';

export interface InstitutionalDocumentRecord {
  id?: string;
  file_url: string;
  visualization_url?: string | null;
  download_url?: string | null;
  use_visualization_link?: boolean | null;
}

export interface ResolvedDocumentAccess {
  visualizationUrl: string;
  downloadUrl: string;
  usesVisualizationLink: boolean;
}

export const extractSupabaseStoragePath = (publicUrl?: string | null) => {
  if (!publicUrl) return null;

  const marker = `/object/public/${SUPABASE_INSTITUTIONAL_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex === -1) return null;

  return decodeURIComponent(publicUrl.slice(markerIndex + marker.length).split('?')[0]);
};

const extractGoogleFileId = (url: string) => {
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/presentation\/d\/([a-zA-Z0-9_-]+)/,
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
    /\/document\/d\/([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

const buildGooglePreviewUrl = (url: string, fileId: string) => {
  if (url.includes('/presentation/')) {
    return `https://docs.google.com/presentation/d/${fileId}/preview`;
  }

  if (url.includes('/spreadsheets/')) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  }

  if (url.includes('/document/')) {
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }

  return `https://docs.google.com/file/d/${fileId}/preview`;
};

const buildGoogleDownloadUrl = (fileId: string) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

export const normalizeVisualizationLink = (input?: string | null): ResolvedDocumentAccess | null => {
  const rawUrl = input?.trim();
  if (!rawUrl) return null;

  const fileId = extractGoogleFileId(rawUrl);
  if (fileId) {
    return {
      visualizationUrl: buildGooglePreviewUrl(rawUrl, fileId),
      downloadUrl: buildGoogleDownloadUrl(fileId),
      usesVisualizationLink: true
    };
  }

  return {
    visualizationUrl: rawUrl,
    downloadUrl: rawUrl,
    usesVisualizationLink: true
  };
};

export const resolveDocumentAccess = (document: InstitutionalDocumentRecord): ResolvedDocumentAccess | null => {
  const directVisualization = document.visualization_url?.trim();
  const directDownload = document.download_url?.trim();

  if (document.use_visualization_link && directVisualization) {
    return {
      visualizationUrl: directVisualization,
      downloadUrl: directDownload || directVisualization,
      usesVisualizationLink: true
    };
  }

  const normalizedFromFileUrl = normalizeVisualizationLink(document.file_url);
  if (normalizedFromFileUrl && /docs\.google\.com|drive\.google\.com/i.test(document.file_url)) {
    return normalizedFromFileUrl;
  }

  if (directVisualization) {
    return {
      visualizationUrl: directVisualization,
      downloadUrl: directDownload || document.file_url,
      usesVisualizationLink: true
    };
  }

  return null;
};

export const getDocumentFormatLabel = (fileType: string, fileName?: string) => {
  const normalizedType = fileType.toLowerCase();
  const normalizedName = fileName?.toLowerCase() || '';

  if (normalizedType.includes('pdf') || normalizedName.endsWith('.pdf')) return 'PDF';
  if (normalizedType.includes('wordprocessingml.document') || normalizedType.includes('msword') || normalizedName.endsWith('.docx') || normalizedName.endsWith('.doc')) return 'Word';
  if (normalizedType.includes('spreadsheetml.sheet') || normalizedType.includes('excel') || normalizedName.endsWith('.xlsx') || normalizedName.endsWith('.xls')) return 'Excel';
  if (normalizedType.includes('presentationml.presentation') || normalizedType.includes('powerpoint') || normalizedName.endsWith('.pptx') || normalizedName.endsWith('.ppt')) return 'PowerPoint';
  if (normalizedType.includes('image') || normalizedName.match(/\.(png|jpe?g|gif|webp|svg)$/)) return 'Imagen';

  return 'Archivo';
};

export const getDocumentFormatAccent = (fileType: string, fileName?: string) => {
  const label = getDocumentFormatLabel(fileType, fileName);

  switch (label) {
    case 'PDF':
      return 'bg-red-100 text-red-700';
    case 'Word':
      return 'bg-blue-100 text-blue-700';
    case 'Excel':
      return 'bg-emerald-100 text-emerald-700';
    case 'PowerPoint':
      return 'bg-orange-100 text-orange-700';
    case 'Imagen':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
