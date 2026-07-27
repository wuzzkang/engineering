import React from 'react';

export function GalleryGridRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Galeri Foto';
  const images = Array.isArray(data.imagesList?.items) ? data.imagesList.items : [];

  return (
    <section
      data-node-id={node.id}
      onClick={(e) => { if (onNodeClick) { e.stopPropagation(); onNodeClick(node.id); } }}
      style={{
        padding: '64px 32px',
        backgroundColor: styles.backgroundColor || 'var(--wk-semantic-color-surface-default, #FFFFFF)',
        borderRadius: '8px',
        margin: '16px 0',
        cursor: onNodeClick ? 'pointer' : 'default'
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', margin: '0 0 40px 0', color: styles.textColor || 'var(--wk-semantic-color-text-primary, #0F172A)' }}>
        {headline}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {images.map((imgItem, idx) => (
          <div
            key={idx}
            style={{
              height: '180px',
              backgroundColor: '#E2E8F0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              color: '#475569',
              padding: '16px',
              textAlign: 'center'
            }}
          >
            🖼️ {imgItem?.value || imgItem}
          </div>
        ))}
      </div>
    </section>
  );
}
