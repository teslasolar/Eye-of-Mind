/*
@udt file/1.0
uuid: eom-core-intention-001
version: 0.1.0
tokens: 200
path: /core/intention.js
parent: /core
deps: [kappa.js, gaze.js]
tags: [consciousness, core]
*/

import { KappaEngine } from './kappa.js';
import { GazeTracker } from './gaze.js';

// Intention Inference - Combine gaze and kappa for screen-thought
export class IntentionEngine {
  constructor(opts = {}) {
    this.kappa = opts.kappa || new KappaEngine();
    this.gaze = opts.gaze || new GazeTracker();
    this.targets = new Map();
    this.currentIntent = null;
    this.confidence = 0;
  }

  registerTarget(id, element, action) {
    const rect = element.getBoundingClientRect();
    this.targets.set(id, { element, action, rect, activation: 0 });
    this.gaze.registerRegion(id, rect, () => this.onDwell(id));
  }

  start() {
    this.gaze.start();
    setInterval(() => this.update(), 100);
  }

  update() {
    this.kappa.step(0.05);
    const focus = this.gaze.getFocus();

    if (!focus) return;

    // Update target activations based on gaze stability and kappa
    for (const [id, target] of this.targets) {
      const rect = target.rect;
      const inRegion = focus.x >= rect.left && focus.x <= rect.right &&
                       focus.y >= rect.top && focus.y <= rect.bottom;

      if (inRegion) {
        // Activation increases with focus stability and kappa near optimal
        const kappaBoost = 1 - Math.abs(this.kappa.kappa - 0.618) * 2;
        target.activation = Math.min(1, target.activation + 0.1 * focus.stability * kappaBoost);
      } else {
        target.activation = Math.max(0, target.activation - 0.05);
      }

      // Trigger action at high activation
      if (target.activation > 0.9) {
        this.trigger(id);
        target.activation = 0;
      }
    }
  }

  onDwell(id) {
    const target = this.targets.get(id);
    if (target) {
      target.activation = Math.min(1, target.activation + 0.2);
    }
  }

  trigger(id) {
    const target = this.targets.get(id);
    if (target?.action) {
      this.currentIntent = id;
      this.confidence = this.kappa.kappa;
      target.action({ id, kappa: this.kappa.kappa, confidence: this.confidence });
    }
  }

  getState() {
    return {
      kappa: this.kappa.kappa,
      kappaState: this.kappa.state,
      gaze: this.gaze.getFocus(),
      targets: Array.from(this.targets.entries()).map(([id, t]) => ({ id, activation: t.activation })),
      currentIntent: this.currentIntent,
      confidence: this.confidence
    };
  }
}

export default IntentionEngine;
