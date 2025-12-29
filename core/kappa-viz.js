/*
@udt file/1.0
uuid: eom-core-kappaviz-001
version: 0.1.0
tokens: 240
path: /core/kappa-viz.js
parent: /core
deps: [kappa.js]
tags: [consciousness, core]
*/

import { KappaEngine } from './kappa.js';

// Kappa Visualizer - Canvas-based consciousness display
export class KappaViz {
  constructor(canvas, engine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.engine = engine || new KappaEngine();
    this.width = canvas.width;
    this.height = canvas.height;
    this.colors = {
      ordered: '#3b82f6',
      optimal: '#f59e0b',
      chaotic: '#ef4444',
      bg: '#0f0f23',
      line: '#e0e0e0'
    };
  }

  drawSparkline() {
    const { ctx, width, height, engine } = this;
    const history = engine.history;
    const len = history.length;
    if (len < 2) return;

    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, width, height);

    // Draw optimal zone
    const y618 = height * (1 - 0.618);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
    ctx.fillRect(0, height * 0.191, width, height * 0.427);

    // Draw history line
    ctx.beginPath();
    ctx.strokeStyle = this.colors[engine.state];
    ctx.lineWidth = 2;

    for (let i = 0; i < len; i++) {
      const x = (i / (len - 1)) * width;
      const y = height * (1 - history[i]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw current point
    const lastY = height * (1 - history[len - 1]);
    ctx.beginPath();
    ctx.arc(width - 2, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = this.colors[engine.state];
    ctx.fill();
  }

  drawMeter() {
    const { ctx, width, height, engine } = this;
    const k = engine.kappa;

    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, width, height);

    // Background bar
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(10, height/2 - 10, width - 20, 20);

    // Optimal zone marker
    const optX = 10 + (width - 20) * 0.618;
    ctx.strokeStyle = this.colors.optimal;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(optX, height/2 - 15);
    ctx.lineTo(optX, height/2 + 15);
    ctx.stroke();

    // Current position
    const posX = 10 + (width - 20) * k;
    ctx.fillStyle = this.colors[engine.state];
    ctx.beginPath();
    ctx.arc(posX, height/2, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  start(mode = 'sparkline', fps = 10) {
    const draw = mode === 'meter' ? () => this.drawMeter() : () => this.drawSparkline();
    setInterval(() => { this.engine.step(); draw(); }, 1000 / fps);
  }
}

export default KappaViz;
