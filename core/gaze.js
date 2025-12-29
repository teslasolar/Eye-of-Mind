/*
@udt file/1.0
uuid: eom-core-gaze-001
version: 0.1.0
tokens: 220
path: /core/gaze.js
parent: /core
deps: [kappa.js]
tags: [consciousness, core]
*/

// Gaze/Attention Tracker - Mouse-based attention simulation
export class GazeTracker {
  constructor(opts = {}) {
    this.x = 0;
    this.y = 0;
    this.history = [];
    this.maxHistory = opts.maxHistory || 100;
    this.dwellThreshold = opts.dwellThreshold || 500; // ms
    this.listeners = new Set();
    this.regions = new Map();
    this.active = false;
  }

  start() {
    if (this.active) return;
    this.active = true;
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('touchmove', this.onTouch);
  }

  stop() {
    this.active = false;
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('touchmove', this.onTouch);
  }

  onMove = (e) => {
    this.update(e.clientX, e.clientY);
  }

  onTouch = (e) => {
    const t = e.touches[0];
    this.update(t.clientX, t.clientY);
  }

  update(x, y) {
    this.x = x;
    this.y = y;
    this.history.push({ x, y, t: Date.now() });
    if (this.history.length > this.maxHistory) this.history.shift();

    this.emit('move', { x, y });
    this.checkRegions();
    this.checkDwell();
  }

  registerRegion(id, rect, callback) {
    this.regions.set(id, { rect, callback, enterTime: null });
  }

  checkRegions() {
    for (const [id, r] of this.regions) {
      const inside = this.x >= r.rect.left && this.x <= r.rect.right &&
                     this.y >= r.rect.top && this.y <= r.rect.bottom;

      if (inside && !r.enterTime) {
        r.enterTime = Date.now();
        this.emit('enter', { id, x: this.x, y: this.y });
      } else if (!inside && r.enterTime) {
        const duration = Date.now() - r.enterTime;
        r.enterTime = null;
        this.emit('leave', { id, duration });
      }
    }
  }

  checkDwell() {
    for (const [id, r] of this.regions) {
      if (r.enterTime && Date.now() - r.enterTime > this.dwellThreshold) {
        r.callback?.({ id, duration: Date.now() - r.enterTime });
        r.enterTime = Date.now(); // Reset to avoid repeated triggers
        this.emit('dwell', { id, x: this.x, y: this.y });
      }
    }
  }

  getFocus() {
    if (this.history.length < 10) return null;
    const recent = this.history.slice(-10);
    const avgX = recent.reduce((s, p) => s + p.x, 0) / 10;
    const avgY = recent.reduce((s, p) => s + p.y, 0) / 10;
    const variance = recent.reduce((s, p) => s + (p.x - avgX) ** 2 + (p.y - avgY) ** 2, 0) / 10;
    return { x: avgX, y: avgY, stability: 1 / (1 + variance / 1000) };
  }

  on(evt, fn) { this.listeners.add({ evt, fn }); }
  emit(evt, data) {
    for (const l of this.listeners) if (l.evt === evt) l.fn(data);
  }
}

export default GazeTracker;
