import React from 'react';

export function FooterStandardRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const copyright = data.copyrightText?.value || '© 2026 WuzzKang Platform';
  const links = Array.isArray(data.footerLinks?.items) ? data.footerLinks.items : [];

  return (
    <footer
      data-node-id={node.id}
      onClick={(e) => { if (onNodeClick) { e.stopPropagation(); onNodeClick(node.id); } }}
      style={{
        padding: '32px 24px',
        backgroundColor: styles.backgroundColor || '#0F172A',
        color: styles.textColor || '#94A3B8',
        borderRadius: '8px',
        margin: '16px 0 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        cursor: onNodeClick ? 'pointer' : 'default'
      }}
    >
      <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
        {links.map((link, idx) => (
          <span key={idx} style={{ color: '#E2E8F0', cursor: 'pointer' }}>
            {link?.value || link}
          </span>
        ))}
      </div>

      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
        {copyright}
      </div>
    </footer>
  );
}
