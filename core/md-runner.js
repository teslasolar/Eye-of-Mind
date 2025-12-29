/*
@udt file/1.0
uuid: eom-core-mdrunner-b2c3d4e5
version: 0.1.0
tokens: 220
path: /core/md-runner.js
parent: /core
deps: []
tags: [runner, core]
*/

// Markdown Runner - Execute code from .md files
export class MDRunner {
  constructor(opts = {}) {
    this.cache = new Map();
    this.ctx = opts.context || {};
  }

  async load(path) {
    if (this.cache.has(path)) return this.cache.get(path);
    const res = await fetch(path);
    const md = await res.text();
    const parsed = this.parse(md);
    this.cache.set(path, parsed);
    return parsed;
  }

  parse(md) {
    const blocks = [];
    const regex = /```(\w+)(?:\s+(\{[^}]+\}))?\n([\s\S]*?)```/g;
    let m;
    while ((m = regex.exec(md)) !== null) {
      blocks.push({
        lang: m[1],
        meta: m[2] ? JSON.parse(m[2]) : {},
        code: m[3].trim()
      });
    }
    return { raw: md, blocks };
  }

  async run(block) {
    if (block.lang === 'javascript' || block.lang === 'js') {
      const fn = new Function('ctx', block.code);
      return fn(this.ctx);
    }
    return { skip: true, lang: block.lang };
  }

  async exec(path) {
    const { blocks } = await this.load(path);
    const results = [];
    for (const b of blocks) {
      if (b.meta.run !== false) {
        results.push(await this.run(b));
      }
    }
    return results;
  }
}

export default MDRunner;
