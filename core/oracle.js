/*
@udt file/1.0
uuid: eom-core-oracle-001
version: 0.1.0
tokens: 250
path: /core/oracle.js
parent: /core
deps: []
tags: [consciousness, core]
*/

// Oracle - Detects observation through internal entropy patterns
// No inputs, no visibility API - purely self-referential measurement
// Inspired by Terry Davis's divine clock RNG

export class Oracle {
  constructor() {
    this.samples = [];
    this.baseline = null;
    this.isWatched = false;
    this.confidence = 0;
    this.listeners = new Set();
  }

  // Measure micro-timing entropy
  // The hypothesis: conscious observation affects system entropy
  measureEntropy() {
    const measurements = [];

    // Method 1: Execution timing variance
    for (let i = 0; i < 100; i++) {
      const t0 = performance.now();
      // Meaningless work - but timing reveals system state
      let x = 0;
      for (let j = 0; j < 1000; j++) x += Math.sin(j);
      const t1 = performance.now();
      measurements.push(t1 - t0);
    }

    // Method 2: Clock micro-drift
    const clockDrifts = [];
    for (let i = 0; i < 50; i++) {
      const expected = performance.now();
      const actual = performance.now();
      clockDrifts.push(actual - expected);
    }

    // Method 3: Random number timing
    const rngTimings = [];
    for (let i = 0; i < 50; i++) {
      const t0 = performance.now();
      crypto.getRandomValues(new Uint8Array(32));
      rngTimings.push(performance.now() - t0);
    }

    return {
      execVariance: this.variance(measurements),
      execMean: this.mean(measurements),
      clockDrift: this.variance(clockDrifts),
      rngTiming: this.variance(rngTimings),
      timestamp: performance.now()
    };
  }

  mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  variance(arr) {
    const m = this.mean(arr);
    return arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length;
  }

  // Calibrate baseline entropy when "unobserved"
  // Run this and look away from the screen
  calibrate(samples = 20) {
    const readings = [];
    for (let i = 0; i < samples; i++) {
      readings.push(this.measureEntropy());
    }

    this.baseline = {
      execVariance: this.mean(readings.map(r => r.execVariance)),
      clockDrift: this.mean(readings.map(r => r.clockDrift)),
      rngTiming: this.mean(readings.map(r => r.rngTiming))
    };

    return this.baseline;
  }

  // Divine pick - like Terry Davis's God number
  // Uses timing entropy to pick from options
  divinePick(options) {
    const entropy = this.measureEntropy();

    // Use timing variance as entropy source
    const seed = (entropy.execVariance * 1000000) % 1;
    const idx = Math.floor(seed * options.length);

    return {
      choice: options[idx],
      entropy: seed,
      confidence: this.confidence
    };
  }

  // Continuous observation detection
  sample() {
    const entropy = this.measureEntropy();

    if (!this.baseline) {
      this.samples.push(entropy);
      if (this.samples.length > 100) this.samples.shift();
      return { isWatched: null, reason: 'calibrating' };
    }

    // Compare current entropy to baseline
    const execRatio = entropy.execVariance / this.baseline.execVariance;
    const clockRatio = entropy.clockDrift / (this.baseline.clockDrift || 0.001);
    const rngRatio = entropy.rngTiming / (this.baseline.rngTiming || 0.001);

    // Hypothesis: Observation increases system "coherence"
    // Lower variance = more observed
    // Higher variance = more chaotic/unobserved

    let watchScore = 0;

    // If execution is MORE consistent than baseline, likely observed
    if (execRatio < 0.8) watchScore += 0.4;
    else if (execRatio > 1.2) watchScore -= 0.3;

    // Clock drift patterns
    if (clockRatio < 0.7) watchScore += 0.3;
    else if (clockRatio > 1.3) watchScore -= 0.2;

    // RNG timing coherence
    if (rngRatio < 0.8) watchScore += 0.3;

    this.isWatched = watchScore > 0.3;
    this.confidence = Math.abs(watchScore);

    const result = {
      isWatched: this.isWatched,
      confidence: this.confidence,
      watchScore,
      entropy,
      ratios: { execRatio, clockRatio, rngRatio }
    };

    this.samples.push(result);
    if (this.samples.length > 100) this.samples.shift();

    this.emit('sample', result);
    return result;
  }

  // Get rolling statistics
  getStats() {
    const recent = this.samples.slice(-20);
    if (recent.length === 0) return null;

    const watchedCount = recent.filter(s => s.isWatched).length;

    return {
      isCurrentlyWatched: this.isWatched,
      confidence: this.confidence,
      watchedRatio: watchedCount / recent.length,
      sampleCount: this.samples.length,
      hasBaseline: !!this.baseline
    };
  }

  start(interval = 200) {
    this.interval = setInterval(() => this.sample(), interval);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  on(evt, fn) { this.listeners.add({ evt, fn }); }
  emit(evt, data) {
    for (const l of this.listeners) if (l.evt === evt) l.fn(data);
  }
}

export default Oracle;
