import React from 'react';

/**
 * hero-basic Section Renderer Component
 *
 * @param {Object} props
 * @param {Object} props.node - The resolved Node object (node.data, node.styleOverrides).
 * @param {Function} [props.onNodeClick] - Optional click handler for builder selection.
 */
export function HeroBasicRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Headline Hero';
  const subheadline = data.subheadline?.value || '';
  const ctaLabel = data.ctaLabel?.value || '';
  const ctaHref = data.ctaUrl?.href || '#';
  const bgImage = data.backgroundImage?.src || '';
  const enableOverlay = data.backgroundOverlay?.value !== false;

  const sectionStyle = {
    position: 'relative',
    padding: '80px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: styles.backgroundColor || 'var(--wk-semantic-color-background-primary, #FAFAFA)',
    color: styles.textColor || 'var(--wk-semantic-color-text-primary, #171717)',
    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '400px',
    borderRadius: '8px',
    margin: '16px 0',
    cursor: onNodeClick ? 'pointer' : 'default',
    boxSizing: 'border-box'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: '8px',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    width: '100%'
  };

  const headlineStyle = {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.25,
    margin: '0 0 16px 0',
    color: bgImage && enableOverlay ? '#FFFFFF' : (styles.textColor || 'inherit')
  };

  const subheadlineStyle = {
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.5,
    margin: '0 0 32px 0',
    opacity: 0.9,
    color: bgImage && enableOverlay ? '#E5E7EB' : 'inherit'
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: styles.buttonColor || 'var(--wk-semantic-color-brand-primary, #2563EB)',
    borderRadius: '6px',
    textDecoration: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out'
  };

  return (
    <section
      className="wk-hero-basic"
      data-node-id={node.id}
      style={sectionStyle}
      onClick={(e) => {
        if (onNodeClick) {
          e.stopPropagation();
          onNodeClick(node.id);
        }
      }}
    >
      {bgImage && enableOverlay && <div style={overlayStyle} />}

      <div style={contentStyle}>
        <h1 style={headlineStyle}>{headline}</h1>
        {subheadline && <p style={subheadlineStyle}>{subheadline}</p>}
        {ctaLabel && (
          <a
            href={ctaHref}
            style={buttonStyle}
            target={data.ctaUrl?.openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
