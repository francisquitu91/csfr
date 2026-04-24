import React, { useRef } from 'react';
import { ArrowLeft, BookOpen, X } from 'lucide-react';

interface PEIViewerSectionProps {
  onBack: () => void;
}

const PEIViewerSection: React.FC<PEIViewerSectionProps> = ({ onBack }) => {
  const peiIframeRef = useRef<HTMLIFrameElement | null>(null);
  const peiPresentationId = '19N_2apJTsztXiJ4yrxUv52LpNOoOIFANDNoh170Viwg';
  const peiEmbedUrl = `https://docs.google.com/presentation/d/${peiPresentationId}/embed?start=false&loop=false&delayms=30000`;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </button>

          <div className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold sm:text-base">PEI - Proyecto Educativo Institucional</h1>
              <p className="text-xs text-white/70">Vista proyectada del documento</p>
            </div>
          </div>

        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <iframe
            ref={peiIframeRef}
            title="PEI en pantalla completa"
            src={peiEmbedUrl}
            className="h-[calc(100vh-9rem)] w-full"
            allow="autoplay"
            tabIndex={0}
          />
        </div>
      </div>

      <button
        onClick={onBack}
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
      >
        <X className="h-4 w-4" />
        Cerrar
      </button>
    </div>
  );
};

export default PEIViewerSection;