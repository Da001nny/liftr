import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePort } from '../src/lib/serverConfig';

test('ServerConfig: --port 4000 with PORT=5000 gives 4000', () => {
  const argv = ['node', 'server.ts', '--port', '4000'];
  const env = { PORT: '5000' };
  assert.strictEqual(resolvePort(argv, env), 4000);
});

test('ServerConfig: PORT=5000 with no NODE_ENV and no --port gives 5000', () => {
  const argv = ['node', 'server.ts'];
  const env = { PORT: '5000' };
  assert.strictEqual(resolvePort(argv, env), 5000);
});

test('ServerConfig: nothing set gives 3000', () => {
  const argv = ['node', 'server.ts'];
  const env = {};
  assert.strictEqual(resolvePort(argv, env), 3000);
  assert.strictEqual(resolvePort([], {}), 3000);
});

test('ServerConfig: PORT="abc", PORT="0" and PORT="70000" give 3000', () => {
  assert.strictEqual(resolvePort([], { PORT: 'abc' }), 3000);
  assert.strictEqual(resolvePort([], { PORT: '0' }), 3000);
  assert.strictEqual(resolvePort([], { PORT: '70000' }), 3000);
  assert.strictEqual(resolvePort([], { PORT: '-1' }), 3000);
  assert.strictEqual(resolvePort([], { PORT: '3000.5' }), 3000);
});

test('ServerConfig: --port with no value, or "--port abc", falls through to PORT or 3000', () => {
  // --port with no value falls through to PORT
  assert.strictEqual(resolvePort(['node', 'server.ts', '--port'], { PORT: '5000' }), 5000);
  // --port with no value falls through to 3000
  assert.strictEqual(resolvePort(['node', 'server.ts', '--port'], {}), 3000);

  // --port abc falls through to PORT
  assert.strictEqual(resolvePort(['node', 'server.ts', '--port', 'abc'], { PORT: '5000' }), 5000);
  // --port abc falls through to 3000
  assert.strictEqual(resolvePort(['node', 'server.ts', '--port', 'abc'], {}), 3000);

  // --port 0 falls through to PORT or 3000
  assert.strictEqual(resolvePort(['node', 'server.ts', '--port', '0'], { PORT: '5555' }), 5555);
  assert.strictEqual(resolvePort(['node', 'server.ts', '--port', '70000'], {}), 3000);
});
