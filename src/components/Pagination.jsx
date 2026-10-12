import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 0, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Render a reasonable window of page numbers
  const pages = [];
  const start = Math.max(0, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', margin: '2rem 0' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        style={{
          border: '1px solid #cbd5e1',
          background: '#fff',
          borderRadius: '8px',
          padding: '0.45rem 0.65rem',
          display: 'flex',
          alignItems: 'center',
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 0 ? 0.4 : 1,
          color: '#334155'
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {start > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            style={{
              border: '1px solid #cbd5e1',
              background: '#fff',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            1
          </button>
          {start > 1 && <span style={{ color: '#94a3b8', padding: '0 0.25rem' }}>...</span>}
        </>
      )}

      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
              background: isActive ? '#0284c7' : '#fff',
              color: isActive ? '#fff' : '#334155',
              fontWeight: isActive ? '700' : '500',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {p + 1}
          </button>
        );
      })}

      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && <span style={{ color: '#94a3b8', padding: '0 0.25rem' }}>...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            style={{
              border: '1px solid #cbd5e1',
              background: '#fff',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        style={{
          border: '1px solid #cbd5e1',
          background: '#fff',
          borderRadius: '8px',
          padding: '0.45rem 0.65rem',
          display: 'flex',
          alignItems: 'center',
          cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage >= totalPages - 1 ? 0.4 : 1,
          color: '#334155'
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
