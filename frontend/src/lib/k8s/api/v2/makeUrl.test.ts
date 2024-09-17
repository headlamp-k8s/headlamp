import { describe, expect, it } from 'vitest';
import { makeUrl } from './makeUrl';

describe('makeUrl', () => {
  it('should create a URL from parts without query parameters', () => {
    const urlParts = ['http://example.com', 'path', 'to', 'resource'];
    const result = makeUrl(urlParts);
    expect(result).toBe('http://example.com/path/to/resource');
  });

  it('should create a URL from parts with query parameters', () => {
    const urlParts = ['http://example.com', 'path', 'to', 'resource'];
    const query = { key1: 'value1', key2: 'value2' };
    const result = makeUrl(urlParts, query);
    expect(result).toBe('http://example.com/path/to/resource?key1=value1&key2=value2');
  });

  it('should handle empty urlParts', () => {
    const urlParts: any[] = [];
    const result = makeUrl(urlParts);
    expect(result).toBe('');
  });

  it('should handle empty query parameters', () => {
    const urlParts = ['http://example.com', 'path', 'to', 'resource'];
    const query = {};
    const result = makeUrl(urlParts, query);
    expect(result).toBe('http://example.com/path/to/resource');
  });

  it('should replace multiple slashes with a single one', () => {
    const urlParts = ['http://example.com/', '/path/', '/to/', '/resource'];
    const result = makeUrl(urlParts);
    expect(result).toBe('http://example.com/path/to/resource');
  });

  it('should handle special characters in query parameters', () => {
    const urlParts = ['http://example.com', 'path', 'to', 'resource'];
    const query = {
      'key with spaces': 'value with spaces',
      'key&with&special&chars': 'value&with&special&chars',
    };
    const result = makeUrl(urlParts, query);
    expect(result).toBe(
      'http://example.com/path/to/resource?key+with+spaces=value+with+spaces&key%26with%26special%26chars=value%26with%26special%26chars'
    );
  });

  it('should handle numeric and boolean values in urlParts', () => {
    const urlParts = ['http://example.com', 123, true, 'resource'];
    const result = makeUrl(urlParts);
    expect(result).toBe('http://example.com/123/true/resource');
  });
});
