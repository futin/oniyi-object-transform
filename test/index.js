// node core modules

// 3rd party modules
import test from 'ava';

// internal modules
import transform from '../lib';

test('should throw when called without params argument', (t) => {
  t.throws(transform, /params argument is required/);
});

test('should throw when called with no `source` or `src` param', (t) => {
  t.throws(() => {
    transform({});
  }, /either\s`params.source`\sor\s`params.src`\smust\sbe\sprovided/);
});

test('should rename property `foo` to `sports`', (t) => {
  const source = {
    foo: 'bar',
    lorem: 'ipsum',
  };

  const transformed = transform({
    source,
    map: {
      foo: 'sports',
    },
  });

  t.is(transformed.sports, source.foo, 'we expect `transformed.sports` to have the same value as `source.foo`');
});

test('should pick only property `foo` from source', (t) => {
  const source = {
    foo: 'bar',
    lorem: 'ipsum',
  };

  const transformed = transform({
    source,
    pick: ['foo'],
  });

  t.is(Object.keys(transformed).length, 1, '`transformed` is expected to only have one property');
  t.true(
    Object.prototype.hasOwnProperty.call(transformed, 'foo'),
    'we expect `transformed` to have own property `foo`'
  );
  t.is(transformed.foo, source.foo, 'we expect `transformed.foo` to equal `souroce.foo`');
});

test('should return empty object literal when `pick` param is empty array', (t) => {
  const source = {
    foo: 'bar',
    lorem: 'ipsum',
  };

  const transformed = transform({
    source,
    pick: [],
  });

  t.is(Object.keys(transformed).length, 0, 'we expect `transformed` to have zero properties');
});

test('should not ignore undefined source values after mapping', (t) => {
  const source = {
    foo: 'bar',
  };

  const transformed = transform({
    source,
    map: {
      lorem: 'ipsum',
    },
  });

  t.true('ipsum' in transformed, 'we expect `ipsum` to be property of `transformed`');
});

test('should ignore undefined source values after mapping', (t) => {
  const source = {
    foo: 'bar',
  };

  const transformed = transform({
    source,
    map: {
      lorem: 'ipsum',
    },
    ignoreUndefined: true,
  });

  t.false('ipsum' in transformed, 'we expect `ipsum` not to be property of `transformed`');
});
