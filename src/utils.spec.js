import { add } from './utils';
import { test, expect } from 'vitest';

test('je test la function add, je veux verrifier que 1 + 2 font 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('je test la function add, je veux verrifier que A + B font une erreur si A est une string', () => {
  expect(() => add('A', 1)).toThrow('a is not a number');
});

test('je test la function add, je veux verrifier que A + B font une erreur si B est une string', () => {
  expect(() => add(1, 'B')).toThrow('b is not a number');
});

test('je test la function add, je veux verrifier que A + B font une erreur si A est un Tableau', () => {
  expect(() => add([1,2,3,4], 'B')).toThrow('a is not a number');
});