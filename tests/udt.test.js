/*
@udt file/1.0
uuid: eom-tests-udt-001
version: 0.1.0
tokens: 180
path: /tests/udt.test.js
parent: /tests
deps: [runner.js, ../core/udt-parser.js]
tags: [udt, core]
*/

import { TestRunner, assert, assertEqual } from './runner.js';
import { UDTParser } from '../core/udt-parser.js';

const t = new TestRunner();

t.test('UDTParser parses HTML comment headers', () => {
  const content = `<!--
@udt file/1.0
uuid: eom-test-001
version: 0.1.0
tokens: 100
path: /test.html
parent: /
deps: [a.js, b.js]
tags: [core]
-->
<html></html>`;

  const udt = UDTParser.parse(content, 'test.html');
  assert(udt !== null, 'Should parse');
  assertEqual(udt.uuid, 'eom-test-001');
  assertEqual(udt.version, '0.1.0');
  assert(Array.isArray(udt.deps), 'deps should be array');
});

t.test('UDTParser parses JS comment headers', () => {
  const content = `/*
@udt file/1.0
uuid: eom-test-002
version: 0.1.0
*/
const x = 1;`;

  const udt = UDTParser.parse(content, 'test.js');
  assert(udt !== null, 'Should parse');
  assertEqual(udt.uuid, 'eom-test-002');
});

t.test('UDTParser.generateUUID creates valid UUID', () => {
  const uuid = UDTParser.generateUUID();
  assert(uuid.startsWith('eom-'), 'Should start with eom-');
  assert(uuid.length > 10, 'Should be reasonable length');
});

t.test('UDTParser.countTokens approximates correctly', () => {
  const tokens = UDTParser.countTokens('hello world test');
  assert(tokens > 0 && tokens < 10, 'Should be reasonable');
});

export default t;
