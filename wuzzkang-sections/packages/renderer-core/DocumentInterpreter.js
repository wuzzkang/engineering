import { TokenResolver } from './TokenResolver.js';

export class DocumentInterpreter {
  static interpret(document, designSystem, typeRegistry = {}, isDarkMode = false) {
    if (!document || !document.nodes) {
      return { meta: document?.meta || {}, designSystemId: document?.designSystemId || '', nodes: [] };
    }

    const nodeMap = new Map();
    for (const node of document.nodes) {
      if (node && node.id) {
        nodeMap.set(node.id, node);
      }
    }

    const resolvedNodes = document.nodes.map(node => {
      const typeDef = typeRegistry[node.typeId] || null;
      const typeDefaults = typeDef?.defaults || {};

      const mergedData = { ...typeDefaults, ...node.data };

      const resolvedData = {};
      for (const [key, fieldValue] of Object.entries(mergedData)) {
        resolvedData[key] = DocumentInterpreter._resolveFieldValue(
          fieldValue,
          designSystem,
          nodeMap,
          isDarkMode
        );
      }

      const resolvedStyles = {};
      if (node.styleOverrides && typeof node.styleOverrides === 'object') {
        for (const [styleKey, styleVal] of Object.entries(node.styleOverrides)) {
          if (styleVal && styleVal.$token) {
            resolvedStyles[styleKey] = TokenResolver.resolveToken(styleVal, designSystem, isDarkMode);
          } else if (typeof styleVal === 'string') {
            resolvedStyles[styleKey] = styleVal;
          }
        }
      }

      return {
        id: node.id,
        typeId: node.typeId,
        order: node.order,
        parentId: node.parentId || null,
        data: resolvedData,
        styleOverrides: resolvedStyles,
        visibility: node.visibility || { desktop: true, tablet: true, mobile: true },
        locked: Boolean(node.locked),
        label: node.label || `${node.typeId} Section`
      };
    });

    resolvedNodes.sort((a, b) => a.order - b.order);

    return {
      meta: document.meta || {},
      designSystemId: document.designSystemId,
      nodes: resolvedNodes
    };
  }

  static _resolveFieldValue(fieldValue, designSystem, nodeMap, isDarkMode) {
    if (!fieldValue || typeof fieldValue !== 'object') {
      return fieldValue;
    }

    const { $type } = fieldValue;

    if ($type === 'color' && fieldValue.token) {
      return {
        $type: 'color',
        token: fieldValue.token,
        resolvedValue: TokenResolver.resolveToken(fieldValue.token, designSystem, isDarkMode),
        fallback: fieldValue.fallback || '#000000'
      };
    }

    if ($type === 'noderef' && fieldValue.nodeId) {
      const referencedNode = nodeMap.get(fieldValue.nodeId);
      return {
        $type: 'noderef',
        nodeId: fieldValue.nodeId,
        resolvedNode: referencedNode || null
      };
    }

    if ($type === 'list' && Array.isArray(fieldValue.items)) {
      return {
        $type: 'list',
        items: fieldValue.items.map(item =>
          DocumentInterpreter._resolveFieldValue(item, designSystem, nodeMap, isDarkMode)
        )
      };
    }

    return fieldValue;
  }
}
