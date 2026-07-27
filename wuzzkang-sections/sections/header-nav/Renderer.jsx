import React from 'react';

export function HeaderNavRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const logoText = data.logoText?.value || 'WuzzKang';
  const logoImage = data.logoImage?.src;
  const navLinks = Array.isArray(data.navLinks?.items) ? data.navLinks.items : [];
  const ctaLabel = data.ctaLabel?.value || '';
  const ctaHref = data.ctaUrl?.href || '#';

  return (
    <header
      data-node-id={node.id}
      onClick={(e) => { if (onNodeClick) { e.stopPropagation(); onNodeClick(node.id); } }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        backgroundColor: styles.backgroundColor || 'var(--wk-semantic-color-surface-default, #FFFFFF)',
        borderBottom: '1px solid var(--wk-semantic-color-border-default, #E2E8F0)',
        borderRadius: '8px',
        margin: '0 0 16px 0',
        cursor: onNodeClick ? 'pointer' : 'default'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {logoImage && <img src={logoImage} alt={logoText} style={{ height: '32px' }} />}
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: styles.textColor || 'var(--wk-semantic-color-text-primary, #0F172A)' }}>
          {logoText}
        </span>
      </div>

      <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {navLinks.map((link, idx) => (
          <span key={idx} style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--wk-semantic-color-text-secondary, #475569)', cursor: 'pointer' }}>
            {link?.value || link}
          </span>
        ))}
      </nav>

      {ctaLabel && (
        <a
          href={ctaHref}
          onClick={(e) => {
            if (onNodeClick) {
              e.preventDefault();
              e.stopPropagation();
              onNodeClick(node.id);
            }
          }}
          style={{
            padding: '10px 20px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: styles.buttonColor || 'var(--wk-semantic-color-brand-primary, #2563EB)',
            borderRadius: '6px',
            textDecoration: 'none'
          }}
        >
          {ctaLabel}
        </a>
      )}
    </header>
  );
}
