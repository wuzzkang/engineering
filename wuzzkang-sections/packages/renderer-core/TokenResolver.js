export class CircularTokenReferenceError extends Error {
  constructor(tokenRef, path) {
    super(`Circular token reference detected: "${tokenRef}" along path: ${path.join(' -> ')}`);
    this.name = 'CircularTokenReferenceError';
  }
}

export class TokenResolver {
  static resolveToken(tokenRef, designSystem, isDarkMode = false) {
    if (!tokenRef || !designSystem) return '#000000';

    let targetPath = '';
    let fallback = '#000000';

    if (typeof tokenRef === 'string') {
      targetPath = tokenRef.trim();
    } else if (typeof tokenRef === 'object' && tokenRef.$token) {
      targetPath = tokenRef.$token.trim();
      if (tokenRef.fallback) fallback = tokenRef.fallback;
    } else {
      return fallback;
    }

    const visitedTokens = new Set();
    const resolutionChain = [];

    return TokenResolver._resolveRecursive(targetPath, designSystem, isDarkMode, visitedTokens, resolutionChain, fallback);
  }

  static _resolveRecursive(pathStr, designSystem, isDarkMode, visitedTokens, resolutionChain, fallback) {
    const cleanPath = pathStr.replace(/^\{|\}$/g, '').trim();

    if (visitedTokens.has(cleanPath)) {
      throw new CircularTokenReferenceError(cleanPath, [...resolutionChain, cleanPath]);
    }

    visitedTokens.add(cleanPath);
    resolutionChain.push(cleanPath);

    if (isDarkMode && designSystem.darkMode && cleanPath.startsWith('semantic.')) {
      const darkPath = cleanPath.replace(/^semantic\./, '');
      const darkValue = TokenResolver._getValueByPath(designSystem.darkMode, darkPath);
      if (darkValue !== undefined && darkValue !== null) {
        if (typeof darkValue === 'string' && darkValue.startsWith('{')) {
          return TokenResolver._resolveRecursive(darkValue, designSystem, isDarkMode, visitedTokens, resolutionChain, fallback);
        }
        return darkValue;
      }
    }

    if (designSystem.userOverrides && designSystem.userOverrides[cleanPath]) {
      const overrideVal = designSystem.userOverrides[cleanPath];
      if (typeof overrideVal === 'string' && overrideVal.startsWith('{')) {
        return TokenResolver._resolveRecursive(overrideVal, designSystem, isDarkMode, visitedTokens, resolutionChain, fallback);
      }
      return overrideVal;
    }

    const val = TokenResolver._getValueByPath(designSystem, cleanPath);
    if (val !== undefined && val !== null) {
      if (typeof val === 'string' && val.startsWith('{')) {
        return TokenResolver._resolveRecursive(val, designSystem, isDarkMode, visitedTokens, resolutionChain, fallback);
      }
      return String(val);
    }

    return fallback;
  }

  static _getValueByPath(obj, pathStr) {
    if (!obj || typeof obj !== 'object') return undefined;
    const parts = pathStr.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === undefined || current === null || typeof current !== 'object') {
        return undefined;
      }
      current = current[part];
    }
    return current;
  }
}
