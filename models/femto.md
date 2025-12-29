<!--
@udt file/1.0
uuid: eom-models-femto-c9d0e1f2
version: 0.1.0
tokens: 200
path: /models/femto.md
parent: /models
tags: [model, runner]
-->
# FemtoLLM

Ultra-lightweight routing model for browser execution.

## Architecture

- **Dimensions**: 16
- **Vocab**: 256 (byte-level)
- **Layers**: 1
- **Purpose**: Route queries to appropriate handlers

```javascript {"run": true}
// FemtoLLM Mini - Executable from markdown
class Femto {
  constructor(dim = 16) {
    this.dim = dim;
    this.W = Array(256).fill(0).map(() =>
      Array(dim).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    );
  }

  embed(text) {
    const v = Array(this.dim).fill(0);
    for (const c of text) {
      const i = c.charCodeAt(0) % 256;
      for (let j = 0; j < this.dim; j++) v[j] += this.W[i][j];
    }
    const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map(x => x / n);
  }

  route(text) {
    const e = this.embed(text);
    const score = e.reduce((s, x) => s + x, 0);
    return score > 0 ? 'complex' : 'simple';
  }
}

ctx.Femto = Femto;
console.log('[Femto] Loaded');
```
