const assert = require('assert');
const S = require('../sync.js');

const empty = S.normalize({});
const some = { checks: { '0:o0': true }, done: {}, answers: {}, custom: {} };
const t0 = '2026-11-25T10:00:00Z', t1 = '2026-11-25T11:00:00Z';

// nada na nuvem
assert.strictEqual(S.decide({}, null, empty), 'none');
assert.strictEqual(S.decide({}, null, some), 'push');
assert.strictEqual(S.decide({ dirty: true }, null, empty), 'push');
// primeiro login neste computador
assert.strictEqual(S.decide({}, { updated_at: t0, data: some }, empty), 'pull');
assert.strictEqual(S.decide({}, { updated_at: t0, data: some }, some), 'conflict');
// já sincronizado antes
assert.strictEqual(S.decide({ synced: t0, dirty: false }, { updated_at: t0 }, some), 'none');
assert.strictEqual(S.decide({ synced: t0, dirty: true }, { updated_at: t0 }, some), 'push');
assert.strictEqual(S.decide({ synced: t0, dirty: false }, { updated_at: t1 }, some), 'pull');
assert.strictEqual(S.decide({ synced: t0, dirty: true }, { updated_at: t1 }, some), 'conflict');

// isEmpty
assert.ok(S.isEmpty({}));
assert.ok(S.isEmpty({ answers: { '0:g0': '   ' } }));
assert.ok(!S.isEmpty({ answers: { '0:g0': 'oi' } }));
assert.ok(!S.isEmpty({ custom: { 0: [{ q: 'x', a: '' }] } }));

// merge
const a = { checks: { '1:o0': true }, done: { 1: true }, answers: { '1:g0': 'minha A', '1:g1': 'só aqui' }, custom: { 1: [{ q: 'Pergunta X', a: '' }] } };
const b = { checks: { '1:o1': true }, done: {}, answers: { '1:g0': 'minha B', '1:g2': 'só lá' }, custom: { 1: [{ q: 'pergunta x', a: 'resp' }, { q: 'Outra', a: '' }] } };
const m = S.merge(a, b);
assert.deepStrictEqual(m.checks, { '1:o0': true, '1:o1': true });
assert.deepStrictEqual(m.done, { 1: true });
assert.ok(m.answers['1:g0'].includes('minha A') && m.answers['1:g0'].includes('minha B'));
assert.strictEqual(m.answers['1:g1'], 'só aqui');
assert.strictEqual(m.answers['1:g2'], 'só lá');
assert.strictEqual(m.custom[1].length, 2);
assert.strictEqual(m.custom[1][0].a, 'resp');
// merge com o mesmo conteúdo não duplica
const same = S.merge(a, a);
assert.strictEqual(same.answers['1:g0'], 'minha A');
assert.strictEqual(same.custom[1].length, 1);
// normalize tolera lixo
assert.deepStrictEqual(S.normalize(null), empty);
assert.deepStrictEqual(S.normalize({ checks: 'x' }).checks, {});
console.log('sync.test.js: todos os testes passaram');
