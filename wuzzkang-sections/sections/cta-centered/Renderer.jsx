import React from 'react';

export function CtaCenteredRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Mulai Sekarang';
  const subheadline = data.subheadline?.value || '';
  const ctaLabel = data.ctaLabel?.value || 'Klik Di Sini';
  const ctaHref = data.ctaUrl?.href || '#';

  return (
    <section
      data-node-id={node.id}
      onClick={(e) => { if (onNodeClick) { e.stopPropagation(); onNodeClick(node.id); } }}
      style={{
        padding: '64px 32px',
        textAlign: 'center',
        backgroundColor: styles.backgroundColor || 'var(--wk-semantic-color-brand-primary, #2563EB)',
        color: styles.textColor || '#FFFFFF',
        borderRadius: '12px',
        margin: '16px 0',
        cursor: onNodeClick ? 'pointer' : 'default'
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0 0 16px 0', color: 'inherit' }}>
          {headline}
        </h2>
        {subheadline && (
          <p style={{ fontSize: '1.15rem', opacity: 0.9, margin: '0 0 32px 0', lineHeight: 1.5 }}>
            {subheadline}
          </p>
        )}
        <a
          href={ctaHref}
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--wk-semantic-color-brand-primary, #2563EB)',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
