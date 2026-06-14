const { compute, parseNumber } = require('../calculator');

describe('Calculator compute()', () => {
  test('addition: 2 + 3 => 5', () => {
    expect(compute('add', 2, 3)).toBe(5);
    expect(compute('+', 2, 3)).toBe(5);
  });

  test('subtraction: 10 - 4 => 6', () => {
    expect(compute('subtract', 10, 4)).toBe(6);
    expect(compute('-', 10, 4)).toBe(6);
  });

  test('multiplication: 45 * 2 => 90', () => {
    expect(compute('multiply', 45, 2)).toBe(90);
    expect(compute('*', 45, 2)).toBe(90);
  });

  test('division: 20 / 5 => 4', () => {
    expect(compute('divide', 20, 5)).toBe(4);
    expect(compute('/', 20, 5)).toBe(4);
  });

  test('division by zero returns error object', () => {
    const res = compute('divide', 5, 0);
    expect(res).toBeTruthy();
    expect(typeof res).toBe('object');
    expect(res.error).toBe('division by zero');
  });

  test('unsupported operation returns error object', () => {
    const res = compute('pow', 2, 3);
    expect(res).toBeTruthy();
    expect(typeof res).toBe('object');
    expect(res.error).toMatch(/unsupported operation/);
  });

  test('handles floats correctly', () => {
    expect(compute('+', 1.5, 2.25)).toBeCloseTo(3.75);
    expect(compute('/', 7, 2)).toBeCloseTo(3.5);
  });
});

describe('parseNumber()', () => {
  test('parses valid integers and floats', () => {
    expect(parseNumber('42')).toBe(42);
    expect(parseNumber('3.14')).toBeCloseTo(3.14);
    expect(parseNumber('-5')).toBe(-5);
  });

  test('returns null for invalid numbers', () => {
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('NaN')).toBeNull();
  });
});
