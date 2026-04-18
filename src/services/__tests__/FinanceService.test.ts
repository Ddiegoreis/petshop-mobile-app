import { strict as assert } from 'node:assert';
import test from 'node:test';
import { buildMonthlyDueDate } from '../utils/monthlyDueDate';

test('buildMonthlyDueDate uses the configured day when month has that day', () => {
    const result = buildMonthlyDueDate('2026-04', 10);

    assert.equal(result.getFullYear(), 2026);
    assert.equal(result.getMonth(), 3);
    assert.equal(result.getDate(), 10);
});

test('buildMonthlyDueDate clamps day 31 to day 30 in a 30-day month', () => {
    const result = buildMonthlyDueDate('2026-04', 31);

    assert.equal(result.getFullYear(), 2026);
    assert.equal(result.getMonth(), 3);
    assert.equal(result.getDate(), 30);
});

test('buildMonthlyDueDate clamps day 31 to day 28 in non-leap February', () => {
    const result = buildMonthlyDueDate('2026-02', 31);

    assert.equal(result.getFullYear(), 2026);
    assert.equal(result.getMonth(), 1);
    assert.equal(result.getDate(), 28);
});

test('buildMonthlyDueDate clamps day 31 to day 29 in leap-year February', () => {
    const result = buildMonthlyDueDate('2028-02', 31);

    assert.equal(result.getFullYear(), 2028);
    assert.equal(result.getMonth(), 1);
    assert.equal(result.getDate(), 29);
});
