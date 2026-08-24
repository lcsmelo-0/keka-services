const decodeUrl = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return decodeURI(value);
  }
};

const encodeUrl = (value) => {
  return encodeURIComponent(value);
};

const normalizeBase64 = (value) => {
  const compactValue = value.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - (compactValue.length % 4)) % 4;

  return `${compactValue}${'='.repeat(paddingLength)}`;
};

const decodeBase64 = (value) => {
  const binaryValue = atob(normalizeBase64(value));
  const bytes = Uint8Array.from(binaryValue, (character) => {
    return character.charCodeAt(0);
  });

  return new TextDecoder().decode(bytes);
};

const encodeBase64 = (value) => {
  const bytes = new TextEncoder().encode(value);
  let binaryValue = '';

  bytes.forEach((byte) => {
    binaryValue += String.fromCharCode(byte);
  });

  return btoa(binaryValue);
};

const decodeHtml = (value) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;

  return textarea.value;
};

const encodeHtml = (value) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
};

const decodeHexEscape = (hexValue, useCodePoint) => {
  const parsedValue = Number.parseInt(hexValue, 16);

  if (useCodePoint) {
    return String.fromCodePoint(parsedValue);
  }

  return String.fromCharCode(parsedValue);
};

const decodeUnicode = (value) => {
  return value
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (...matchGroups) => {
      return decodeHexEscape(matchGroups[1], true);
    })
    .replace(/\\u([0-9a-fA-F]{4})/g, (...matchGroups) => {
      return decodeHexEscape(matchGroups[1], false);
    })
    .replace(/\\x([0-9a-fA-F]{2})/g, (...matchGroups) => {
      return decodeHexEscape(matchGroups[1], false);
    });
};

const encodeUnicode = (value) => {
  return Array.from(value)
    .map((character) => {
      const codePoint = character.codePointAt(0);

      if (codePoint <= 0x7f) {
        return character;
      }

      if (codePoint <= 0xffff) {
        return `\\u${codePoint.toString(16).padStart(4, '0')}`;
      }

      return `\\u{${codePoint.toString(16)}}`;
    })
    .join('');
};

const MAX_DECODE_PASSES = 100;

const decodeUntilStable = (value, decodeFn) => {
  const seenValues = new Set([value]);
  let currentValue = value;
  let passCount = 0;

  while (passCount < MAX_DECODE_PASSES) {
    let nextValue;

    try {
      nextValue = decodeFn(currentValue);
    } catch {
      if (passCount === 0) {
        throw new Error('Decode failed');
      }

      break;
    }

    if (nextValue === currentValue) {
      break;
    }

    if (seenValues.has(nextValue)) {
      break;
    }

    seenValues.add(nextValue);
    currentValue = nextValue;
    passCount += 1;
  }

  return {
    output: currentValue,
    passCount,
  };
};

const transformersByMode = {
  base64: {
    decode: decodeBase64,
    encode: encodeBase64,
  },
  html: {
    decode: decodeHtml,
    encode: encodeHtml,
  },
  unicode: {
    decode: decodeUnicode,
    encode: encodeUnicode,
  },
  url: {
    decode: decodeUrl,
    encode: encodeUrl,
  },
};

export const transformString = (value, mode, action) => {
  if (!value) {
    return {
      hasError: false,
      output: '',
      passCount: 0,
    };
  }

  const transformer = transformersByMode[mode]?.[action];

  if (!transformer) {
    return {
      hasError: true,
      output: '',
      passCount: 0,
    };
  }

  try {
    if (action === 'decode') {
      const decodeResult = decodeUntilStable(value, transformer);

      return {
        hasError: false,
        output: decodeResult.output,
        passCount: decodeResult.passCount,
      };
    }

    return {
      hasError: false,
      output: transformer(value),
      passCount: 0,
    };
  } catch {
    return {
      hasError: true,
      output: '',
      passCount: 0,
    };
  }
};
