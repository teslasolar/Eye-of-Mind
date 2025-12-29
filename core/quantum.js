/*
@udt file/1.0
uuid: eom-core-quantum-001
version: 0.1.0
tokens: 250
path: /core/quantum.js
parent: /core
deps: [observer.js]
tags: [consciousness, core]
*/

import { ObserverDetector } from './observer.js';

// Quantum State - Superposition until observed
export class QuantumState {
  constructor(possibilities = [0, 1]) {
    this.possibilities = possibilities;
    this.collapsed = false;
    this.value = null;
    this.collapseTime = null;
  }

  // State exists in superposition
  get superposition() {
    return !this.collapsed;
  }

  // Observation collapses the wave function
  observe() {
    if (!this.collapsed) {
      const idx = Math.floor(Math.random() * this.possibilities.length);
      this.value = this.possibilities[idx];
      this.collapsed = true;
      this.collapseTime = Date.now();
    }
    return this.value;
  }

  reset() {
    this.collapsed = false;
    this.value = null;
    this.collapseTime = null;
  }
}

// Double Slit Experiment Simulation
export class DoubleSlit {
  constructor(opts = {}) {
    this.observer = new ObserverDetector();
    this.width = opts.width || 400;
    this.height = opts.height || 300;
    this.slitY = [this.height * 0.35, this.height * 0.65];
    this.particles = [];
    this.pattern = new Array(this.width).fill(0);
    this.isObserving = false;
    this.particleCount = 0;
  }

  start() {
    this.observer.start();
    this.observer.on('sample', (s) => {
      this.isObserving = s.isObserved;
    });
  }

  // Fire a particle through the slits
  fireParticle() {
    const particle = {
      id: this.particleCount++,
      x: 0,
      y: this.height / 2,
      observed: this.isObserving,
      path: null,
      landed: false
    };

    if (this.isObserving) {
      // OBSERVED: Particle behavior - goes through ONE slit
      // Observer collapses the wave function
      particle.path = Math.random() < 0.5 ? 'top' : 'bottom';
      particle.targetY = particle.path === 'top' ? this.slitY[0] : this.slitY[1];
      // Gaussian distribution around the slit
      particle.finalX = this.gaussianLand(particle.targetY, 20);
    } else {
      // UNOBSERVED: Wave behavior - interference pattern
      // Particle goes through BOTH slits (superposition)
      particle.path = 'both';
      // Interference pattern: probability based on wave superposition
      particle.finalX = this.interferencePattern();
    }

    this.particles.push(particle);
    return particle;
  }

  // Gaussian distribution for particle behavior
  gaussianLand(center, spread) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const gauss = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return Math.max(0, Math.min(this.width - 1, Math.floor(center + gauss * spread)));
  }

  // Interference pattern for wave behavior
  interferencePattern() {
    // Double-slit interference: I = 4 * I0 * cos²(πd*sin(θ)/λ)
    // Simplified: peaks at regular intervals
    const wavelength = 30;
    const slitSeparation = this.slitY[1] - this.slitY[0];

    // Generate position with interference probability
    let attempts = 0;
    while (attempts < 100) {
      const y = Math.random() * this.height;
      const pathDiff = Math.abs(y - this.slitY[0]) - Math.abs(y - this.slitY[1]);
      const phase = (2 * Math.PI * pathDiff) / wavelength;
      const intensity = Math.pow(Math.cos(phase / 2), 2);

      if (Math.random() < intensity) {
        return Math.floor(y);
      }
      attempts++;
    }
    return Math.floor(this.height / 2);
  }

  // Update pattern histogram
  updatePattern() {
    this.pattern = new Array(this.height).fill(0);
    for (const p of this.particles) {
      if (p.finalX !== undefined) {
        this.pattern[p.finalX]++;
      }
    }
  }

  // Get experiment statistics
  getStats() {
    const observed = this.particles.filter(p => p.observed);
    const unobserved = this.particles.filter(p => !p.observed);

    return {
      total: this.particles.length,
      observed: observed.length,
      unobserved: unobserved.length,
      isCurrentlyObserving: this.isObserving,
      observerStats: this.observer.getStats()
    };
  }

  reset() {
    this.particles = [];
    this.pattern = new Array(this.height).fill(0);
    this.particleCount = 0;
  }
}

export default DoubleSlit;
