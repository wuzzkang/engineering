import React from 'react';

export function TestimonialsRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Testimoni';
  const reviews = Array.isArray(data.reviewsList?.items) ? data.reviewsList.items : [];

  return (
    <section
      data-node-id={node.id}
      onClick={(e) => { if (onNodeClick) { e.stopPropagation(); onNodeClick(node.id); } }}
      style={{
        padding: '64px 32px',
        backgroundColor: styles.backgroundColor || 'var(--wk-semantic-color-background-primary, #FAFAFA)',
        borderRadius: '8px',
        margin: '16px 0',
        cursor: onNodeClick ? 'pointer' : 'default'
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', margin: '0 0 40px 0', color: styles.textColor || 'var(--wk-semantic-color-text-primary, #0F172A)' }}>
        {headline}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            style={{
              padding: '24px',
              backgroundColor: 'var(--wk-semantic-color-surface-default, #FFFFFF)',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ color: '#F59E0B', fontSize: '1.2rem', marginBottom: '8px' }}>★★★★★</div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#334155', fontStyle: 'italic', margin: 0 }}>
              "{rev?.value || rev}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
