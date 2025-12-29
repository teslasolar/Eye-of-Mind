/*
@udt file/1.0
uuid: eom-core-udtparser-001
version: 0.1.0
tokens: 240
path: /core/udt-parser.js
parent: /core
deps: []
tags: [udt, core]
*/

// UDT Parser - Extract and parse UDT headers from files
export class UDTParser {
  static HEADER_REGEX = /<!--\s*\n@udt\s+(\S+)\s*\n([\s\S]*?)-->/;
  static JS_HEADER_REGEX = /\/\*\s*\n@udt\s+(\S+)\s*\n([\s\S]*?)\*\//;

  static parse(content, filename = '') {
    const isJS = filename.endsWith('.js') || filename.endsWith('.json');
    const regex = isJS ? this.JS_HEADER_REGEX : this.HEADER_REGEX;
    const match = content.match(regex);

    if (!match) return null;

    const [, schema, body] = match;
    const fields = {};

    body.split('\n').forEach(line => {
      const m = line.match(/^(\w+):\s*(.+)$/);
      if (m) {
        let [, key, val] = m;
        val = val.trim();
        // Parse arrays
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.slice(1, -1).split(',').map(s => s.trim());
        }
        fields[key] = val;
      }
    });

    return { schema, ...fields };
  }

  static async parseFile(path) {
    const res = await fetch(path);
    const content = await res.text();
    return this.parse(content, path);
  }

  static generateUUID() {
    return 'eom-' + crypto.randomUUID().slice(0, 23);
  }

  static countTokens(text) {
    // Simple approximation: ~4 chars per token
    return Math.ceil(text.length / 4);
  }

  static generateHeader(opts = {}) {
    const uuid = opts.uuid || this.generateUUID();
    const version = opts.version || '0.1.0';
    const tokens = opts.tokens || 0;
    const path = opts.path || '/unknown';
    const parent = opts.parent || 'null';
    const deps = opts.deps || [];
    const tags = opts.tags || [];

    return `@udt file/1.0
uuid: ${uuid}
version: ${version}
tokens: ${tokens}
path: ${path}
parent: ${parent}
deps: [${deps.join(', ')}]
tags: [${tags.join(', ')}]`;
  }
}

export default UDTParser;
