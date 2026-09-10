/**
 * Rule tests for 별밭 윷놀이.
 *
 * The game is one HTML file on purpose (it has to run as a Claude Artifact),
 * so there is nothing to import. This harness pulls the plain <script> blocks
 * out of game/index.html, checks each one compiles, and runs the three that
 * hold the rules — the yut model, the board graph and the turn logic — inside
 * a vm context with a stub for anything that touches the browser. The rule
 * functions themselves never touch the DOM, so they can be tested directly.
 *
 *   node tests/rules.test.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, '..', 'game', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// ---------------------------------------------------------------- test runner
let passed = 0;
const failures = [];
function test(name, fn){
  try { fn(); passed++; }
  catch (err){ failures.push({ name, err }); }
}

// ------------------------------------------------------------- script blocks
// only plain <script> blocks; the module bootstrap and the importmap are skipped
const blocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .filter(m => !/type\s*=\s*"(?:module|importmap)"/.test(m[0]))
  .map(m => m[1]);

test('every plain script block is syntactically valid', () => {
  assert.ok(blocks.length >= 5, 'expected at least 5 script blocks, got ' + blocks.length);
  blocks.forEach((code, i) => {
    try { new vm.Script(code, { filename: `block-${i}.js` }); }
    catch (err){ throw new Error(`block ${i} does not compile: ${err.message}`); }
  });
});

test('the module bootstrap is syntactically valid', () => {
  const mod = html.match(/<script\s+type="module">([\s\S]*?)<\/script>/);
  assert.ok(mod, 'no module block found');
  new vm.Script('(async () => {' + mod[1].replace(/^\s*import[^\n]*\n/gm, '') + '})()',
    { filename: 'bootstrap.js' });
});

function blockWith(marker){
  const found = blocks.find(b => b.includes(marker));
  assert.ok(found, 'no script block containing ' + JSON.stringify(marker));
  return found;
}

// ------------------------------------------------------------------- sandbox
// anything the browser would provide answers to everything and does nothing
const stub = new Proxy(function stubbed(){}, {
  get: (_t, key) => (key === Symbol.toPrimitive ? () => '' : stub),
  set: () => true,
  has: () => true,
  apply: () => stub,
  construct: () => stub,
});

const sandbox = {
  window: stub, document: stub, navigator: stub, location: stub,
  Audio: stub, AudioContext: stub, SpeechSynthesisUtterance: stub,
  speechSynthesis: stub, THREE: stub, board3d: stub, requestAnimationFrame: () => 0,
  setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  performance: { now: () => 0 },
  console: { log(){}, warn(){}, error(){}, table(){} },
  Math, JSON, Object, Array, String, Number, Boolean, Promise, Set, Map, Date, isFinite,
};
const context = vm.createContext(sandbox);

const EXPORTS = [
  'CATEGORY_INFO', 'classifySticks', 'rollYut', 'MARKED_STICK',
  'NODES', 'NODE_POS', 'NEXT', 'PREV', 'SHORTCUT_ENTRY', 'CORNER_IDS',
  'RING_N', 'FIELD_NAMES', 'JEOLGI', 'walkPath', 'nodeName',
  'state', 'PROGRESS', 'piecesAt', 'movableUnits', 'planMove', 'winnerOf',
  'pieceProgress', 'SPEECH_LINES', 'VOICE_TONE', 'LAUGHS',
];

const source = [
  blockWith('Yut throw model'),
  blockWith('Board graph'),
  blockWith('const VOICE_TONE'),        // voices and laughs live with the audio
  blockWith('Game state + turn flow'),
  `globalThis.__api = { ${EXPORTS.join(', ')} };`,
].join('\n;\n');

vm.runInContext(source, context, { filename: 'rules.js' });
const api = sandbox.__api;

// ------------------------------------------------------- 윷 던지기 (plan.md 4.2)
test('all 16 stick combinations give the traditional distribution', () => {
  const counts = {};
  for (let mask = 0; mask < 16; mask++){
    const sticks = [0,1,2,3].map(i => !!(mask & (1 << i)));
    const cat = api.classifySticks(sticks);
    counts[cat] = (counts[cat] || 0) + 1;
  }
  // 16 outcomes: 모 1 · 도 3 · 개 6 · 걸 4 · 윷 1 · 빽도 1
  assert.deepEqual(counts, { mo: 1, do: 3, gae: 6, geol: 4, yut: 1, backdo: 1 });
});

test('빽도 is the marked stick landing alone', () => {
  const onlyMarked = [0,1,2,3].map(i => i === api.MARKED_STICK);
  assert.equal(api.classifySticks(onlyMarked), 'backdo');
  const otherAlone = [0,1,2,3].map(i => i === (api.MARKED_STICK + 1) % 4);
  assert.equal(api.classifySticks(otherAlone), 'do');
});

test('each result moves the traditional number of 칸', () => {
  const steps = Object.fromEntries(
    Object.entries(api.CATEGORY_INFO).map(([k, v]) => [k, v.steps]));
  assert.deepEqual(steps, { backdo: -1, do: 1, gae: 2, geol: 3, yut: 4, mo: 5 });
  // only 윷 and 모 grant another throw
  const extra = Object.entries(api.CATEGORY_INFO)
    .filter(([, v]) => v.extraTurn).map(([k]) => k).sort();
  assert.deepEqual(extra, ['mo', 'yut']);
});

// ------------------------------------------------------- 말판 (plan.md 4.1)
test('the board is 29 밭', () => {
  const ids = Object.keys(api.NODES);
  assert.equal(ids.length, 29, 'expected 29 nodes');
  assert.equal(ids.filter(id => api.NODES[id].kind === 'arm').length, 8);
  assert.equal(ids.filter(id => api.NODES[id].kind === 'center').length, 1);
  assert.equal(ids.filter(id => /^o\d+$/.test(id)).length, api.RING_N);
  ids.forEach(id => assert.ok(api.NODES[id].name, id + ' has no name'));
});

test('the four corners are 참먹이 and the three 모 계열', () => {
  assert.deepEqual(api.CORNER_IDS, ['o0', 'o5', 'o10', 'o15']);
  assert.equal(api.NODES.o0.kind, 'gate');
  ['o5', 'o10', 'o15'].forEach(id => assert.equal(api.NODES[id].kind, 'corner'));
  assert.equal(api.nodeName('o5'), '모');
  assert.equal(api.nodeName('bang'), '방');
});

test('the 24 절기 sit on the 24 자리 that are not 방 or a corner', () => {
  const terms = Object.keys(api.JEOLGI);
  assert.equal(terms.length, 24);
  terms.forEach(id => {
    const node = api.NODES[id];
    assert.ok(node, id + ' is not a node');
    assert.ok(!['gate', 'corner', 'center'].includes(node.kind), id + ' is a corner or 방');
  });
  // six per 밭 — one season's worth each
  const perField = [0, 0, 0, 0];
  terms.forEach(id => perField[api.NODES[id].field]++);
  assert.deepEqual(perField, [6, 6, 6, 6]);
  // and every term name is distinct
  assert.equal(new Set(terms.map(id => api.JEOLGI[id].term)).size, 24);
});

test('the ring loops and every arm leads to 방', () => {
  for (let i = 0; i < api.RING_N; i++){
    assert.equal(api.NEXT['o' + i], 'o' + ((i + 1) % api.RING_N));
  }
  ['mo-2', 'dm-2', 'sok-2'].forEach(id => assert.equal(api.NEXT[id], 'bang'));
  // 방 always bends toward 참먹이 — that is what makes the short route work
  assert.equal(api.NEXT.bang, 'anjji');
  assert.equal(api.NEXT.anjji, 'saryeo');
  assert.equal(api.NEXT.saryeo, 'o0');
});

// ------------------------------------------------------- 이동 (plan.md 4.3)
test('walking the ring visits each 밭 in order', () => {
  assert.deepEqual(api.walkPath('o0', 5, false), ['o1', 'o2', 'o3', 'o4', 'o5']);
});

test('a corner can take the shortcut on the very next step only', () => {
  assert.deepEqual(api.walkPath('o5', 1, true), ['mo-1']);
  assert.deepEqual(api.walkPath('o5', 1, false), ['o6']);
  // the shortcut applies to the first hop, not later ones
  assert.deepEqual(api.walkPath('o5', 2, true), ['mo-1', 'mo-2']);
});

test('the shortest completion is 11 칸', () => {
  let at = 'o0', steps = 0;
  // 모 (5) → then straight through the middle
  let path = api.walkPath(at, 5, false);
  steps += 5; at = path[path.length - 1];
  assert.equal(at, 'o5');
  path = api.walkPath(at, 1, true);        // into the arm
  steps += 1; at = path[path.length - 1];
  assert.equal(at, 'mo-1');
  const rest = api.walkPath(at, 5, false); // 모개 · 방 · 안찌 · 사려 · 완주
  steps += 5;
  assert.deepEqual(rest, ['mo-2', 'bang', 'anjji', 'saryeo', 'FINISH']);
  assert.equal(steps, 11);
});

test('a path that reaches 참먹이 finishes instead of stepping onto it', () => {
  const path = api.walkPath('saryeo', 1, false);
  assert.deepEqual(path, ['FINISH']);
});

test('빽도 retraces the 밭 the piece actually came from', () => {
  // 방 has three possible predecessors, so the caller passes the real one
  assert.deepEqual(api.walkPath('bang', -1, false, 'dm-2'), ['dm-2']);
  assert.deepEqual(api.walkPath('bang', -1, false, 'mo-2'), ['mo-2']);
  // without that hint it falls back to the graph's own PREV
  assert.deepEqual(api.walkPath('o3', -1, false), ['o2']);
});

// ------------------------------------------- 업기 · 잡기 · 승리 (plan.md 4.4-4.6)
function setUpGame(pieces, players = 2){
  api.state.players = Array.from({ length: players }, (_, i) => ({ id: i, type: 'bot', name: 'P' + (i+1) }));
  api.state.pieces = pieces;
  api.state.currentPlayerIndex = 0;
  api.state.over = false;
}
const onboard = (owner, idx, nodeId) => ({ owner, idx, place: 'onboard', nodeId });
const waiting = (owner, idx) => ({ owner, idx, place: 'start', nodeId: null });
const home = (owner, idx) => ({ owner, idx, place: 'finished', nodeId: null });

test('own pieces sharing a 밭 count as one unit (업기)', () => {
  setUpGame([onboard(0, 0, 'o3'), onboard(0, 1, 'o3'), waiting(1, 0), waiting(1, 1)]);
  const units = api.movableUnits(0, 2);
  const onO3 = units.filter(u => u.from === 'o3');
  assert.equal(onO3.length, 1, 'the two pieces should be one unit, not two');
  assert.equal(onO3[0].members.length, 2);
});

test('an opponent on the same 밭 is not part of the unit', () => {
  setUpGame([onboard(0, 0, 'o3'), onboard(1, 0, 'o3'), waiting(0, 1), waiting(1, 1)]);
  const unit = api.movableUnits(0, 2).find(u => u.from === 'o3');
  assert.equal(unit.members.length, 1);
});

test('a waiting piece can only launch on a forward throw', () => {
  setUpGame([waiting(0, 0), waiting(0, 1), waiting(1, 0), waiting(1, 1)]);
  assert.equal(api.movableUnits(0, 3).length, 1, 'one launch option');
  assert.equal(api.movableUnits(0, -1).length, 0, '빽도 cannot launch a piece');
});

test('the move chooser prefers a capture over a plain advance', () => {
  // 0:0 can capture on o5 with 걸(3); 0:1 would just walk to o8
  setUpGame([onboard(0, 0, 'o2'), onboard(0, 1, 'o5'), onboard(1, 0, 'o5'), waiting(1, 1)]);
  const plan = api.planMove(0, 3, false);
  assert.equal(plan.unit.from, 'o2');
  assert.equal(plan.land, 'o5');
});

test('the move chooser prefers finishing over capturing', () => {
  // 0:0 finishes from 사려 with 도(1); 0:1 could capture on o4 instead
  setUpGame([onboard(0, 0, 'saryeo'), onboard(0, 1, 'o3'), onboard(1, 0, 'o4'), waiting(1, 1)]);
  const plan = api.planMove(0, 1, false);
  assert.equal(plan.land, 'FINISH');
});

test('nobody wins until every one of a player\'s pieces is home', () => {
  setUpGame([home(0, 0), onboard(0, 1, 'o9'), waiting(1, 0), waiting(1, 1)]);
  assert.equal(api.winnerOf(), -1);
  setUpGame([home(0, 0), home(0, 1), onboard(1, 0, 'o9'), waiting(1, 1)]);
  assert.equal(api.winnerOf(), 0);
});

test('the win check covers every player, not just two', () => {
  setUpGame([
    waiting(0, 0), waiting(0, 1),
    waiting(1, 0), waiting(1, 1),
    home(2, 0), home(2, 1),
    waiting(3, 0), waiting(3, 1),
  ], 4);
  assert.equal(api.winnerOf(), 2);
});

test('progress reads 0 at the bench and 1 at home', () => {
  assert.equal(api.pieceProgress(waiting(0, 0)), 0);
  assert.equal(api.pieceProgress(home(0, 0)), 1);
  const early = api.pieceProgress(onboard(0, 0, 'o2'));
  const late = api.pieceProgress(onboard(0, 0, 'o18'));
  assert.ok(early > 0 && early < late && late <= 1, `expected 0 < ${early} < ${late} <= 1`);
});

// -------------------------------------------------------------- cast integrity
test('all eight parts have their own lines, voice and laugh', () => {
  assert.equal(api.SPEECH_LINES.length, 8);
  assert.equal(api.VOICE_TONE.length, 8);
  assert.equal(api.LAUGHS.length, 8);
  const kinds = ['idle','turn','great','good','meh','bad','capture','caught','finish','together','win','lose'];
  api.SPEECH_LINES.forEach((persona, i) => {
    kinds.forEach(kind => {
      assert.ok(Array.isArray(persona[kind]) && persona[kind].length,
        `persona ${i} is missing ${kind} lines`);
    });
  });
  // no two characters share a turn line — that was the bug that started this
  const turns = api.SPEECH_LINES.map(p => p.turn.join('|'));
  assert.equal(new Set(turns).size, 8, 'two characters share the same turn lines');
});

// -------------------------------------------------------------------- report
const total = passed + failures.length;
if (failures.length){
  console.error(`\n${failures.length} of ${total} tests failed:\n`);
  failures.forEach(({ name, err }) => {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message.split('\n').join('\n    ')}\n`);
  });
  process.exit(1);
}
console.log(`✓ ${passed} rule tests passed`);
