import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { DocumentInterpreter, TokenResolver } from '@wuzzkang/renderer-core';
import { HeroBasicRenderer } from '../../../sections/hero-basic/Renderer.jsx';

// Section Component Registry
const RENDERER_REGISTRY = {
  'hero-basic': HeroBasicRenderer
};

function PreviewApp() {
  const [document, setDocument] = useState(null);
  const [designSystem, setDesignSystem] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 1. Notify parent host window that preview iframe is ready
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        source: 'wuzzkang-preview',
        version: '1.0',
        type: 'RENDERER_READY',
        payload: { supportedSchemaVersion: '1.0.0' },
        timestamp: Date.now()
      }, '*');
    }

    // 2. PostMessage Listener for Host Messages
    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg || msg.source !== 'wuzzkang-builder') return;

      switch (msg.type) {
        case 'INIT':
          if (msg.payload.document) setDocument(msg.payload.document);
          if (msg.payload.designSystem) setDesignSystem(msg.payload.designSystem);
          if (msg.payload.selectedNodeId) setSelectedNodeId(msg.payload.selectedNodeId);
          break;
        case 'UPDATE_NODES':
          if (msg.payload.nodes && document) {
            setDocument(prev => prev ? { ...prev, nodes: msg.payload.nodes } : null);
          }
          break;
        case 'UPDATE_DESIGN_SYSTEM':
          if (msg.payload.designSystem) setDesignSystem(msg.payload.designSystem);
          break;
        case 'SELECT_NODE':
          setSelectedNodeId(msg.payload.nodeId || null);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [document]);

  // Inject CSS custom properties when designSystem updates
  useEffect(() => {
    if (!designSystem) return;

    try {
      const root = window.document.documentElement;
      // Inject basic brand variables
      const brandPrimary = TokenResolver.resolveToken('semantic.color.brand.primary', designSystem, isDarkMode);
      const bgPrimary = TokenResolver.resolveToken('semantic.color.background.primary', designSystem, isDarkMode);
      const textPrimary = TokenResolver.resolveToken('semantic.color.text.primary', designSystem, isDarkMode);

      root.style.setProperty('--wk-semantic-color-brand-primary', brandPrimary);
      root.style.setProperty('--wk-semantic-color-background-primary', bgPrimary);
      root.style.setProperty('--wk-semantic-color-text-primary', textPrimary);
    } catch (err) {
      console.warn('[PreviewApp] Token resolution warning:', err);
    }
  }, [designSystem, isDarkMode]);

  const handleNodeClick = (nodeId) => {
    setSelectedNodeId(nodeId);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        source: 'wuzzkang-preview',
        version: '1.0',
        type: 'NODE_CLICKED',
        payload: { nodeId },
        timestamp: Date.now()
      }, '*');
    }
  };

  if (!document || !designSystem) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
        <h3>⌛ Waiting for WuzzKang Builder payload...</h3>
      </div>
    );
  }

  // Resolve Document using DocumentInterpreter
  const resolvedTree = DocumentInterpreter.interpret(document, designSystem, {}, isDarkMode);

  return (
    <div className="wuzzkang-preview-container" style={{ minHeight: '100vh', padding: '16px' }}>
      {resolvedTree.nodes.map(node => {
        const RendererComponent = RENDERER_REGISTRY[node.typeId];
        const isSelected = selectedNodeId === node.id;

        if (!RendererComponent) {
          return (
            <div
              key={node.id}
              style={{
                padding: '24px',
                margin: '16px 0',
                backgroundColor: '#FEF2F2',
                border: '1px dashed #EF4444',
                borderRadius: '8px',
                color: '#991B1B'
              }}
            >
              ⚠️ Section type <strong>{node.typeId}</strong> does not have a registered renderer.
            </div>
          );
        }

        return (
          <div
            key={node.id}
            style={{
              position: 'relative',
              outline: isSelected ? '3px solid #3B82F6' : 'none',
              outlineOffset: '2px',
              borderRadius: '8px',
              transition: 'outline 0.15s ease'
            }}
          >
            <RendererComponent node={node} onNodeClick={handleNodeClick} />
          </div>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PreviewApp />
  </React.StrictMode>
);
