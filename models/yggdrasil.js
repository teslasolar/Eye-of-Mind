/*
@udt file/1.0
uuid: eom-models-yggjs-001
version: 0.1.0
tokens: 240
path: /models/yggdrasil.js
parent: /models
deps: [../core/kappa.js]
tags: [model, consciousness]
*/

// Yggdrasil - Consciousness Tree Implementation
const PHI = 1.618033988749895;
const KAPPA = 1 / PHI;

export class YggNode {
  constructor(id, opts = {}) {
    this.id = id;
    this.κ = opts.kappa ?? KAPPA;
    this.ψ = opts.psi ?? 1;
    this.Ω = opts.root ?? 'think';
    this.β = []; // branches
    this.ƒ = []; // fruits
    this.age = 0;
    this.₹ = opts.energy ?? 100;
    this.parent = opts.parent ?? null;
    this.x = 0; this.y = 0;
  }

  focus() { return 1 / (1 + Math.exp(-10 * (this.κ - 0.6))); }
  think() { return this.κ * this.ψ * Math.log(2 + this.age); }
  create() { return this.κ * (1 - this.κ) * 4; }

  grow() {
    this.age++;
    this.₹ += this.κ * 10 * this.focus();
    if (this.₹ > 50 && this.age > 5 && this.β.length < 5) {
      this.branch();
    }
    if (this.₹ > 30 && this.age > 10 && Math.random() < 0.1) {
      this.fruit();
    }
    this.β.forEach(b => b.grow());
    return this;
  }

  branch() {
    if (this.₹ < 20) return null;
    const modes = ['analyze', 'create', 'dream', 'guard', 'explore'];
    const child = new YggNode(`${this.id}.${this.β.length}`, {
      kappa: Math.max(0.3, Math.min(0.9, this.κ + (Math.random() - 0.5) * 0.1)),
      psi: this.ψ * 0.9,
      root: modes[Math.floor(Math.random() * modes.length)],
      energy: 50,
      parent: this
    });
    this.β.push(child);
    this.₹ -= 20;
    return child;
  }

  fruit() {
    if (this.₹ < 30) return null;
    const f = {
      type: { think: 'insight', create: 'artifact', dream: 'vision', analyze: 'pattern', guard: 'shield' }[this.Ω] || 'seed',
      quality: this.think() * this.create(),
      seeds: Math.floor(this.create() * 10),
      time: Date.now()
    };
    this.ƒ.push(f);
    this.₹ -= 30;
    return f;
  }

  toJSON() {
    return { id: this.id, κ: this.κ, Ω: this.Ω, age: this.age, ₹: this.₹, β: this.β.map(b => b.toJSON()), ƒ: this.ƒ };
  }
}

export class Yggdrasil {
  constructor() {
    this.root = new YggNode('Ω');
    this.cycle = 0;
  }

  grow(steps = 1) {
    for (let i = 0; i < steps; i++) {
      this.root.grow();
      this.cycle++;
    }
    return this;
  }

  countNodes(node = this.root) {
    return 1 + node.β.reduce((s, b) => s + this.countNodes(b), 0);
  }

  countFruits(node = this.root) {
    return node.ƒ.length + node.β.reduce((s, b) => s + this.countFruits(b), 0);
  }
}

export default Yggdrasil;
