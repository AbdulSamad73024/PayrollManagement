import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="pagination-wrapper">
      <div className="pagination-summary">
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalRecords}</span> entries
      </div>

      <div className="pagination-controls">
        {onPageSizeChange && (
          <div className="pagination-size-selector">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="pagination-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <div className="pagination-buttons">
          <button
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="pagination-page-indicator">
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
