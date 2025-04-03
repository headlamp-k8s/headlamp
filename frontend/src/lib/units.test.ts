import { parseCpu, parseRam, unparseCpu, unparseRam } from './units';

describe('parseRam', () => {
  it('should parse simple numbers', () => {
    expect(parseRam('1000')).toBe(1000);
    expect(parseRam('')).toBe(0);
  });

  it('should parse binary units', () => {
    expect(parseRam('1Ki')).toBe(1024);
    expect(parseRam('1Mi')).toBe(1024 * 1024);
    expect(parseRam('1Gi')).toBe(1024 * 1024 * 1024);
  });

  it('should parse decimal units', () => {
    expect(parseRam('1K')).toBe(1000);
    expect(parseRam('1M')).toBe(1000000);
    expect(parseRam('1G')).toBe(1000000000);
  });

  it('should parse exponential notation', () => {
    expect(parseRam('1e3')).toBe(1000);
    expect(parseRam('1e6')).toBe(1000000);
  });
});

describe('unparseRam', () => {
  it('should convert numbers to RAM units', () => {
    expect(unparseRam(1024)).toEqual({
      value: 1,
      unit: 'Ki',
    });

    expect(unparseRam(1024 * 1024)).toEqual({
      value: 1,
      unit: 'Mi',
    });
  });

  it('should handle fractional numbers', () => {
    expect(unparseRam(1536)).toEqual({
      value: 1.5,
      unit: 'Ki',
    });
  });

  it('should use appropriate for small values', () => {
    expect(unparseRam(1)).toEqual({
      value: 1,
      unit: '',
    });
  });
});

describe('parseCpu', () => {
  it('should parse CPU units', () => {
    expect(parseCpu('1n')).toBe(1e-9);
    expect(parseCpu('1u')).toBe(1e-6);
    expect(parseCpu('1m')).toBe(1e-3);
    expect(parseCpu('1')).toBe(1);
  });

  it('should handle empty input', () => {
    expect(parseCpu('')).toBe(0);
  });

  it('should transition between scales', () => {
    expect(parseCpu('1000m')).toBe(1);
    expect(parseCpu('999m')).toBe(0.999);
    expect(parseCpu('1000u')).toBe(1e-3);
    expect(parseCpu('0.1u')).toBe(1e-7);
  });

  it('should parse numeric values without units', () => {
    expect(parseCpu('1000')).toBe(1000);
    expect(parseCpu('1')).toBe(1);
    expect(parseCpu('0.5')).toBe(0.5);
  });
});

describe('unparseCpu', () => {
  it('should convert CPU values to millicores', () => {
    expect(unparseCpu(1)).toEqual({ value: 1, unit: '' });
    expect(unparseCpu(0.001)).toEqual({ value: 1, unit: 'm' });
    expect(unparseCpu(0.000001)).toEqual({ value: 1, unit: 'u' });
  });

  it('should round to 2 decimal places', () => {
    expect(unparseCpu(0.123)).toEqual({ value: 123, unit: 'm' });
  });
});
