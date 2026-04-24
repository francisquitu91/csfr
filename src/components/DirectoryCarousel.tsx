import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DirectoryItem {
  name: string;
  photoUrl: string;
}

interface DirectoryCarouselProps {
  items: DirectoryItem[];
  itemsPerPage?: number;
  disablePagination?: boolean;
  compactCards?: boolean;
}

const DirectoryCarousel: React.FC<DirectoryCarouselProps> = ({
  items,
  itemsPerPage = 3,
  disablePagination = false,
  compactCards = false,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const effectiveItemsPerPage = disablePagination ? items.length : itemsPerPage;
  const totalPages = Math.ceil(items.length / effectiveItemsPerPage);
  const visibleItems = useMemo(() => {
    const start = currentPage * effectiveItemsPerPage;
    return items.slice(start, start + effectiveItemsPerPage);
  }, [currentPage, items, effectiveItemsPerPage]);

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const displayItemsPerPage = disablePagination ? items.length : itemsPerPage;
  const gridColsClass = displayItemsPerPage === 5 ? 'md:grid-cols-5 lg:grid-cols-5' : displayItemsPerPage === 4 ? 'md:grid-cols-4 lg:grid-cols-4' : 'md:grid-cols-3 lg:grid-cols-3';
  const textSizeClass = displayItemsPerPage >= 5 ? 'text-xs' : displayItemsPerPage === 4 ? 'text-sm' : 'text-sm';

  return (
    <div className="py-4">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-4 md:gap-6`}>
        {visibleItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={`flex flex-col items-center space-y-3 p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 ${compactCards ? 'max-w-[210px] w-full mx-auto' : ''}`}
          >
            <div className="w-full aspect-square overflow-hidden rounded-lg border-4 border-blue-100 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <img
                src={item.photoUrl}
                alt={item.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <p className={`text-center text-gray-800 font-medium ${textSizeClass} leading-tight`}>
              {item.name}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <span className="text-sm text-gray-600 font-medium">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages - 1}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectoryCarousel;