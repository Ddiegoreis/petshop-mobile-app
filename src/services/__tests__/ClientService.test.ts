import { strict as assert } from 'node:assert';
import test from 'node:test';
import { normalizeDueDay } from '../utils/clubinho';

test('normalizeDueDay keeps valid day unchanged', () => {
    assert.equal(normalizeDueDay(10), 10);
});

test('normalizeDueDay clamps values below 1 to 1', () => {
    assert.equal(normalizeDueDay(0), 1);
    assert.equal(normalizeDueDay(-5), 1);
});

test('normalizeDueDay clamps values above 31 to 31', () => {
    assert.equal(normalizeDueDay(32), 31);
    assert.equal(normalizeDueDay(100), 31);
});

test('normalizeDueDay truncates decimal values', () => {
    assert.equal(normalizeDueDay(15.9), 15);
});

test('normalizeDueDay falls back to day 10 for invalid values', () => {
    assert.equal(normalizeDueDay(Number.NaN), 10);
    assert.equal(normalizeDueDay(Number.POSITIVE_INFINITY), 10);
});
