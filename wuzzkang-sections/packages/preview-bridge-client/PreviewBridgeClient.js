import { BRIDGE_MESSAGE_TYPES } from '@wuzzkang/types';

export class PreviewBridgeClient {
  /**
   * @param {HTMLIFrameElement} iframeElement - Target preview iframe DOM element.
   * @param {Object} options
   * @param {string} [options.targetOrigin='*'] - Target iframe origin for security checks.
   * @param {Function} [options.onNodeClicked] - Callback when node is clicked in preview.
   * @param {Function} [options.onRendererReady] - Callback when renderer finishes mounting.
   */
  constructor(iframeElement, options = {}) {
    this.iframe = iframeElement;
    this.targetOrigin = options.targetOrigin || '*';
    this.onNodeClicked = options.onNodeClicked || null;
    this.onRendererReady = options.onRendererReady || null;
    this._handleMessage = this._handleMessage.bind(this);

    if (typeof window !== 'undefined') {
      window.addEventListener('message', this._handleMessage);
    }
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this._handleMessage);
    }
  }

  _sendMessage(type, payload) {
    if (!this.iframe || !this.iframe.contentWindow) return;

    const message = {
      source: 'wuzzkang-builder',
      version: '1.0',
      type,
      payload,
      timestamp: Date.now()
    };

    this.iframe.contentWindow.postMessage(message, this.targetOrigin);
  }

  _handleMessage(event) {
    const message = event.data;
    if (!message || message.source !== 'wuzzkang-preview') return;

    switch (message.type) {
      case BRIDGE_MESSAGE_TYPES.RENDERER_READY:
        if (this.onRendererReady) this.onRendererReady(message.payload);
        break;
      case BRIDGE_MESSAGE_TYPES.NODE_CLICKED:
        if (this.onNodeClicked && message.payload?.nodeId) {
          this.onNodeClicked(message.payload.nodeId);
        }
        break;
      default:
        break;
    }
  }

  // === HOST ACTION METHODS ===

  init(document, designSystem, selectedNodeId = null) {
    this._sendMessage(BRIDGE_MESSAGE_TYPES.INIT, {
      document,
      designSystem,
      selectedNodeId
    });
  }

  updateNodes(nodes) {
    this._sendMessage(BRIDGE_MESSAGE_TYPES.UPDATE_NODES, { nodes });
  }

  updateDesignSystem(designSystem) {
    this._sendMessage(BRIDGE_MESSAGE_TYPES.UPDATE_DESIGN_SYSTEM, { designSystem });
  }

  selectNode(nodeId) {
    this._sendMessage(BRIDGE_MESSAGE_TYPES.SELECT_NODE, { nodeId });
  }
}
