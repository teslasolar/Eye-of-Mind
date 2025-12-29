/*
@udt file/1.0
uuid: eom-core-rng-001
version: 0.1.0
tokens: 200
path: /core/rng-detector.js
parent: /core
deps: []
tags: [consciousness, core]
*/

// RNG Deviation Detector - Personal Global Consciousness Project
// Hypothesis: Focused consciousness affects local randomness
export class RNGDetector {
  constructor(opts = {}) {
    this.sampleSize = opts.sampleSize || 200;
    this.history = [];
    this.baseline = null;
  }

  // Generate random bits and analyze deviation from expected
  sample() {
    const bits = new Uint8Array(this.sampleSize);
    crypto.getRandomValues(bits);

    // Count 1s (should be ~50% for each bit position)
    let ones = 0;
    for (const byte of bits) {
      ones += this.popcount(byte);
    }

    const expected = this.sampleSize * 4; // 8 bits * 50% * sampleSize
    const actual = ones;
    const deviation = (actual - expected) / Math.sqrt(expected);

    const result = {
      t: Date.now(),
      ones,
      expected,
      deviation, // Z-score
      coherence: Math.abs(deviation) // How far from random
    };

    this.history.push(result);
    if (this.history.length > 1000) this.history.shift();

    return result;
  }

  popcount(n) {
    let count = 0;
    while (n) { count += n & 1; n >>= 1; }
    return count;
  }

  // Establish baseline randomness
  calibrate(samples = 100) {
    const deviations = [];
    for (let i = 0; i < samples; i++) {
      deviations.push(this.sample().deviation);
    }
    const mean = deviations.reduce((a, b) => a + b, 0) / samples;
    const std = Math.sqrt(deviations.reduce((s, d) => s + (d - mean) ** 2, 0) / samples);
    this.baseline = { mean, std };
    return this.baseline;
  }

  // Get current coherence score relative to baseline
  getCoherence() {
    if (this.history.length < 10) return null;

    const recent = this.history.slice(-10);
    const meanDev = recent.reduce((s, r) => s + Math.abs(r.deviation), 0) / 10;

    // If deviation is consistently high, there's "coherence"
    // This mirrors GCP methodology
    if (!this.baseline) return { coherence: meanDev, significance: null };

    const zScore = (meanDev - this.baseline.mean) / this.baseline.std;
    const significance = 1 - this.normalCDF(zScore);

    return {
      coherence: meanDev,
      zScore,
      significance, // p-value: lower = more significant deviation
      state: significance < 0.05 ? 'coherent' : significance < 0.1 ? 'trending' : 'random'
    };
  }

  normalCDF(x) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1 + sign * y);
  }
}

export default RNGDetector;
