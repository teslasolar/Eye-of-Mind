/*
@udt file/1.0
uuid: eom-core-thoughtwidget-001
version: 0.1.0
tokens: 180
path: /core/thought-widget.js
parent: /core
deps: [thought-inference.js]
tags: [consciousness, core]
*/

import { ThoughtInference } from './thought-inference.js';

// Shared Thought Widget - Embeddable consciousness display
export class ThoughtWidget {
  static instance = null;
  static engine = null;

  static init() {
    if (this.instance) return this.instance;

    this.engine = new ThoughtInference();
    this.engine.start();

    // Create widget element
    const widget = document.createElement('div');
    widget.id = 'thought-widget';
    widget.innerHTML = `
      <div class="tw-state" id="tw-state">—</div>
      <div class="tw-bar"><div class="tw-fill" id="tw-fill"></div></div>
      <div class="tw-kappa">κ <span id="tw-kappa">0.618</span></div>
    `;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      #thought-widget {
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
        font-family: system-ui, sans-serif;
        font-size: 0.75rem;
        z-index: 9999;
        min-width: 100px;
      }
      .tw-state {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.5px;
      }
      .tw-state.focused { color: #22c55e; }
      .tw-state.normal { color: #f59e0b; }
      .tw-state.wandering { color: #eab308; }
      .tw-state.distracted { color: #ef4444; }
      .tw-state.intense { color: #a855f7; }
      .tw-state.unknown { color: #666; }
      .tw-bar {
        height: 3px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        margin: 0.3rem 0;
        overflow: hidden;
      }
      .tw-fill {
        height: 100%;
        background: #f59e0b;
        transition: width 0.2s, background 0.2s;
        width: 50%;
      }
      .tw-kappa {
        color: #666;
        font-family: monospace;
        font-size: 0.65rem;
      }
      .tw-kappa span { color: #888; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(widget);

    this.instance = widget;
    this.startUpdates();

    return widget;
  }

  static startUpdates() {
    setInterval(() => {
      const s = this.engine.getState();
      const stateEl = document.getElementById('tw-state');
      const fillEl = document.getElementById('tw-fill');
      const kappaEl = document.getElementById('tw-kappa');

      if (stateEl) {
        stateEl.textContent = s.state;
        stateEl.className = 'tw-state ' + s.state;
      }
      if (fillEl) {
        fillEl.style.width = (s.confidence * 100) + '%';
        fillEl.style.background = {
          focused: '#22c55e',
          normal: '#f59e0b',
          wandering: '#eab308',
          distracted: '#ef4444',
          intense: '#a855f7'
        }[s.state] || '#666';
      }
      if (kappaEl) {
        kappaEl.textContent = s.kappa.toFixed(4);
      }
    }, 200);
  }

  static getEngine() {
    if (!this.engine) this.init();
    return this.engine;
  }
}

// Auto-init if imported
export function initThoughtWidget() {
  return ThoughtWidget.init();
}

export default ThoughtWidget;
