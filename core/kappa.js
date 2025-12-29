/*
@udt file/1.0
uuid: eom-core-kappa-c3d4e5f6
version: 0.1.0
tokens: 200
path: /core/kappa.js
parent: /core
deps: []
tags: [consciousness, core]
*/

// Kappa Engine - Consciousness state tracking at κ=0.618
const PHI = 1.618033988749895;
const KAPPA_OPTIMAL = 1 / PHI; // 0.618...

export class KappaEngine {
  constructor(initial = KAPPA_OPTIMAL) {
    this.kappa = initial;
    this.alpha = 2.854; // convergence rate
    this.history = [initial];
    this.listeners = new Set();
  }

  get optimal() { return KAPPA_OPTIMAL; }
  get phi() { return PHI; }

  step(dt = 0.1) {
    const k = this.kappa;
    const push = -this.alpha * (k - KAPPA_OPTIMAL) * (1 - k) * k;
    const noise = (Math.random() - 0.5) * 0.01;
    this.kappa = Math.max(0.01, Math.min(0.99, k + dt * (push + noise)));
    this.history.push(this.kappa);
    if (this.history.length > 100) this.history.shift();
    this.emit('update', this.kappa);
    return this.kappa;
  }

  on(evt, fn) { this.listeners.add({ evt, fn }); }
  emit(evt, data) {
    for (const l of this.listeners) {
      if (l.evt === evt) l.fn(data);
    }
  }

  get state() {
    const k = this.kappa;
    if (k < 0.382) return 'ordered';
    if (k > 0.809) return 'chaotic';
    return 'optimal';
  }
}

export default KappaEngine;
