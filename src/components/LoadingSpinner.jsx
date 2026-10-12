import React from 'react';
import { Pill } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: fullPage ? '4rem' : '2rem'
    }}>
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          border: '4px solid #e0f2fe',
          borderTopColor: '#0284c7',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#0284c7'
        }}>
          <Pill size={20} />
        </div>
      </div>
      {message && (
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
          {message}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
