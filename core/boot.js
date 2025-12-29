/*
@udt file/1.0
uuid: eom-core-boot-a1b2c3d4
version: 0.1.0
tokens: 150
path: /core/boot.js
parent: /core
deps: [kappa.js, md-runner.js]
tags: [core]
*/

import { KappaEngine } from './kappa.js';
import { MDRunner } from './md-runner.js';

// Eye of Mind Boot Sequence
const EOM = {
  kappa: new KappaEngine(),
  runner: new MDRunner(),

  async init() {
    console.log('[EOM] Initializing κ=' + this.kappa.kappa.toFixed(6));

    // Update display
    const el = document.getElementById('kappa');
    const status = document.getElementById('status');

    if (el) {
      this.kappa.on('update', k => {
        el.textContent = k.toFixed(6);
      });
      setInterval(() => this.kappa.step(), 100);
    }

    if (status) {
      status.textContent = 'κ converging to ' + this.kappa.optimal.toFixed(6);
    }

    console.log('[EOM] Ready');
    return this;
  }
};

window.EOM = EOM;
EOM.init();

export default EOM;
