const sum = require('../src/utilities/sum');

describe('sum utility', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});