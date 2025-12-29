/*
@udt file/1.0
uuid: eom-tests-runner-001
version: 0.1.0
tokens: 200
path: /tests/runner.js
parent: /tests
deps: []
tags: [core, runner]
*/

// Minimal Test Runner for Eye-of-Mind
export class TestRunner {
  constructor() {
    this.tests = [];
    this.results = { pass: 0, fail: 0, errors: [] };
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running tests...\n');

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        this.results.pass++;
        console.log(`✓ ${name}`);
      } catch (e) {
        this.results.fail++;
        this.results.errors.push({ name, error: e.message });
        console.log(`✗ ${name}: ${e.message}`);
      }
    }

    console.log(`\n${this.results.pass} passed, ${this.results.fail} failed`);
    return this.results;
  }

  static assert(cond, msg = 'Assertion failed') {
    if (!cond) throw new Error(msg);
  }

  static assertEqual(a, b, msg) {
    if (a !== b) throw new Error(msg || `Expected ${b}, got ${a}`);
  }

  static assertApprox(a, b, epsilon = 0.01, msg) {
    if (Math.abs(a - b) > epsilon) {
      throw new Error(msg || `Expected ~${b}, got ${a}`);
    }
  }
}

export const { assert, assertEqual, assertApprox } = TestRunner;
export default TestRunner;
