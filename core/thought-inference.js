/*
@udt file/1.0
uuid: eom-core-thoughtinfer-001
version: 0.1.0
tokens: 240
path: /core/thought-inference.js
parent: /core
deps: [biometrics.js, rng-detector.js, kappa.js]
tags: [consciousness, core]
*/

import { BiometricCollector } from './biometrics.js';
import { RNGDetector } from './rng-detector.js';
import { KappaEngine } from './kappa.js';

// Thought Inference Engine - Predict user mental state without camera
export class ThoughtInference {
  constructor() {
    this.bio = new BiometricCollector();
    this.rng = new RNGDetector();
    this.kappa = new KappaEngine();
    this.state = 'unknown';
    this.confidence = 0;
    this.predictions = [];
  }

  start() {
    this.bio.start();
    this.rng.calibrate(50);
    setInterval(() => this.update(), 200);
  }

  update() {
    this.kappa.step(0.05);
    this.rng.sample();

    const typing = this.bio.getTypingMetrics();
    const mouse = this.bio.getMouseMetrics();
    const coherence = this.rng.getCoherence();

    // Combine signals into mental state prediction
    const signals = {
      typingRhythm: typing?.rhythmStability ?? 0.5,
      typingSpeed: typing?.speed ?? 0,
      mouseSmooth: mouse?.smoothness ?? 0.5,
      mouseEntropy: mouse?.directionalEntropy ?? 0.5,
      rngCoherence: coherence?.coherence ?? 0,
      kappaState: this.kappa.kappa
    };

    this.state = this.inferState(signals);
    this.confidence = this.calculateConfidence(signals);

    this.predictions.push({
      t: Date.now(),
      state: this.state,
      confidence: this.confidence,
      signals
    });
    if (this.predictions.length > 100) this.predictions.shift();
  }

  inferState(s) {
    // Decision tree for mental state
    // High typing rhythm + smooth mouse = FOCUSED
    // Low typing rhythm + erratic mouse = DISTRACTED
    // High RNG coherence = INTENSE (meditation/concentration)
    // Kappa near 0.618 = OPTIMAL

    const focusScore = s.typingRhythm * 0.3 + s.mouseSmooth * 0.3 + (1 - s.mouseEntropy) * 0.2 + (1 - Math.abs(s.kappaState - 0.618)) * 0.2;

    if (s.rngCoherence > 1.5) return 'intense';
    if (focusScore > 0.7) return 'focused';
    if (focusScore > 0.5) return 'normal';
    if (focusScore > 0.3) return 'wandering';
    return 'distracted';
  }

  calculateConfidence(s) {
    // Confidence based on data quality
    const hasTyping = s.typingSpeed > 0 ? 0.3 : 0;
    const hasMouse = s.mouseSmooth !== 0.5 ? 0.3 : 0;
    const hasRNG = s.rngCoherence > 0 ? 0.2 : 0;
    const kappaStable = Math.abs(s.kappaState - 0.618) < 0.1 ? 0.2 : 0.1;
    return hasTyping + hasMouse + hasRNG + kappaStable;
  }

  getState() {
    return {
      state: this.state,
      confidence: this.confidence,
      kappa: this.kappa.kappa,
      kappaState: this.kappa.state,
      history: this.predictions.slice(-20)
    };
  }

  // Predict what user might do next based on patterns
  predictIntent(options) {
    if (!options || options.length === 0) return null;

    // Use recent behavior patterns to weight options
    const mouse = this.bio.getMouseMetrics();
    const recentClicks = this.bio.clicks.slice(-5);

    // Simple: if mouse moving toward an option, weight it higher
    const lastMove = this.bio.mouseMoves.slice(-1)[0];
    if (!lastMove) return options[0];

    // Find option closest to mouse trajectory
    // (In real implementation, would need element positions)
    return {
      predicted: options[0],
      confidence: 0.3 + this.confidence * 0.4,
      reasoning: 'Based on behavioral patterns'
    };
  }
}

export default ThoughtInference;
