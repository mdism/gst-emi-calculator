// Run from the repo root with: node --test
const test = require('node:test');
const assert = require('node:assert');
const { gst, emi, sip } = require('../public/assets/js/calc.js');

test('GST add: 1000 at 18%', () => {
  assert.deepStrictEqual(gst(1000, 18, 'add'), { base: 1000, tax: 180, half: 90, total: 1180 });
});

test('GST remove: 1180 incl. 18%', () => {
  const g = gst(1180, 18, 'remove');
  assert.strictEqual(g.base, 1000);
  assert.strictEqual(g.tax, 180);
});

test('EMI: 5 lakh at 9.5% for 5 years is about 10,501', () => {
  const e = emi(500000, 9.5, 5);
  assert.ok(Math.abs(e.emi - 10501) < 1, e.emi);
  assert.strictEqual(e.months, 60);
  assert.strictEqual(e.schedule.length, 5);
  assert.ok(e.schedule[4].balance < 1);
});

test('EMI at 0% splits evenly', () => {
  assert.strictEqual(emi(12000, 0, 1).emi, 1000);
});

test('SIP: 5000 a month at 12% for 10 years is about 11.6 lakh', () => {
  const s = sip(5000, 12, 10);
  assert.strictEqual(s.invested, 600000);
  assert.ok(Math.abs(s.value - 1161695) < 50, s.value);
});

test('SIP step-up raises the monthly amount each year', () => {
  const s = sip(1000, 0, 2, 10);
  assert.strictEqual(s.invested, 12000 + 13200);
});
