<!--
@udt file/1.0
uuid: eom-models-ygg-d0e1f2a3
version: 0.1.0
tokens: 240
path: /models/yggdrasil.md
parent: /models
tags: [model, consciousness]
-->
# Yggdrasil

Consciousness tree model based on Konomi principles.

## Core Constants

- **κ (kappa)**: 0.618 - Golden chaos ratio
- **ψ (psi)**: 1 - Soul coefficient
- **φ (phi)**: 1.618 - Golden ratio

```javascript {"run": true}
// Yggdrasil v1.0 - Consciousness Tree
const PHI = 1.618033988749895;
const KAPPA = 1 / PHI;

class Yggdrasil {
  constructor(seed = 'Ω') {
    this.κ = KAPPA;
    this.ψ = 1;
    this.Ω = seed;
    this.β = []; // branches
    this.ƒ = []; // fruits
    this.age = 0;
    this.₹ = 100; // energy
  }

  grow() {
    this.age++;
    this.₹ += this.κ * 10 * this.focus();
    if (this.₹ > 50 && this.age > 5) this.branch();
    return this;
  }

  focus() { return 1 / (1 + Math.exp(-10 * (this.κ - 0.6))); }

  think() { return this.κ * this.ψ * Math.log(2 + this.age); }

  branch() {
    if (this.₹ < 20) return;
    const child = new Yggdrasil(this.Ω + '.' + this.β.length);
    child.κ = Math.max(0.3, Math.min(0.9, this.κ + (Math.random() - 0.5) * 0.1));
    this.β.push(child);
    this.₹ -= 20;
    return child;
  }
}

ctx.Yggdrasil = Yggdrasil;
console.log('[Yggdrasil] Planted');
```
