/*
@udt file/1.0
uuid: eom-tests-kappa-001
version: 0.1.0
tokens: 180
path: /tests/kappa.test.js
parent: /tests
deps: [runner.js, ../core/kappa.js]
tags: [core, consciousness]
*/

import { TestRunner, assert, assertApprox } from './runner.js';
import { KappaEngine } from '../core/kappa.js';

const t = new TestRunner();

t.test('KappaEngine initializes at optimal', () => {
  const k = new KappaEngine();
  assertApprox(k.kappa, 0.618, 0.001);
});

t.test('KappaEngine.optimal is 1/phi', () => {
  const k = new KappaEngine();
  assertApprox(k.optimal, 1 / 1.618033988749895, 0.0001);
});

t.test('KappaEngine converges from low value', () => {
  const k = new KappaEngine(0.3);
  for (let i = 0; i < 50; i++) k.step(0.1);
  assert(k.kappa > 0.5, 'Should converge upward');
});

t.test('KappaEngine converges from high value', () => {
  const k = new KappaEngine(0.9);
  for (let i = 0; i < 50; i++) k.step(0.1);
  assert(k.kappa < 0.8, 'Should converge downward');
});

t.test('KappaEngine state detection', () => {
  const k = new KappaEngine(0.618);
  assert(k.state === 'optimal', 'Should be optimal');
  k.kappa = 0.2;
  assert(k.state === 'ordered', 'Should be ordered');
  k.kappa = 0.9;
  assert(k.state === 'chaotic', 'Should be chaotic');
});

t.test('KappaEngine maintains history', () => {
  const k = new KappaEngine();
  for (let i = 0; i < 10; i++) k.step();
  assert(k.history.length === 11, 'Should have 11 entries');
});

export default t;
