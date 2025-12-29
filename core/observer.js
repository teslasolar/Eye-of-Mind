/*
@udt file/1.0
uuid: eom-core-observer-001
version: 0.1.0
tokens: 250
path: /core/observer.js
parent: /core
deps: [rng-detector.js]
tags: [consciousness, core]
*/

import { RNGDetector } from './rng-detector.js';

// Observer Detection - Detect if the system is being watched
// Based on browser behaviors that change when observed vs unobserved
export class ObserverDetector {
  constructor() {
    this.rng = new RNGDetector();
    this.isObserved = true;
    this.observationHistory = [];
    this.frameTimings = [];
    this.lastFrame = 0;
    this.listeners = new Set();
  }

  start() {
    // 1. Page Visibility API - direct observation detection
    document.addEventListener('visibilitychange', () => {
      this.isObserved = !document.hidden;
      this.emit('visibility', this.isObserved);
    });

    // 2. Window focus/blur
    window.addEventListener('focus', () => this.onFocus(true));
    window.addEventListener('blur', () => this.onFocus(false));

    // 3. Animation frame timing analysis
    this.measureFrameRate();

    // 4. Start RNG sampling
    this.rng.calibrate(50);
    setInterval(() => this.sample(), 100);
  }

  onFocus(focused) {
    this.isObserved = focused;
    this.emit('focus', focused);
  }

  measureFrameRate() {
    const measure = (now) => {
      if (this.lastFrame) {
        const delta = now - this.lastFrame;
        this.frameTimings.push(delta);
        if (this.frameTimings.length > 60) this.frameTimings.shift();
      }
      this.lastFrame = now;
      requestAnimationFrame(measure);
    };
    requestAnimationFrame(measure);
  }

  // Frame rate reveals observation - browsers throttle background tabs
  getFrameAnalysis() {
    if (this.frameTimings.length < 10) return null;

    const recent = this.frameTimings.slice(-10);
    const avgDelta = recent.reduce((a, b) => a + b, 0) / recent.length;
    const fps = 1000 / avgDelta;

    // Active observation: ~60fps, Background: ~1-10fps
    const observationScore = Math.min(1, fps / 60);

    return {
      fps,
      avgDelta,
      observationScore,
      isActivelyObserved: fps > 30
    };
  }

  sample() {
    const rngSample = this.rng.sample();
    const frameAnalysis = this.getFrameAnalysis();

    const observation = {
      t: Date.now(),
      visible: !document.hidden,
      focused: document.hasFocus(),
      fps: frameAnalysis?.fps || 0,
      observationScore: frameAnalysis?.observationScore || 0,
      rngDeviation: Math.abs(rngSample.deviation),
      isObserved: this.computeObservation(frameAnalysis, rngSample)
    };

    this.observationHistory.push(observation);
    if (this.observationHistory.length > 100) this.observationHistory.shift();

    this.emit('sample', observation);
    return observation;
  }

  computeObservation(frame, rng) {
    // Combine signals to determine if truly observed
    let score = 0;

    if (!document.hidden) score += 0.3;
    if (document.hasFocus()) score += 0.3;
    if (frame && frame.fps > 30) score += 0.2;
    if (rng && Math.abs(rng.deviation) > 1) score += 0.2; // RNG deviation suggests consciousness

    return score > 0.5;
  }

  // Get recent observation statistics
  getStats() {
    const recent = this.observationHistory.slice(-20);
    if (recent.length === 0) return null;

    const avgScore = recent.reduce((s, o) => s + o.observationScore, 0) / recent.length;
    const avgRNG = recent.reduce((s, o) => s + o.rngDeviation, 0) / recent.length;
    const observedRatio = recent.filter(o => o.isObserved).length / recent.length;

    return {
      avgObservationScore: avgScore,
      avgRNGDeviation: avgRNG,
      observedRatio,
      isCurrentlyObserved: this.isObserved,
      coherenceDetected: avgRNG > 1.5
    };
  }

  on(evt, fn) { this.listeners.add({ evt, fn }); }
  emit(evt, data) {
    for (const l of this.listeners) if (l.evt === evt) l.fn(data);
  }
}

export default ObserverDetector;
