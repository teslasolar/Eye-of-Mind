/*
@udt file/1.0
uuid: eom-core-biometrics-001
version: 0.1.0
tokens: 250
path: /core/biometrics.js
parent: /core
deps: []
tags: [consciousness, core]
*/

// Behavioral Biometrics - Infer mental state from interaction patterns
export class BiometricCollector {
  constructor() {
    this.keystrokes = [];
    this.mouseMoves = [];
    this.scrolls = [];
    this.clicks = [];
    this.active = false;
  }

  start() {
    if (this.active) return;
    this.active = true;
    document.addEventListener('keydown', this.onKey);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouse);
    document.addEventListener('scroll', this.onScroll);
    document.addEventListener('click', this.onClick);
  }

  stop() {
    this.active = false;
    document.removeEventListener('keydown', this.onKey);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouse);
    document.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('click', this.onClick);
  }

  onKey = (e) => {
    this.keystrokes.push({ t: performance.now(), key: e.key, type: 'down' });
    if (this.keystrokes.length > 500) this.keystrokes.shift();
  }

  onKeyUp = (e) => {
    this.keystrokes.push({ t: performance.now(), key: e.key, type: 'up' });
  }

  onMouse = (e) => {
    const now = performance.now();
    const last = this.mouseMoves[this.mouseMoves.length - 1];
    if (last && now - last.t < 16) return; // Throttle to ~60fps
    this.mouseMoves.push({ t: now, x: e.clientX, y: e.clientY });
    if (this.mouseMoves.length > 500) this.mouseMoves.shift();
  }

  onScroll = () => {
    this.scrolls.push({ t: performance.now(), y: window.scrollY });
    if (this.scrolls.length > 100) this.scrolls.shift();
  }

  onClick = (e) => {
    this.clicks.push({ t: performance.now(), x: e.clientX, y: e.clientY });
    if (this.clicks.length > 100) this.clicks.shift();
  }

  // Typing rhythm analysis
  getTypingMetrics() {
    const downs = this.keystrokes.filter(k => k.type === 'down');
    if (downs.length < 5) return null;

    const intervals = [];
    for (let i = 1; i < downs.length; i++) {
      intervals.push(downs[i].t - downs[i-1].t);
    }

    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((s, x) => s + (x - mean) ** 2, 0) / intervals.length;
    const cv = Math.sqrt(variance) / mean; // Coefficient of variation

    return {
      meanInterval: mean,
      variance,
      rhythmStability: 1 / (1 + cv), // 0-1, higher = more stable rhythm
      speed: 1000 / mean // keys per second
    };
  }

  // Mouse movement analysis
  getMouseMetrics() {
    if (this.mouseMoves.length < 10) return null;

    const velocities = [];
    const angles = [];

    for (let i = 1; i < this.mouseMoves.length; i++) {
      const prev = this.mouseMoves[i - 1];
      const curr = this.mouseMoves[i];
      const dt = curr.t - prev.t;
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      velocities.push(dist / dt);
      angles.push(Math.atan2(dy, dx));
    }

    const meanVel = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const velVar = velocities.reduce((s, v) => s + (v - meanVel) ** 2, 0) / velocities.length;

    // Angular entropy - how random is movement direction?
    const angleBins = new Array(8).fill(0);
    angles.forEach(a => {
      const bin = Math.floor(((a + Math.PI) / (2 * Math.PI)) * 8) % 8;
      angleBins[bin]++;
    });
    const total = angles.length;
    const entropy = -angleBins.reduce((s, c) => {
      const p = c / total;
      return p > 0 ? s + p * Math.log2(p) : s;
    }, 0) / 3; // Normalize to 0-1

    return {
      meanVelocity: meanVel,
      velocityVariance: velVar,
      directionalEntropy: entropy, // High = erratic, Low = focused
      smoothness: 1 / (1 + velVar / 100)
    };
  }
}

export default BiometricCollector;
