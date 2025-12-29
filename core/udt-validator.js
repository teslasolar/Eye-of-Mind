/*
@udt file/1.0
uuid: eom-core-udtvalid-002
version: 0.1.0
tokens: 230
path: /core/udt-validator.js
parent: /core
deps: [udt-parser.js]
tags: [udt, core]
*/

import { UDTParser } from './udt-parser.js';

// UDT Validator - Validate parsed UDT against templates
export class UDTValidator {
  constructor() {
    this.templates = new Map();
    this.errors = [];
  }

  async loadTemplate(path) {
    const res = await fetch(path);
    const tpl = await res.json();
    this.templates.set(tpl.template, tpl);
    return tpl;
  }

  validate(udt, templateName = 'file') {
    this.errors = [];
    const tpl = this.templates.get(templateName);

    if (!tpl) {
      this.errors.push(`Template '${templateName}' not found`);
      return false;
    }

    const fields = tpl.fields || {};

    for (const [name, def] of Object.entries(fields)) {
      const val = udt[name];

      // Required check
      if (def.required && !val && !def.auto) {
        this.errors.push(`Missing required field: ${name}`);
      }

      // Type check
      if (val && def.type) {
        if (!this.checkType(val, def.type)) {
          this.errors.push(`Invalid type for ${name}: expected ${def.type}`);
        }
      }
    }

    // Token limit
    if (udt.tokens && tpl.maxTokens && udt.tokens > tpl.maxTokens) {
      this.errors.push(`Token count ${udt.tokens} exceeds max ${tpl.maxTokens}`);
    }

    return this.errors.length === 0;
  }

  checkType(val, type) {
    switch (type) {
      case 'uuid': return /^eom-[\w-]+$/.test(val);
      case 'semver': return /^\d+\.\d+\.\d+$/.test(val);
      case 'int': return Number.isInteger(Number(val));
      case 'path': return val.startsWith('/');
      case 'array<ref>': return Array.isArray(val);
      case 'array<tag>': return Array.isArray(val);
      default: return true;
    }
  }

  getErrors() { return this.errors; }
}

export default UDTValidator;
