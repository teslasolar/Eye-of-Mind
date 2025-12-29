/*
@udt file/1.0
uuid: eom-tests-mdrun-001
version: 0.1.0
tokens: 150
path: /tests/md-runner.test.js
parent: /tests
deps: [runner.js, ../core/md-runner.js]
tags: [runner, core]
*/

import { TestRunner, assert, assertEqual } from './runner.js';
import { MDRunner } from '../core/md-runner.js';

const t = new TestRunner();

t.test('MDRunner parses code blocks', () => {
  const runner = new MDRunner();
  const { blocks } = runner.parse(`
# Test
\`\`\`javascript
const x = 1;
\`\`\`
  `);
  assert(blocks.length === 1, 'Should find 1 block');
  assertEqual(blocks[0].lang, 'javascript');
});

t.test('MDRunner parses block metadata', () => {
  const runner = new MDRunner();
  const { blocks } = runner.parse(`
\`\`\`javascript {"run": true}
console.log('hi');
\`\`\`
  `);
  assert(blocks[0].meta.run === true, 'Should parse meta');
});

t.test('MDRunner executes JS blocks', async () => {
  const runner = new MDRunner({ context: { result: null } });
  const result = await runner.run({
    lang: 'javascript',
    meta: {},
    code: 'ctx.result = 42; return ctx.result;'
  });
  assertEqual(result, 42);
});

t.test('MDRunner skips non-JS blocks', async () => {
  const runner = new MDRunner();
  const result = await runner.run({ lang: 'python', meta: {}, code: 'x = 1' });
  assert(result.skip === true, 'Should skip');
});

export default t;
