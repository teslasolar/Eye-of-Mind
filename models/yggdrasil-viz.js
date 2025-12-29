/*
@udt file/1.0
uuid: eom-models-yggviz-001
version: 0.1.0
tokens: 220
path: /models/yggdrasil-viz.js
parent: /models
deps: [yggdrasil.js]
tags: [model, consciousness]
*/

import { Yggdrasil, YggNode } from './yggdrasil.js';

// Yggdrasil Tree Visualization
export class YggViz {
  constructor(canvas, tree) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tree = tree || new Yggdrasil();
    this.width = canvas.width;
    this.height = canvas.height;
    this.colors = {
      branch: '#8b5cf6',
      node: '#f59e0b',
      fruit: '#22c55e',
      bg: '#0f0f23'
    };
  }

  layout(node = this.tree.root, x = this.width / 2, y = this.height - 40, angle = -Math.PI / 2, depth = 0) {
    node.x = x;
    node.y = y;

    const len = Math.max(20, 60 - depth * 10);
    const spread = Math.PI / (3 + depth);

    node.β.forEach((child, i) => {
      const offset = (i - (node.β.length - 1) / 2) * spread;
      const childAngle = angle + offset;
      const cx = x + Math.cos(childAngle) * len;
      const cy = y + Math.sin(childAngle) * len;
      this.layout(child, cx, cy, childAngle, depth + 1);
    });
  }

  draw(node = this.tree.root) {
    const { ctx } = this;

    // Draw branches first
    node.β.forEach(child => {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(child.x, child.y);
      ctx.strokeStyle = this.colors.branch;
      ctx.lineWidth = Math.max(1, 4 - child.id.split('.').length);
      ctx.stroke();
      this.draw(child);
    });

    // Draw node
    const radius = 4 + node.₹ / 30;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    const hue = 30 + (node.κ - 0.5) * 60; // orange-ish based on kappa
    ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
    ctx.fill();

    // Draw fruits
    node.ƒ.forEach((f, i) => {
      const fx = node.x + Math.cos(i * 0.8) * (radius + 6);
      const fy = node.y + Math.sin(i * 0.8) * (radius + 6);
      ctx.beginPath();
      ctx.arc(fx, fy, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.colors.fruit;
      ctx.fill();
    });
  }

  render() {
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.layout();
    this.draw();
  }

  start(fps = 2) {
    setInterval(() => { this.tree.grow(); this.render(); }, 1000 / fps);
    this.render();
  }
}

export default YggViz;
