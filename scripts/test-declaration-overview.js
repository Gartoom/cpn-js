// Run with Node 14 and the frontend's TypeScript dependency installed.
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const ts = require('typescript');
const source = fs.readFileSync((process.env.CPN_FRONTEND_ROOT || 'cpn-ide-front') + '/src/app/ml-editor/declaration-overview.ts', 'utf8');
const scope = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, scope);
const overview = scope.exports.declarationOverview;
const fixture = { block: [{ id: 'Outer', ml: [{ code: 'fun first () = "<x>";' }], block: {
  id: 'Inner *) (*', color: { code: 'colset ITEMS = list INT;' }, block: {
    id: 'Deep', block: { id: 'Deeper', var: { code: 'var x : INT;' } }
  }
}, globref: { code: 'globref count = 0;' } }, { id: 'Last', ml: { code: 'val last = 42;' } }] };
const original = JSON.stringify(fixture);
const output = overview(fixture, (_, node) => node.code);
['fun first', 'colset ITEMS', 'var x', 'globref count', 'val last'].forEach(code => assert(output.includes(code), code));
assert(output.indexOf('fun first') < output.indexOf('colset ITEMS'));
assert(output.indexOf('colset ITEMS') < output.indexOf('globref count'));
assert(output.includes('Inner * ) ( *'));
assert.strictEqual(JSON.stringify(fixture), original, 'The combined view must not mutate model data');
assert.strictEqual(overview(undefined, () => { throw Error('Unexpected formatter'); }), '');
assert.strictEqual(overview({}, () => ''), '');
console.log('PASS: nested declarations, ordering, literal code, safe headings and no model mutation');
